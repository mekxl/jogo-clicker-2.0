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
        
        GameState.run.energy = GameState.meta.metaUpgrades.energyReserve * 10;
        GameState.run.isRunActive = true;
        
        FrenzySystem.reset();
        AutomationSystem.start();

        EncounterManager.initRun();
        
        EventBus.emit("runStarted", GameState);
        EventBus.emit("stateUpdated");
    },
    
    endRun() {
        if(!GameState.run.isRunActive) return;
        GameState.run.isRunActive = false;
        
        FrenzySystem.reset();
        AutomationSystem.stop();

        const stats = GameState.run.stats;
        let fovGained = Math.floor(GameState.run.totalDamage / 50) + Math.floor(GameState.run.totalClicks / 10);
        fovGained = Math.floor(fovGained * stats.fovBonus);

        GameState.meta.fragmentsOfVoid += fovGained;
        
        SaveSystem.save();
        EventBus.emit("runEnded", { runState: GameState.run, fovGained });
    },

    restartRun() {
        this.endRun();
        this.startRun();
    }
};

EventBus.on("enemyDefeated", (enemy) => {
    FrenzySystem.addFrenzy(enemy.type === "BOSS" ? 50 : 10); 
    EncounterManager.onEnemyDefeated(enemy);
});
