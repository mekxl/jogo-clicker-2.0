import { GameState } from '../core/GameState.js';
import { ModifierSystem } from '../core/ModifierSystem.js';
import { EventBus } from '../core/EventBus.js';

export const UpgradeSystem = {
    currentChoices: [], 

    init() {
        EventBus.on("showUpgradeChoices", (choices) => {
            this.currentChoices = choices.map(c => c.id);
        });
    },

    selectUpgrade(upgradeId, forceBypass = false) {
        // Se forceBypass é true, ignora pausas/currentChoices (útil para Eventos injetando upgrades diretos)
        if (!forceBypass) {
            if (!GameState.run.isPaused) return;
            if (!this.currentChoices.includes(upgradeId)) {
                console.warn("Anti-exploit: Invalid upgrade selection.");
                return;
            }
            this.currentChoices = [];
        }

        if (!GameState.run.activeUpgrades[upgradeId]) {
            GameState.run.activeUpgrades[upgradeId] = 0;
        }
        GameState.run.activeUpgrades[upgradeId]++;

        ModifierSystem.recalculateStats();

        if (!forceBypass) {
            GameState.run.isPaused = false;
            EventBus.emit("upgradeApplied");
            EventBus.emit("stateUpdated");
        }
    }
};
