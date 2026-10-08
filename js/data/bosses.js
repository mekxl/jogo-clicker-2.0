export const BOSSES = {
    "boss_observer": {
        id: "boss_observer", name: "O OBSERVADOR", type: "BOSS",
        baseHp: 5000, baseBreak: 200, baseReward: 250, 
        color: "#ff0055", scale: 1.5,
        phases: [
            { id: 1, threshold: 0.7, name: "Escaneamento Inicial", bgMod: "brightness(1)", dmgMult: 1.0, breakMult: 1.0 },
            { id: 2, threshold: 0.3, name: "Protocolo Hostil", bgMod: "hue-rotate(90deg) brightness(1.2)", dmgMult: 0.8, breakMult: 0.5 }, 
            { id: 3, threshold: 0.0, name: "Núcleo Exposto", bgMod: "hue-rotate(180deg) brightness(2.0)", dmgMult: 1.5, breakMult: 2.0 }
        ],
        rewards: { relics: 2, upgrades: 1, rarity: "EPIC" }
    },
    "boss_void_construct": {
        id: "boss_void_construct", name: "CONSTRUTO DO VAZIO", type: "BOSS",
        baseHp: 18000, baseBreak: 600, baseReward: 500,
        color: "#aa00ff", scale: 1.8,
        phases: [
            { id: 1, threshold: 0.5, name: "Blindagem Intacta", bgMod: "brightness(0.8)", dmgMult: 0.5, breakMult: 0.5 },
            { id: 2, threshold: 0.0, name: "Forma Estilhaçada", bgMod: "brightness(1.5)", dmgMult: 1.2, breakMult: 1.5 }
        ],
        rewards: { relics: 1, upgrades: 2, rarity: "LEGENDARY" }
    },
    "boss_crimson": {
        id: "boss_crimson", name: "NÚCLEO CARMESIM", type: "BOSS",
        baseHp: 80000, baseBreak: 1500, baseReward: 1000,
        color: "#ff0000", scale: 2.0,
        phases: [
            { id: 1, threshold: 0.8, name: "Dormente", bgMod: "brightness(0.5)", dmgMult: 1.0, breakMult: 1.0 },
            { id: 2, threshold: 0.4, name: "Pulsante", bgMod: "brightness(1.5) contrast(1.2)", dmgMult: 0.8, breakMult: 0.8 },
            { id: 3, threshold: 0.1, name: "Massa Crítica", bgMod: "brightness(2.5) contrast(1.5)", dmgMult: 0.5, breakMult: 0.2 },
            { id: 4, threshold: 0.0, name: "Fusão Nuclear", bgMod: "brightness(3.0) hue-rotate(45deg)", dmgMult: 2.0, breakMult: 3.0 }
        ],
        rewards: { relics: 3, upgrades: 2, rarity: "LEGENDARY" }
    }
};
