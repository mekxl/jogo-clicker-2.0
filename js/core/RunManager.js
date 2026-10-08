import { GameState } from './GameState.js';
import { ModifierSystem } from './ModifierSystem.js';
import { EncounterManager } from '../combat/EncounterManager.js';
import { EventBus } from './EventBus.js';
import { SaveSystem } from './SaveSystem.js';
import { FrenzySystem } from '../feedback/FrenzySystem.js';
import { AutomationSystem } from '../automation/AutomationSystem.js';

export const RunManager = {
    startRun() {
        GameState.resetRunState();
        ModifierSystem.recalculateStats();
        
        GameState.meta.runsPlayed++;
        GameState.run.energy = GameState.meta.metaUpgrades.energyReserve * 10;
        GameState.run.isRunActive = true;
        
        FrenzySystem.reset();
        AutomationSystem.start();

        EncounterManager.initRun();
        
        EventBus.emit("runStarted", GameState);
        EventBus.emit("stateUpdated");
    },
    
    endRun(isVictory = false) {
        if(!GameState.run.isRunActive) return;
        GameState.run.isRunActive = false;
        
        FrenzySystem.reset();
        AutomationSystem.stop();

        const stats = GameState.run.stats;
        let fovGained = Math.floor(GameState.run.totalDamage / 50) + Math.floor(GameState.run.totalClicks / 10);
        fovGained = Math.floor(fovGained * stats.fovBonus);
        
        // Bonus Vitoria + Ascension
        if (isVictory) {
            GameState.meta.runsWon++;
            fovGained += 1000; 
            
            // Tenta desbloquear nova ascension
            if (GameState.run.ascensionLevel === GameState.meta.highestAscensionUnlocked) {
                GameState.meta.highestAscensionUnlocked++;
            }
            EventBus.emit("runVictory", { runState: GameState.run, fovGained });
        } else {
            EventBus.emit("runEnded", { runState: GameState.run, fovGained });
        }

        GameState.meta.fragmentsOfVoid += fovGained;
        
        SaveSystem.save();
    },

    restartRun() {
        if (GameState.run.isRunActive) this.endRun(false); // Se desistiu
        this.startRun();
    }
};

EventBus.on("enemyDefeated", (enemy) => {
    FrenzySystem.addFrenzy(enemy.type === "BOSS" ? 50 : 10); 
    EncounterManager.onEnemyDefeated(enemy);
});
