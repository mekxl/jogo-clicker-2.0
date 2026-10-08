import { GameState } from './GameState.js';
import { ModifierSystem } from './ModifierSystem.js';
import { EncounterManager } from '../combat/EncounterManager.js';
import { EventBus } from './EventBus.js';
import { SaveSystem } from './SaveSystem.js';
import { FrenzySystem } from '../feedback/FrenzySystem.js';
import { AutomationSystem } from '../automation/AutomationSystem.js';

export const RunManager = {
    startRun() {
        try {
            GameState.resetRunState();
            ModifierSystem.recalculateStats();
            
            GameState.meta.runsPlayed++;
            
            const reserve = GameState.meta.metaUpgrades ? GameState.meta.metaUpgrades.energyReserve : 0;
            GameState.run.energy = reserve * 10;
            GameState.run.isRunActive = true;
            
            FrenzySystem.reset();
            AutomationSystem.start();

            EncounterManager.initRun();
            
            EventBus.emit("runStarted", GameState);
            EventBus.emit("stateUpdated");
        } catch (e) {
            console.error("FALHA CRÍTICA NO START RUN:", e);
        }
    },
    
    endRun(isVictory = false) {
        if(!GameState.run.isRunActive) return;
        GameState.run.isRunActive = false;
        
        FrenzySystem.reset();
        AutomationSystem.stop();

        const stats = GameState.run.stats || { fovBonus: 1.0 };
        let fovGained = Math.floor(GameState.run.totalDamage / 50) + Math.floor(GameState.run.totalClicks / 10);
        fovGained = Math.floor(fovGained * stats.fovBonus);
        
        if (isVictory) {
            GameState.meta.runsWon++;
            fovGained += 1000; 
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
        if (GameState.run.isRunActive) this.endRun(false); 
        this.startRun();
    }
};

EventBus.on("enemyDefeated", (enemy) => {
    FrenzySystem.addFrenzy(enemy.type === "BOSS" ? 50 : 10); 
    EncounterManager.onEnemyDefeated(enemy);
});
