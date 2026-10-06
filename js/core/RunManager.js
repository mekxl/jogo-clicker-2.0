import { GameState } from './GameState.js';
import { TargetSystem } from '../combat/TargetSystem.js';
import { EventBus } from './EventBus.js';

export const RunManager = {
    startRun() {
        GameState.resetRunState();
        GameState.run.isRunActive = true;
        
        // Define alvo inicial
        TargetSystem.initTarget(1, "CORE NODE Alpha", 100);
        
        EventBus.emit("runStarted", GameState);
    },
    endRun() {
        GameState.run.isRunActive = false;
        EventBus.emit("runEnded", GameState);
    },
    restartRun() {
        this.endRun();
        this.startRun();
    }
};

// Auto-gerenciamento de regras de fim de run
EventBus.on("targetDefeated", () => {
    RunManager.endRun();
});
