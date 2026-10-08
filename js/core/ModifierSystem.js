import { GameState } from './GameState.js';
import { UPGRADES } from '../data/upgrades.js';
import { RELICS, SYNERGIES } from '../data/relics.js';

export const ModifierSystem = {
    recalculateStats() {
        const r = GameState.run;
        const m = GameState.meta.metaUpgrades || { startingDamage: 0, energyReserve: 0, luck: 0, knowledge: 0, resistance: 0 };
        const evMods = r.eventModifiers || { baseDamage: 0, comboEffectiveness: 0, energyPerClick: 0 };

        let stats = {
            damagePerClick: 1 + (m.startingDamage * 1) + evMods.baseDamage,
            energyPerClick: 1 + evMods.energyPerClick,
            critChance: 0.0,
            critMultiplier: 1.5,
            comboEffectiveness: 1.0 + evMods.comboEffectiveness,
            globalMultiplier: 1.0,
            fovBonus: 1.0 + (m.knowledge * 0.05),
            breakDamage: 1, breakMultiplier: 1.5, breakDurationMs: 3000,
            comboGlobalMod: 0, comboCritBonus: 0, comboEnergyBonus: 0, critEnergyBonus: 0, breakAutoCrit: 0, luckBonus: (m.luck * 0.05),
            autoSpeedMult: 1.0, autoDamageMult: 1.0, frenzyMultiplierBonus: 2.0, frenzyDurationMs: 5000
        };

        const flatEffects = [];
        const multiEffects = [];

        for (const [upgId, count] of Object.entries(r.activeUpgrades || {})) {
            const upgData = UPGRADES && UPGRADES.find(u => u.id === upgId);
            if (upgData && upgData.effects) {
                for (let i = 0; i < count; i++) {
                    if (upgData.effects.globalMultiplier) multiEffects.push(upgData.effects);
                    else flatEffects.push(upgData.effects);
                }
            }
        }

        for (const [relicId, count] of Object.entries(r.activeRelics || {})) {
            const relData = RELICS && RELICS.find(rx => rx.id === relicId);
            if (relData && relData.effects) {
                for (let i = 0; i < count; i++) {
                    if (relData.effects.globalMultiplier) multiEffects.push(relData.effects);
                    else flatEffects.push(relData.effects);
                }
            }
        }

        for (const synId of (r.activeSynergies || [])) {
            const synData = SYNERGIES && SYNERGIES.find(s => s.id === synId);
            if (synData && synData.effects) {
                if (synData.effects.globalMultiplier) multiEffects.push(synData.effects);
                else flatEffects.push(synData.effects);
            }
        }

        flatEffects.forEach(eff => {
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
            if (eff.autoSpeedMult) stats.autoSpeedMult += eff.autoSpeedMult;
            if (eff.autoDamageMult) stats.autoDamageMult += eff.autoDamageMult;
            if (eff.frenzyMultiplierBonus) stats.frenzyMultiplierBonus += eff.frenzyMultiplierBonus;
        });

        multiEffects.forEach(eff => {
            if (eff.globalMultiplier) stats.globalMultiplier *= eff.globalMultiplier;
        });

        if (r.comboMultiplier > 1) {
            stats.globalMultiplier += (stats.comboGlobalMod * (r.comboMultiplier - 1));
            stats.critChance += stats.comboCritBonus;
        }

        if (r.frenzy && r.frenzy.isActive) {
            stats.globalMultiplier *= stats.frenzyMultiplierBonus;
        }

        r.stats = stats;
    }
};
