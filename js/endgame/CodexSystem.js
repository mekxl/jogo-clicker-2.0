import { GameState } from '../core/GameState.js';
import { EventBus } from '../core/EventBus.js';

export const CodexSystem = {
    init() {
        EventBus.on("enemySpawned", (enemy) => this.unlock("enemies", enemy.id));
        EventBus.on("upgradeApplied", (upgId) => this.unlock("upgrades", upgId));
        EventBus.on("relicApplied", (relicId) => this.unlock("relics", relicId));
        EventBus.on("showEvent", (evData) => this.unlock("events", evData.id));
    },

    unlock(category, id) {
        if (!id) return;
        if (!GameState.meta.codex[category]) GameState.meta.codex[category] = {};
        
        if (!GameState.meta.codex[category][id]) {
            GameState.meta.codex[category][id] = true;
            EventBus.emit("codexUpdated");
        }
    },

    isUnlocked(category, id) {
        return GameState.meta.codex[category] && GameState.meta.codex[category][id];
    }
};
