// DATA-ONLY: Configuração de Bosses e Fases
export const BOSSES = {
    "boss_observer": {
        id: "boss_observer",
        name: "THE OBSERVER",
        type: "BOSS",
        baseHp: 15000,
        baseBreak: 300,
        baseReward: 250, // FoV Base Drop
        color: "#ff0055",
        scale: 1.5,
        phases: [
            { id: 1, threshold: 0.7, name: "Initial Scan", bgMod: "brightness(1)", dmgMult: 1.0, breakMult: 1.0 },
            { id: 2, threshold: 0.3, name: "Hostile Protocol", bgMod: "hue-rotate(90deg) brightness(1.2)", dmgMult: 0.8, breakMult: 0.5 }, // Fase mais defensiva
            { id: 3, threshold: 0.0, name: "Core Exposed", bgMod: "hue-rotate(180deg) brightness(2.0)", dmgMult: 1.5, breakMult: 2.0 }  // Recebe mais dano no fim
        ],
        rewards: {
            relics: 2,
            upgrades: 1,
            rarity: "EPIC"
        }
    },
    "boss_void_construct": {
        id: "boss_void_construct",
        name: "VOID CONSTRUCT",
        type: "BOSS",
        baseHp: 45000,
        baseBreak: 800,
        baseReward: 500,
        color: "#aa00ff",
        scale: 1.8,
        phases: [
            { id: 1, threshold: 0.5, name: "Armor Intact", bgMod: "brightness(0.8)", dmgMult: 0.5, breakMult: 0.5 },
            { id: 2, threshold: 0.0, name: "Shattered Form", bgMod: "brightness(1.5)", dmgMult: 1.2, breakMult: 1.5 }
        ],
        rewards: {
            relics: 1,
            upgrades: 2,
            rarity: "LEGENDARY"
        }
    },
    "boss_crimson": {
        id: "boss_crimson",
        name: "CRIMSON CORE",
        type: "BOSS",
        baseHp: 150000,
        baseBreak: 2000,
        baseReward: 1000,
        color: "#ff0000",
        scale: 2.0,
        phases: [
            { id: 1, threshold: 0.8, name: "Dormant", bgMod: "brightness(0.5)", dmgMult: 1.0, breakMult: 1.0 },
            { id: 2, threshold: 0.4, name: "Pulsing", bgMod: "brightness(1.5) contrast(1.2)", dmgMult: 0.8, breakMult: 0.8 },
            { id: 3, threshold: 0.1, name: "Critical Mass", bgMod: "brightness(2.5) contrast(1.5)", dmgMult: 0.5, breakMult: 0.2 },
            { id: 4, threshold: 0.0, name: "Meltdown", bgMod: "brightness(3.0) hue-rotate(45deg)", dmgMult: 2.0, breakMult: 3.0 }
        ],
        rewards: {
            relics: 3,
            upgrades: 2,
            rarity: "LEGENDARY"
        }
    }
};
