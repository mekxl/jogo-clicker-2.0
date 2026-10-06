// DATA-ONLY: Itens base que podem aparecer na loja
export const MERCHANT_POOL = [
    { id: "m_relic_random", name: "Unknown Artifact", description: "A random Relic to alter your build.", type: "RELIC", baseCost: 150 },
    { id: "m_upg_epic", name: "Epic Power", description: "Grants an Epic rarity Upgrade.", type: "UPGRADE", rarity: "EPIC", baseCost: 100 },
    { id: "m_upg_rare", name: "Rare Power", description: "Grants a Rare rarity Upgrade.", type: "UPGRADE", rarity: "RARE", baseCost: 60 },
    { id: "m_heal_small", name: "Quick Patch", description: "Restores 25% of Max HP.", type: "HEAL", amount: 0.25, baseCost: 40 },
    { id: "m_heal_full", name: "Core Restoration", description: "Restores HP to 100%.", type: "HEAL", amount: 1.0, baseCost: 120 },
    { id: "m_max_hp", name: "Structural Reinforcement", description: "+50 Max HP.", type: "MAX_HP", amount: 50, baseCost: 80 }
];
