// DATA-ONLY: Definição de Relíquias e Sinergias
export const RELICS = [
    // --- CLICK (1-10) ---
    { id: "r_click_1", name: "Iron Finger", description: "+5 Base Damage", rarity: "COMMON", tags: ["CLICK"], unique: false, stackable: true, stackLimit: 5, effects: { baseDamage: 5 } },
    { id: "r_click_2", name: "Heavy Gauntlet", description: "+15 Base Damage", rarity: "UNCOMMON", tags: ["CLICK"], unique: false, stackable: true, stackLimit: 3, effects: { baseDamage: 15 } },
    { id: "r_click_3", name: "Titan's Grip", description: "+50 Base Damage", rarity: "RARE", tags: ["CLICK"], unique: false, stackable: true, stackLimit: 2, effects: { baseDamage: 50 } },
    { id: "r_click_4", name: "Click Core", description: "Global Damage +10%", rarity: "RARE", tags: ["CLICK"], unique: false, stackable: true, stackLimit: 3, effects: { globalMultiplier: 1.1 } },
    { id: "r_click_5", name: "Void Touch", description: "+100 Base Damage", rarity: "EPIC", tags: ["CLICK", "VOID"], unique: true, stackable: false, stackLimit: 1, effects: { baseDamage: 100 } },
    { id: "r_click_6", name: "Rhythm Maker", description: "+2 Base Damage", rarity: "COMMON", tags: ["CLICK"], unique: false, stackable: true, stackLimit: 10, effects: { baseDamage: 2 } },
    { id: "r_click_7", name: "Force Spreader", description: "Global Damage +5%", rarity: "UNCOMMON", tags: ["CLICK"], unique: false, stackable: true, stackLimit: 5, effects: { globalMultiplier: 1.05 } },
    { id: "r_click_8", name: "Sunderer", description: "+200 Base Damage, -10% Crit", rarity: "EPIC", tags: ["CLICK", "RISK"], unique: true, stackable: false, stackLimit: 1, effects: { baseDamage: 200, critChance: -0.1 } },
    { id: "r_click_9", name: "God's Index", description: "+500 Base Damage", rarity: "LEGENDARY", tags: ["CLICK"], unique: true, stackable: false, stackLimit: 1, effects: { baseDamage: 500 } },
    { id: "r_click_10", name: "Echo Click", description: "Global Damage +20%", rarity: "LEGENDARY", tags: ["CLICK", "MULTIPLIER"], unique: true, stackable: false, stackLimit: 1, effects: { globalMultiplier: 1.2 } },

    // --- COMBO (11-20) ---
    { id: "r_combo_1", name: "Metronome", description: "Combo Effectiveness +0.2x", rarity: "COMMON", tags: ["COMBO"], unique: false, stackable: true, stackLimit: 5, effects: { comboEffectiveness: 0.2 } },
    { id: "r_combo_2", name: "Flow Ring", description: "Combo Effectiveness +0.5x", rarity: "UNCOMMON", tags: ["COMBO"], unique: false, stackable: true, stackLimit: 3, effects: { comboEffectiveness: 0.5 } },
    { id: "r_combo_3", name: "Hurricane Eye", description: "Combo Effectiveness +1.0x", rarity: "RARE", tags: ["COMBO"], unique: false, stackable: true, stackLimit: 2, effects: { comboEffectiveness: 1.0 } },
    { id: "r_combo_4", name: "Combo Core", description: "Start Combo faster", rarity: "RARE", tags: ["COMBO"], unique: true, stackable: false, stackLimit: 1, effects: { comboGeneration: 2 } },
    { id: "r_combo_5", name: "Infinite Spiral", description: "Combo Effectiveness +2.5x", rarity: "EPIC", tags: ["COMBO"], unique: true, stackable: false, stackLimit: 1, effects: { comboEffectiveness: 2.5 } },
    { id: "r_combo_6", name: "Focus Lens", description: "Global Damage +5% per Combo tier", rarity: "UNCOMMON", tags: ["COMBO"], unique: false, stackable: true, stackLimit: 3, effects: { comboGlobalMod: 0.05 } },
    { id: "r_combo_7", name: "Blur", description: "Combo Effectiveness +0.3x", rarity: "COMMON", tags: ["COMBO", "SPEED"], unique: false, stackable: true, stackLimit: 5, effects: { comboEffectiveness: 0.3 } },
    { id: "r_combo_8", name: "Trance State", description: "+15% Crit Chance during Combo", rarity: "EPIC", tags: ["COMBO", "CRIT"], unique: true, stackable: false, stackLimit: 1, effects: { comboCritBonus: 0.15 } },
    { id: "r_combo_9", name: "Ascendant Rhythm", description: "Combo Effectiveness +5.0x", rarity: "LEGENDARY", tags: ["COMBO"], unique: true, stackable: false, stackLimit: 1, effects: { comboEffectiveness: 5.0 } },
    { id: "r_combo_10", name: "Storm Caller", description: "Combo boosts Energy +1", rarity: "RARE", tags: ["COMBO", "ENERGY"], unique: true, stackable: false, stackLimit: 1, effects: { comboEnergyBonus: 1 } },

    // --- CRIT (21-30) ---
    { id: "r_crit_1", name: "Eagle Eye", description: "+5% Crit Chance", rarity: "COMMON", tags: ["CRIT"], unique: false, stackable: true, stackLimit: 5, effects: { critChance: 0.05 } },
    { id: "r_crit_2", name: "Assassin's Dagger", description: "+10% Crit Chance", rarity: "UNCOMMON", tags: ["CRIT"], unique: false, stackable: true, stackLimit: 3, effects: { critChance: 0.10 } },
    { id: "r_crit_3", name: "Serrated Edge", description: "+30% Crit Damage", rarity: "COMMON", tags: ["CRIT"], unique: false, stackable: true, stackLimit: 5, effects: { critMultiplier: 0.3 } },
    { id: "r_crit_4", name: "Executioner Axe", description: "+100% Crit Damage", rarity: "RARE", tags: ["CRIT"], unique: false, stackable: true, stackLimit: 2, effects: { critMultiplier: 1.0 } },
    { id: "r_crit_5", name: "Crit Core", description: "+15% Crit Chance, +50% Crit Dmg", rarity: "EPIC", tags: ["CRIT"], unique: true, stackable: false, stackLimit: 1, effects: { critChance: 0.15, critMultiplier: 0.5 } },
    { id: "r_crit_6", name: "Lucky Coin", description: "+2% Crit Chance", rarity: "COMMON", tags: ["CRIT", "LUCK"], unique: false, stackable: true, stackLimit: 10, effects: { critChance: 0.02 } },
    { id: "r_crit_7", name: "Fatal Flaw", description: "+200% Crit Dmg, -5% Crit Chance", rarity: "RARE", tags: ["CRIT", "RISK"], unique: false, stackable: true, stackLimit: 2, effects: { critMultiplier: 2.0, critChance: -0.05 } },
    { id: "r_crit_8", name: "Vampiric Fang", description: "Crits give +2 Energy", rarity: "EPIC", tags: ["CRIT", "ENERGY"], unique: true, stackable: false, stackLimit: 1, effects: { critEnergyBonus: 2 } },
    { id: "r_crit_9", name: "Doom Bringer", description: "+50% Crit Chance", rarity: "LEGENDARY", tags: ["CRIT"], unique: true, stackable: false, stackLimit: 1, effects: { critChance: 0.50 } },
    { id: "r_crit_10", name: "Oblivion Strike", description: "+500% Crit Damage", rarity: "LEGENDARY", tags: ["CRIT", "MULTIPLIER"], unique: true, stackable: false, stackLimit: 1, effects: { critMultiplier: 5.0 } },

    // --- BREAK (31-40) ---
    { id: "r_break_1", name: "Shattering Hammer", description: "+1 Break Damage", rarity: "UNCOMMON", tags: ["BREAK"], unique: false, stackable: true, stackLimit: 5, effects: { breakDamage: 1 } },
    { id: "r_break_2", name: "Seismic Wave", description: "+3 Break Damage", rarity: "RARE", tags: ["BREAK"], unique: false, stackable: true, stackLimit: 3, effects: { breakDamage: 3 } },
    { id: "r_break_3", name: "Vulnerability Hex", description: "+0.5x Dmg during Break", rarity: "UNCOMMON", tags: ["BREAK"], unique: false, stackable: true, stackLimit: 4, effects: { breakMultiplierBonus: 0.5 } },
    { id: "r_break_4", name: "Glass Cannon", description: "+1.5x Dmg during Break", rarity: "EPIC", tags: ["BREAK", "RISK"], unique: true, stackable: false, stackLimit: 1, effects: { breakMultiplierBonus: 1.5 } },
    { id: "r_break_5", name: "Time Stop Watch", description: "+1s Break Duration", rarity: "RARE", tags: ["BREAK"], unique: false, stackable: true, stackLimit: 3, effects: { breakDurationBonusMs: 1000 } },
    { id: "r_break_6", name: "Eternity Crystal", description: "+3s Break Duration", rarity: "EPIC", tags: ["BREAK"], unique: true, stackable: false, stackLimit: 1, effects: { breakDurationBonusMs: 3000 } },
    { id: "r_break_7", name: "Break Core", description: "+2 Break Dmg, +1s Duration", rarity: "RARE", tags: ["BREAK"], unique: true, stackable: false, stackLimit: 1, effects: { breakDamage: 2, breakDurationBonusMs: 1000 } },
    { id: "r_break_8", name: "Expose Weakness", description: "100% Crit Chance during Break", rarity: "LEGENDARY", tags: ["BREAK", "CRIT"], unique: true, stackable: false, stackLimit: 1, effects: { breakAutoCrit: 1 } },
    { id: "r_break_9", name: "Anvil of the Void", description: "+10 Break Damage", rarity: "LEGENDARY", tags: ["BREAK", "VOID"], unique: true, stackable: false, stackLimit: 1, effects: { breakDamage: 10 } },
    { id: "r_break_10", name: "Crusher", description: "+0.2x Dmg during Break", rarity: "COMMON", tags: ["BREAK"], unique: false, stackable: true, stackLimit: 5, effects: { breakMultiplierBonus: 0.2 } },

    // --- UTILITY: ENERGY, FOV, RISK, ETC (41-50) ---
    { id: "r_util_1", name: "Battery Cell", description: "+2 Energy per Click", rarity: "COMMON", tags: ["ENERGY"], unique: false, stackable: true, stackLimit: 5, effects: { energyPerClick: 2 } },
    { id: "r_util_2", name: "Plasma Reactor", description: "+10 Energy per Click", rarity: "RARE", tags: ["ENERGY"], unique: false, stackable: true, stackLimit: 3, effects: { energyPerClick: 10 } },
    { id: "r_util_3", name: "Void Magnet", description: "+10% Fragments of Void", rarity: "RARE", tags: ["LUCK"], unique: false, stackable: true, stackLimit: 5, effects: { fovBonus: 0.1 } },
    { id: "r_util_4", name: "Collector's Bag", description: "+25% Fragments of Void", rarity: "EPIC", tags: ["LUCK"], unique: true, stackable: false, stackLimit: 1, effects: { fovBonus: 0.25 } },
    { id: "r_util_5", name: "Gambler's Dice", description: "Rarity roll luck +10%", rarity: "UNCOMMON", tags: ["LUCK", "RISK"], unique: false, stackable: true, stackLimit: 3, effects: { luckBonus: 0.1 } },
    { id: "r_util_6", name: "Reckless Abandon", description: "Global Dmg +50%, but lose Energy", rarity: "EPIC", tags: ["RISK", "MULTIPLIER"], unique: true, stackable: false, stackLimit: 1, effects: { globalMultiplier: 1.5, energyDrain: 1 } },
    { id: "r_util_7", name: "Overcharge", description: "+5 Energy per Click", rarity: "UNCOMMON", tags: ["ENERGY"], unique: false, stackable: true, stackLimit: 5, effects: { energyPerClick: 5 } },
    { id: "r_util_8", name: "Greed", description: "+50% FOV, -20% Dmg", rarity: "EPIC", tags: ["LUCK", "RISK"], unique: true, stackable: false, stackLimit: 1, effects: { fovBonus: 0.5, globalMultiplier: 0.8 } },
    { id: "r_util_9", name: "Dark Matter Engine", description: "+50 Energy per Click", rarity: "LEGENDARY", tags: ["ENERGY", "VOID"], unique: true, stackable: false, stackLimit: 1, effects: { energyPerClick: 50 } },
    { id: "r_util_10", name: "Tesseract", description: "Global Multiplier x2", rarity: "LEGENDARY", tags: ["MULTIPLIER", "VOID"], unique: true, stackable: false, stackLimit: 1, effects: { globalMultiplier: 2.0 } }
];

