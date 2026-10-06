import { GameState } from '../core/GameState.js';
import { EventBus } from '../core/EventBus.js';
import { EnemySystem } from './EnemySystem.js';
import { ENEMIES } from '../data/enemies.js';

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
        // Bosses system placeholder: if(level % 10 === 0) return selectBoss();
        return keys[Math.floor(Math.random() * keys.length)];
    },

    onEnemyDefeated(enemy) {
        GameState.run.encounterIndex++;
        EventBus.emit("encounterCompleted", enemy);
        EventBus.emit("stateUpdated"); // Atualiza UI para mostrar "0 HP" e estado "DEFEATED"
        
        // Delay visual antes do próximo spawn
        setTimeout(() => {
            if (GameState.run.isRunActive) {
                this.spawnNextEncounter();
            }
        }, 800);
    }
};
