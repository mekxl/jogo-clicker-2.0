import { GameState } from '../core/GameState.js';
import { EventBus } from '../core/EventBus.js';
import { EnemySystem } from './EnemySystem.js';

export const BreakSystem = {
    breakMultiplier: 1.5,
    breakDurationMs: 3000,
    breakTimer: null,

    takeBreakDamage(amount) {
        const enemy = EnemySystem.getActiveEnemy();
        // Apenas aplica dano de BREAK se o inimigo estiver ativo e vulnerável a ser quebrado
        if (!enemy || enemy.state !== "ACTIVE") return;

        enemy.breakCurrent -= amount;
        
        if (enemy.breakCurrent <= 0) {
            enemy.breakCurrent = 0;
            this.triggerBreak(enemy);
        }
    },

    triggerBreak(enemy) {
        enemy.state = "BREAKING";
        GameState.run.totalBreaks = (GameState.run.totalBreaks || 0) + 1;
        
        EventBus.emit("breakTriggered", enemy);
        EventBus.emit("stateUpdated");
        
        if (this.breakTimer) clearTimeout(this.breakTimer);
        
        // Ciclo de recuperação do BREAK
        this.breakTimer = setTimeout(() => {
            this.recoverBreak(enemy);
        }, this.breakDurationMs);
    },

    recoverBreak(enemy) {
        if (!enemy || enemy.state !== "BREAKING") return;
        
        enemy.state = "ACTIVE";
        enemy.breakCurrent = enemy.breakMax;
        
        EventBus.emit("breakRecovered", enemy);
        EventBus.emit("stateUpdated");
    },

    cancelBreakTimer() {
        if (this.breakTimer) {
            clearTimeout(this.breakTimer);
            this.breakTimer = null;
        }
    }
};
