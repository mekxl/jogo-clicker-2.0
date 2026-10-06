import { GameState } from '../core/GameState.js';
import { ModifierSystem } from '../core/ModifierSystem.js';
import { EventBus } from '../core/EventBus.js';

export const UpgradeSystem = {
    currentChoices: [], // Estado de segurança anti-exploit

    init() {
        EventBus.on("showUpgradeChoices", (choices) => {
            this.currentChoices = choices.map(c => c.id);
        });
    },

    selectUpgrade(upgradeId) {
        if (!GameState.run.isPaused) return;
        if (!this.currentChoices.includes(upgradeId)) {
            console.warn("Anti-exploit: Invalid upgrade selection.");
            return;
        }

        // Limpa escolhas para impedir duplo clique
        this.currentChoices = [];

        // Adiciona ao stack
        if (!GameState.run.activeUpgrades[upgradeId]) {
            GameState.run.activeUpgrades[upgradeId] = 0;
        }
        GameState.run.activeUpgrades[upgradeId]++;

        // Recalcula stats
        ModifierSystem.recalculateStats();

        // Retoma o jogo
        GameState.run.isPaused = false;
        EventBus.emit("upgradeApplied");
        EventBus.emit("stateUpdated");
    }
};
