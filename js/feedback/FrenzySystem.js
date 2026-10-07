import { GameState } from '../core/GameState.js';
import { EventBus } from '../core/EventBus.js';
import { ModifierSystem } from '../core/ModifierSystem.js';

export const FrenzySystem = {
    maxMeter: 100,
    frenzyTimer: null,

    addFrenzy(amount) {
        if (GameState.run.frenzy.isActive || !GameState.run.isRunActive || GameState.run.isPaused) return;
        
        GameState.run.frenzy.meter += amount;
        
        if (GameState.run.frenzy.meter >= this.maxMeter) {
            GameState.run.frenzy.meter = this.maxMeter;
            this.triggerFrenzy();
        }
        EventBus.emit("frenzyUpdated");
    },

    triggerFrenzy() {
        GameState.run.frenzy.isActive = true;
        GameState.run.frenzy.meter = 0;
        
        ModifierSystem.recalculateStats();
        EventBus.emit("frenzyStarted");
        EventBus.emit("stateUpdated");

        const durationMs = GameState.run.stats.frenzyDurationMs || 5000;
        
        if (this.frenzyTimer) clearTimeout(this.frenzyTimer);
        this.frenzyTimer = setTimeout(() => {
            this.endFrenzy();
        }, durationMs);
    },

    endFrenzy() {
        GameState.run.frenzy.isActive = false;
        if (this.frenzyTimer) {
            clearTimeout(this.frenzyTimer);
            this.frenzyTimer = null;
        }
        ModifierSystem.recalculateStats();
        EventBus.emit("frenzyEnded");
        EventBus.emit("stateUpdated");
    },

    reset() {
        this.endFrenzy();
        GameState.run.frenzy.meter = 0;
    }
};