export const SYNERGIES = [
    { id: "syn_click_3", name: "Click Initiate", condition: { tag: "CLICK", count: 3 }, effects: { baseDamage: 10 } },
    { id: "syn_click_5", name: "Click Master", condition: { tag: "CLICK", count: 5 }, effects: { globalMultiplier: 1.2 } },
    { id: "syn_combo_3", name: "Rhythmic", condition: { tag: "COMBO", count: 3 }, effects: { comboEffectiveness: 0.5 } },
    { id: "syn_crit_3", name: "Lethal", condition: { tag: "CRIT", count: 3 }, effects: { critChance: 0.10 } },
    { id: "syn_break_3", name: "Demolitionist", condition: { tag: "BREAK", count: 3 }, effects: { breakMultiplierBonus: 0.5 } },
    { id: "syn_energy_3", name: "Energized", condition: { tag: "ENERGY", count: 3 }, effects: { energyPerClick: 5 } },
    { id: "syn_hybrid_cc", name: "Precision Strikes", condition: { multiTags: [{tag: "CLICK", count: 2}, {tag: "CRIT", count: 2}] }, effects: { critMultiplier: 0.5 } },
    { id: "syn_hybrid_cb", name: "Momentum Breaker", condition: { multiTags: [{tag: "COMBO", count: 2}, {tag: "BREAK", count: 2}] }, effects: { breakDamage: 2 } },
    { id: "syn_risk_luck", name: "High Stakes", condition: { multiTags: [{tag: "RISK", count: 1}, {tag: "LUCK", count: 2}] }, effects: { globalMultiplier: 1.3 } },
    { id: "syn_void_3", name: "Void Touched", condition: { tag: "VOID", count: 3 }, effects: { fovBonus: 0.5, globalMultiplier: 1.5 } }
];
