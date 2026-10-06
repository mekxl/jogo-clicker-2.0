import { GameState } from './GameState.js';
import { ModifierSystem } from './ModifierSystem.js';
import { EncounterManager } from '../combat/EncounterManager.js';
import { EventBus } from './EventBus.js';
import { SaveSystem } from './SaveSystem.js';

export const RunManager = {
    startRun() {
        GameState.resetRunState();
        ModifierSystem.recalculateStats();
        
        GameState.run.energy = GameState.meta.metaUpgrades.energyReserve * 10;
        GameState.run.isRunActive = true;
        
        // Delega o ciclo inicial para o EncounterManager
        EncounterManager.initRun();
        
        EventBus.emit("runStarted", GameState);
        EventBus.emit("stateUpdated");
    },
    
    endRun() {
        if(!GameState.run.isRunActive) return;
        GameState.run.isRunActive = false;

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

// Integração de fluxo vital
EventBus.on("enemyDefeated", (enemy) => {
    EncounterManager.onEnemyDefeated(enemy);
});
