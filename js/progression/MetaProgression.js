import { GameState } from '../core/GameState.js';
import { SaveSystem } from '../core/SaveSystem.js';
import { EventBus } from '../core/EventBus.js';

export const MetaProgression = {
    upgrades: {
        startingDamage: { id: "startingDamage", name: "Starting Power", baseCost: 50, costMult: 1.5, maxLvl: 99 },
        energyReserve: { id: "energyReserve", name: "Energy Reserve", baseCost: 20, costMult: 1.5, maxLvl: 99 },
        luck: { id: "luck", name: "Probability Bias", baseCost: 200, costMult: 2.0, maxLvl: 10 },
        knowledge: { id: "knowledge", name: "Void Knowledge", baseCost: 150, costMult: 1.8, maxLvl: 20 },
        resistance: { id: "resistance", name: "Core Resistance", baseCost: 100, costMult: 1.5, maxLvl: 10 }
    },

    getCost(id) {
        const upg = this.upgrades[id];
        const lvl = GameState.meta.metaUpgrades[id];
        return Math.floor(upg.baseCost * Math.pow(upg.costMult, lvl));
    },

    buyUpgrade(id) {
        const upg = this.upgrades[id];
        if (!upg) return false;

        const cost = this.getCost(id);
        const lvl = GameState.meta.metaUpgrades[id];

        if (lvl >= upg.maxLvl) return false;
        if (GameState.meta.fragmentsOfVoid < cost) return false;

        GameState.meta.fragmentsOfVoid -= cost;
        GameState.meta.metaUpgrades[id]++;
        
        SaveSystem.save();
        EventBus.emit("metaUpdated");
        return true;
    }
};
