export const UPGRADE_RARITIES = {
    COMMON: { id: "COMMON", weight: 60, color: "#aaaaaa", label: "Comum" },
    UNCOMMON: { id: "UNCOMMON", weight: 25, color: "#00cc44", label: "Incomum" },
    RARE: { id: "RARE", weight: 10, color: "#0066ff", label: "Raro" },
    EPIC: { id: "EPIC", weight: 4, color: "#aa00ff", label: "Épico" },
    LEGENDARY: { id: "LEGENDARY", weight: 1, color: "#ffaa00", label: "Lendário" }
};

export const UPGRADES = [
    { id: "click_power_1", name: "Lâmina Afiada", description: "+1 Dano Base por Clique.", rarity: "COMMON", tags: ["CLICK"], effects: { baseDamage: 1 }, stackLimit: 10 },
    { id: "click_power_2", name: "Impacto Pesado", description: "+3 Dano Base por Clique.", rarity: "UNCOMMON", tags: ["CLICK"], effects: { baseDamage: 3 }, stackLimit: 5 },
    { id: "click_power_3", name: "Golpe do Vazio", description: "+10 Dano Base por Clique.", rarity: "RARE", tags: ["CLICK", "VOID"], effects: { baseDamage: 10 }, stackLimit: 3 },
    { id: "click_power_4", name: "Aniquilação", description: "+50 Dano Base por Clique.", rarity: "EPIC", tags: ["CLICK"], effects: { baseDamage: 50 }, stackLimit: 1 },
    
    { id: "energy_gain_1", name: "Carga Estática", description: "+1 Energia por Clique.", rarity: "COMMON", tags: ["ENERGY"], effects: { energyPerClick: 1 }, stackLimit: 5 },
    { id: "energy_gain_2", name: "Dínamo Cinético", description: "+3 Energia por Clique.", rarity: "UNCOMMON", tags: ["ENERGY"], effects: { energyPerClick: 3 }, stackLimit: 3 },
    { id: "energy_max_1", name: "Capacitor", description: "+50 Energia Máxima.", rarity: "COMMON", tags: ["ENERGY"], effects: { maxEnergy: 50 }, stackLimit: 10 },

    { id: "combo_power_1", name: "Embalo", description: "Multiplicador de Combo afeta Dano em +0.5x.", rarity: "UNCOMMON", tags: ["COMBO"], effects: { comboEffectiveness: 0.5 }, stackLimit: 4 },
    { id: "combo_power_2", name: "Estado de Fluxo", description: "Multiplicador de Combo afeta Dano em +1.0x.", rarity: "RARE", tags: ["COMBO"], effects: { comboEffectiveness: 1.0 }, stackLimit: 2 },
    { id: "combo_starter", name: "Construção Rápida", description: "Inicia o combo mais rápido.", rarity: "UNCOMMON", tags: ["COMBO"], effects: { comboGeneration: 1 }, stackLimit: 3 },

    { id: "crit_chance_1", name: "Precisão", description: "+5% Chance de Acerto Crítico.", rarity: "COMMON", tags: ["CRIT"], effects: { critChance: 0.05 }, stackLimit: 10 },
    { id: "crit_chance_2", name: "Ponto Fraco", description: "+10% Chance de Acerto Crítico.", rarity: "RARE", tags: ["CRIT"], effects: { critChance: 0.10 }, stackLimit: 5 },
    { id: "crit_dmg_1", name: "Estilhaçar", description: "+20% Dano Crítico.", rarity: "UNCOMMON", tags: ["CRIT"], effects: { critMultiplier: 0.2 }, stackLimit: 10 },
    { id: "crit_dmg_2", name: "Devastar", description: "+50% Dano Crítico.", rarity: "EPIC", tags: ["CRIT"], effects: { critMultiplier: 0.5 }, stackLimit: 3 },

    { id: "risk_desperation", name: "Desespero", description: "+100% Dano se o alvo tiver > 90% HP.", rarity: "RARE", tags: ["RISK"], effects: { firstStrikeMultiplier: 1.0 }, stackLimit: 1 },
    { id: "risk_execute", name: "Execução", description: "+1% de Chance de Morte Instantânea.", rarity: "EPIC", tags: ["RISK"], effects: { executeChance: 0.01 }, stackLimit: 5 },

    { id: "auto_clicker_1", name: "Clique Fantasma", description: "Automação: Causa dano 1x por segundo.", rarity: "RARE", tags: ["AUTOMATION"], effects: { autoClicksPerSec: 1 }, stackLimit: 5 },
    
    { id: "leg_singularity", name: "Singularidade", description: "Dano Base x2. Ganho de Energia x2.", rarity: "LEGENDARY", tags: ["CLICK", "ENERGY"], effects: { globalMultiplier: 2.0 }, stackLimit: 1 },
    { id: "leg_void_resonance", name: "Ressonância", description: "Críticos garantem mais Fragmentos do Vazio no fim da run.", rarity: "LEGENDARY", tags: ["VOID", "CRIT"], effects: { fovCritBonus: 1 }, stackLimit: 1 },
    { id: "leg_core_break", name: "Quebrador de Núcleos", description: "Ativa habilidades supremas de BREAK.", rarity: "LEGENDARY", tags: ["BREAK"], effects: { breakEnabled: 1 }, stackLimit: 1 }
];
