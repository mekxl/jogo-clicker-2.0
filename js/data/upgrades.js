// DATA-ONLY: Sem lógica de aplicação aqui.
export const UPGRADE_RARITIES = {
    COMMON: { id: "COMMON", weight: 60, color: "#aaaaaa" },
    UNCOMMON: { id: "UNCOMMON", weight: 25, color: "#00cc44" },
    RARE: { id: "RARE", weight: 10, color: "#0066ff" },
    EPIC: { id: "EPIC", weight: 4, color: "#aa00ff" },
    LEGENDARY: { id: "LEGENDARY", weight: 1, color: "#ffaa00" }
};

export const UPGRADES = [
    // --- CLICK ---
    { id: "click_power_1", name: "Sharpened Edge", description: "+1 Base Damage per Click", rarity: "COMMON", tags: ["CLICK"], effects: { baseDamage: 1 }, stackLimit: 10 },
    { id: "click_power_2", name: "Heavy Impact", description: "+3 Base Damage per Click", rarity: "UNCOMMON", tags: ["CLICK"], effects: { baseDamage: 3 }, stackLimit: 5 },
    { id: "click_power_3", name: "Void Strike", description: "+10 Base Damage per Click", rarity: "RARE", tags: ["CLICK", "VOID"], effects: { baseDamage: 10 }, stackLimit: 3 },
    { id: "click_power_4", name: "Annihilation", description: "+50 Base Damage per Click", rarity: "EPIC", tags: ["CLICK"], effects: { baseDamage: 50 }, stackLimit: 1 },
    
    // --- ENERGY ---
    { id: "energy_gain_1", name: "Static Charge", description: "+1 Energy per Click", rarity: "COMMON", tags: ["ENERGY"], effects: { energyPerClick: 1 }, stackLimit: 5 },
    { id: "energy_gain_2", name: "Kinetic Dynamo", description: "+3 Energy per Click", rarity: "UNCOMMON", tags: ["ENERGY"], effects: { energyPerClick: 3 }, stackLimit: 3 },
    { id: "energy_max_1", name: "Capacitor", description: "+50 Max Energy (Future Prep)", rarity: "COMMON", tags: ["ENERGY"], effects: { maxEnergy: 50 }, stackLimit: 10 },

    // --- COMBO ---
    { id: "combo_power_1", name: "Momentum", description: "Combo Multiplier affects Damage by +0.5x", rarity: "UNCOMMON", tags: ["COMBO"], effects: { comboEffectiveness: 0.5 }, stackLimit: 4 },
    { id: "combo_power_2", name: "Flow State", description: "Combo Multiplier affects Damage by +1.0x", rarity: "RARE", tags: ["COMBO"], effects: { comboEffectiveness: 1.0 }, stackLimit: 2 },
    { id: "combo_starter", name: "Quick Build", description: "Start combos faster (Pre-calc)", rarity: "UNCOMMON", tags: ["COMBO"], effects: { comboGeneration: 1 }, stackLimit: 3 },

    // --- CRIT (Placeholder for DamageSystem integration) ---
    { id: "crit_chance_1", name: "Precision", description: "+5% Critical Chance", rarity: "COMMON", tags: ["CRIT"], effects: { critChance: 0.05 }, stackLimit: 10 },
    { id: "crit_chance_2", name: "Targeted Weakness", description: "+10% Critical Chance", rarity: "RARE", tags: ["CRIT"], effects: { critChance: 0.10 }, stackLimit: 5 },
    { id: "crit_dmg_1", name: "Shatter", description: "+20% Critical Damage", rarity: "UNCOMMON", tags: ["CRIT"], effects: { critMultiplier: 0.2 }, stackLimit: 10 },
    { id: "crit_dmg_2", name: "Devastate", description: "+50% Critical Damage", rarity: "EPIC", tags: ["CRIT"], effects: { critMultiplier: 0.5 }, stackLimit: 3 },

    // --- RISK / CONDITIONAL ---
    { id: "risk_desperation", name: "Desperation", description: "+100% Damage if target HP > 90%", rarity: "RARE", tags: ["RISK"], effects: { firstStrikeMultiplier: 1.0 }, stackLimit: 1 },
    { id: "risk_execute", name: "Execute", description: "Insta-kill chance +1% (Prep)", rarity: "EPIC", tags: ["RISK"], effects: { executeChance: 0.01 }, stackLimit: 5 },

    // --- UTILITY / AUTOMATION (Prep) ---
    { id: "auto_clicker_1", name: "Phantom Click", description: "Clicks 1 time per second (Prep)", rarity: "RARE", tags: ["AUTOMATION"], effects: { autoClicksPerSec: 1 }, stackLimit: 5 },
    
    // --- SPECIAL / LEGENDARY ---
    { id: "leg_singularity", name: "Singularity", description: "Base Damage x2, Energy Gain x2", rarity: "LEGENDARY", tags: ["CLICK", "ENERGY"], effects: { globalMultiplier: 2.0 }, stackLimit: 1 },
    { id: "leg_void_resonance", name: "Void Resonance", description: "Crits guarantee extra FoV at end of run", rarity: "LEGENDARY", tags: ["VOID", "CRIT"], effects: { fovCritBonus: 1 }, stackLimit: 1 },
    { id: "leg_core_break", name: "Core Breaker", description: "Allows triggering BREAK (Prep)", rarity: "LEGENDARY", tags: ["BREAK"], effects: { breakEnabled: 1 }, stackLimit: 1 }
];
