import { GameState } from '../core/GameState.js';
import { EventBus } from '../core/EventBus.js';
import { EnemySystem } from './EnemySystem.js';
import { ENEMIES } from '../data/enemies.js';
import { RelicSystem } from '../progression/RelicSystem.js';

export const EncounterManager = {
    initRun() {
        GameState.run.encounterIndex = 1;
        this.spawnNextEncounter();
    },

    spawnNextEncounter() {
        const level = GameState.run.encounterIndex;
        const enemyKey = this.selectEnemy(level);
        
        EnemySystem.initEnemy(ENEMIES[enemyKey], level);
        EventBus.emit("encounterStarted", level);
    },

    selectEnemy(level) {
        const keys = Object.keys(ENEMIES);
        return keys[Math.floor(Math.random() * keys.length)];
    },

    onEnemyDefeated(enemy) {
        GameState.run.encounterIndex++;
        EventBus.emit("encounterCompleted", enemy);
        EventBus.emit("stateUpdated");
        
        // A cada 3 encontros, jogador ganha uma Relíquia.
        // Nos outros, spawna novo inimigo diretamente.
        setTimeout(() => {
            if (!GameState.run.isRunActive) return;
            
            if (GameState.run.encounterIndex % 3 === 0) {
                RelicSystem.triggerRelicChoice();
                // O spawn do próximo inimigo acontecerá após a escolha (ouvindo relicApplied)
            } else {
                this.spawnNextEncounter();
            }
        }, 800);
    }
};

EventBus.on("relicApplied", () => {
    // Retoma o ciclo de spawn se foi interrompido por uma recompensa de Relíquia
    if(GameState.run.isRunActive && EnemySystem.getActiveEnemy()?.state === "DEFEATED") {
        EncounterManager.spawnNextEncounter();
    }
});
