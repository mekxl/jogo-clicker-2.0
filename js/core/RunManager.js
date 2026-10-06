import { GameState } from './GameState.js';
import { TargetSystem } from '../combat/TargetSystem.js';
import { ModifierSystem } from './ModifierSystem.js';
import { EventBus } from './EventBus.js';
import { SaveSystem } from './SaveSystem.js';

export const RunManager = {
    startRun() {
        GameState.resetRunState();
        ModifierSystem.recalculateStats(); // Aplica MetaUpgrades antes de começar
        
        // Aplica energia reserva
        GameState.run.energy = GameState.meta.metaUpgrades.energyReserve * 10;
        
        GameState.run.isRunActive = true;
        
        // HP do Core AUMENTADO para permitir gameplay roguelite
        TargetSystem.initTarget(1, "CORE NODE Alpha", 1000000); 
        
        EventBus.emit("runStarted", GameState);
        EventBus.emit("stateUpdated");
    },
    
    endRun() {
        if(!GameState.run.isRunActive) return;
        GameState.run.isRunActive = false;

        // Calcula recompensas permanentes
        const stats = GameState.run.stats;
        let fovGained = Math.floor(GameState.run.totalDamage / 50) + Math.floor(GameState.run.totalClicks / 10);
        fovGained = Math.floor(fovGained * stats.fovBonus);

        GameState.meta.fragmentsOfVoid += fovGained;
        
        SaveSystem.save(); // Salva o progresso no fim da run

        EventBus.emit("runEnded", { runState: GameState.run, fovGained });
    },

    restartRun() {
        this.endRun();
        this.startRun();
    }
};

EventBus.on("targetDefeated", () => {
    RunManager.endRun();
});
