import { GameState } from '../core/GameState.js';
import { EventBus } from '../core/EventBus.js';
import { EnemySystem } from './EnemySystem.js';

export const BreakSystem = {
    breakTimer: null,

    takeBreakDamage(amount) {
        const enemy = EnemySystem.getActiveEnemy();
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
        
        const duration = GameState.run.stats.breakDurationMs || 3000;
        
        this.breakTimer = setTimeout(() => {
            this.recoverBreak(enemy);
        }, duration);
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
