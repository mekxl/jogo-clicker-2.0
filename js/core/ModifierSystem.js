import { GameState } from './GameState.js';
import { UPGRADES } from '../data/upgrades.js';
import { RELICS, SYNERGIES } from '../data/relics.js';

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
            fovBonus: 1.0 + (m.knowledge * 0.05),
            breakDamage: 1,
            breakMultiplier: 1.5,
            breakDurationMs: 3000,
            comboGlobalMod: 0,
            comboCritBonus: 0,
            comboEnergyBonus: 0,
            critEnergyBonus: 0,
            breakAutoCrit: 0,
            luckBonus: (m.luck * 0.05)
        };

        // Arrays para aplicar efeitos na ordem correta
        const flatEffects = [];
        const multiEffects = [];

        // 2. Coletar Efeitos (Upgrades)
        for (const [upgId, count] of Object.entries(r.activeUpgrades)) {
            const upgradeData = UPGRADES.find(u => u.id === upgId);
            if (!upgradeData) continue;
            for (let i = 0; i < count; i++) {
                if (upgradeData.effects.globalMultiplier) multiEffects.push(upgradeData.effects);
                else flatEffects.push(upgradeData.effects);
            }
        }

        // 3. Coletar Efeitos (Relíquias)
        for (const [relicId, count] of Object.entries(r.activeRelics)) {
            const relicData = RELICS.find(r => r.id === relicId);
            if (!relicData) continue;
            for (let i = 0; i < count; i++) {
                if (relicData.effects.globalMultiplier) multiEffects.push(relicData.effects);
                else flatEffects.push(relicData.effects);
            }
        }

        // 4. Coletar Efeitos (Sinergias)
        for (const synId of r.activeSynergies) {
            const synData = SYNERGIES.find(s => s.id === synId);
            if (!synData) continue;
            if (synData.effects.globalMultiplier) multiEffects.push(synData.effects);
            else flatEffects.push(synData.effects);
        }

        // 5. Aplicar Flat Effects
        const applyFlat = (eff) => {
            if (eff.baseDamage) stats.damagePerClick += eff.baseDamage;
            if (eff.energyPerClick) stats.energyPerClick += eff.energyPerClick;
            if (eff.critChance) stats.critChance += eff.critChance;
            if (eff.critMultiplier) stats.critMultiplier += eff.critMultiplier;
            if (eff.comboEffectiveness) stats.comboEffectiveness += eff.comboEffectiveness;
            if (eff.breakDamage) stats.breakDamage += eff.breakDamage;
            if (eff.breakMultiplierBonus) stats.breakMultiplier += eff.breakMultiplierBonus;
            if (eff.breakDurationBonusMs) stats.breakDurationMs += eff.breakDurationBonusMs;
            if (eff.fovBonus) stats.fovBonus += eff.fovBonus;
            if (eff.luckBonus) stats.luckBonus += eff.luckBonus;
            if (eff.comboGlobalMod) stats.comboGlobalMod += eff.comboGlobalMod;
            if (eff.comboCritBonus) stats.comboCritBonus += eff.comboCritBonus;
            if (eff.comboEnergyBonus) stats.comboEnergyBonus += eff.comboEnergyBonus;
            if (eff.critEnergyBonus) stats.critEnergyBonus += eff.critEnergyBonus;
            if (eff.breakAutoCrit) stats.breakAutoCrit += eff.breakAutoCrit;
        };

        flatEffects.forEach(applyFlat);

        // 6. Aplicar Modificadores Multiplicativos
        multiEffects.forEach(eff => {
            if (eff.globalMultiplier) stats.globalMultiplier *= eff.globalMultiplier;
        });

        // Resolve condicionais fixas já testáveis no stat recalculado
        // (Ex: Se comboMultiplier existir, aplique os bônus fixos atrelados a combo layer)
        if (r.comboMultiplier > 1) {
            stats.globalMultiplier += (stats.comboGlobalMod * (r.comboMultiplier - 1));
            stats.critChance += stats.comboCritBonus;
        }

        r.stats = stats;
    }
};
