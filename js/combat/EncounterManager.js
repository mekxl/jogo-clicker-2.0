import { GameState } from '../core/GameState.js';
import { EventBus } from '../core/EventBus.js';
import { EnemySystem } from './EnemySystem.js';
import { ENEMIES } from '../data/enemies.js';
import { RelicSystem } from '../progression/RelicSystem.js';
import { EventSystem } from '../events/EventSystem.js';
import { MerchantSystem } from '../events/MerchantSystem.js';

export const EncounterManager = {
    initRun() {
        GameState.run.encounterIndex = 0;
        this.advanceNode();
    },

    advanceNode() {
        if (!GameState.run.isRunActive) return;
        GameState.run.encounterIndex++;
        const nodeIndex = GameState.run.encounterIndex;

        EventBus.emit("encounterStarted", nodeIndex);

        // O Fluxo Linear dos Nodos:
        // A cada 5 Nodos -> Merchant
        // A cada 4 Nodos (exceto se for múltiplo de 5) -> Event
        // Outros -> Combat

        if (nodeIndex % 5 === 0) {
            MerchantSystem.triggerMerchant();
        } else if (nodeIndex % 4 === 0) {
            EventSystem.triggerRandomEvent();
        } else {
            // Se o evento RIFT ativou "skipNextCombat", pulamos esse nodo.
            if (GameState.run.skipNextCombat) {
                GameState.run.skipNextCombat = false;
                setTimeout(() => this.advanceNode(), 500); // UI feedback curto e pula
            } else {
                this.spawnCombat();
            }
        }
    },

    spawnCombat() {
        const level = GameState.run.encounterIndex;
        const keys = Object.keys(ENEMIES);
        const enemyKey = keys[Math.floor(Math.random() * keys.length)];
        
        EnemySystem.initEnemy(ENEMIES[enemyKey], level);
    },

    onEnemyDefeated(enemy) {
        GameState.run.combatCount++;
        EventBus.emit("encounterCompleted", enemy);
        EventBus.emit("stateUpdated");
        
        setTimeout(() => {
            if (!GameState.run.isRunActive) return;
            
            // Relíquias dropam a cada 3 Combates efetivos, independente do número do Nodo
            if (GameState.run.combatCount % 3 === 0) {
                RelicSystem.triggerRelicChoice();
                // O loop retorna pelo listener de "relicApplied" abaixo
            } else {
                this.advanceNode();
            }
        }, 800);
    }
};

// Integrações do fluxo de EventBus para continuar a jornada
EventBus.on("relicApplied", () => {
    if(GameState.run.isRunActive && EnemySystem.getActiveEnemy()?.state === "DEFEATED") {
        EncounterManager.advanceNode();
    }
});

EventBus.on("eventResolved", () => {
    if(GameState.run.isRunActive) {
        setTimeout(() => EncounterManager.advanceNode(), 800);
    }
});

EventBus.on("merchantClosed", () => {
    if(GameState.run.isRunActive) {
        setTimeout(() => EncounterManager.advanceNode(), 800);
    }
});
