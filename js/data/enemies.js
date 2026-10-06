// DATA-ONLY: Definição pura, sem lógica.
export const ENEMIES = {
    "fragment": { 
        id: "fragment", name: "Fragment", type: "BASIC", 
        baseHP: 100, baseBreak: 15, baseReward: 10,
        color: "#888888", scale: 0.8 
    },
    "parasite": { 
        id: "parasite", name: "Parasite", type: "AGGRO", 
        baseHP: 250, baseBreak: 25, baseReward: 25,
        color: "#00ff44", scale: 0.9 
    },
    "unstable": { 
        id: "unstable", name: "Unstable", type: "RISK", 
        baseHP: 300, baseBreak: 8, baseReward: 40,
        color: "#ff00ff", scale: 1.0 
    },
    "mirror": { 
        id: "mirror", name: "Mirror", type: "SPECIAL", 
        baseHP: 400, baseBreak: 15, baseReward: 50,
        color: "#00ccff", scale: 1.0 
    },
    "colossus": { 
        id: "colossus", name: "Colossus", type: "TANK", 
        baseHP: 1200, baseBreak: 60, baseReward: 100,
        color: "#ff3300", scale: 1.3 
    }
};
