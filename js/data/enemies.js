export const ENEMIES = {
    "fragment": { 
        id: "fragment", name: "Fragmento", type: "BASIC", 
        baseHP: 25, baseBreak: 15, baseReward: 10,
        color: "#888888", scale: 0.8 
    },
    "parasite": { 
        id: "parasite", name: "Parasita", type: "AGGRO", 
        baseHP: 60, baseBreak: 25, baseReward: 25,
        color: "#00ff44", scale: 0.9 
    },
    "unstable": { 
        id: "unstable", name: "Instável", type: "RISK", 
        baseHP: 100, baseBreak: 8, baseReward: 40,
        color: "#ff00ff", scale: 1.0 
    },
    "mirror": { 
        id: "mirror", name: "Espelho Defeituoso", type: "SPECIAL", 
        baseHP: 150, baseBreak: 15, baseReward: 50,
        color: "#00ccff", scale: 1.0 
    },
    "colossus": { 
        id: "colossus", name: "Colosso de Aço", type: "TANK", 
        baseHP: 400, baseBreak: 60, baseReward: 100,
        color: "#ff3300", scale: 1.3 
    }
};
