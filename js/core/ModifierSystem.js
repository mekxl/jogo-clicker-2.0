import { GameState } from './GameState.js';
import { UPGRADES } from '../data/upgrades.js';

export const ModifierSystem = {
    recalculateStats() {
        const r = GameState.run;
        const m = GameState.meta.metaUpgrades;

        // 1. Base Stats + Meta Upgrades
        let stats = {
            damagePerClick: 1 + (m.startingDamage * 1),
            energyPerClick: 1,
            critChance: 0.0,
            critMultiplier: 1.5,
            comboEffectiveness: 1.0,
            globalMultiplier: 1.0,
            fovBonus: 1.0 + (m.knowledge * 0.05)
        };

        // Adiciona energia inicial se for o início da run (gerenciado externamente, aqui apenas definimos os caps se houver)

        // 2. Run Upgrades
        for (const [upgId, count] of Object.entries(r.activeUpgrades)) {
            const upgradeData = UPGRADES.find(u => u.id === upgId);
            if (!upgradeData) continue;
            
            for (let i = 0; i < count; i++) {
                const eff = upgradeData.effects;
                if (eff.baseDamage) stats.damagePerClick += eff.baseDamage;
                if (eff.energyPerClick) stats.energyPerClick += eff.energyPerClick;
                if (eff.critChance) stats.critChance += eff.critChance;
                if (eff.critMultiplier) stats.critMultiplier += eff.critMultiplier;
                if (eff.comboEffectiveness) stats.comboEffectiveness += eff.comboEffectiveness;
                if (eff.globalMultiplier) stats.globalMultiplier *= eff.globalMultiplier; // Multiplicativo
            }
        }

        r.stats = stats;
    }
};
