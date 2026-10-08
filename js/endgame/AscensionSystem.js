import { GameState } from '../core/GameState.js';

export const AscensionSystem = {
    // Configura os multiplicadores por nível
    // Modifiers aplicam sobre a base. Ex: { hpMult: 1.2 } significa 20% a mais de HP em Ascension 1
    levels: [
        { level: 0, hpMult: 1.0, breakMult: 1.0, dmgReduction: 1.0, rewardFovMult: 1.0, bossDmgMult: 1.0 },
        { level: 1, hpMult: 1.2, breakMult: 1.1, dmgReduction: 1.0, rewardFovMult: 1.1, bossDmgMult: 1.1 },
        { level: 2, hpMult: 1.5, breakMult: 1.2, dmgReduction: 0.9, rewardFovMult: 1.2, bossDmgMult: 1.2 },
        { level: 3, hpMult: 2.0, breakMult: 1.5, dmgReduction: 0.8, rewardFovMult: 1.5, bossDmgMult: 1.5 },
        { level: 4, hpMult: 3.0, breakMult: 2.0, dmgReduction: 0.7, rewardFovMult: 2.0, bossDmgMult: 2.0 },
        { level: 5, hpMult: 5.0, breakMult: 3.0, dmgReduction: 0.5, rewardFovMult: 3.0, bossDmgMult: 3.0 }
    ],

    getActiveModifiers() {
        const currentLevel = GameState.run.ascensionLevel || 0;
        let mods = this.levels.find(l => l.level === currentLevel);
        if (!mods) {
            // Se passar de 5, escala proceduralmente
            const diff = currentLevel - 5;
            mods = {
                level: currentLevel,
                hpMult: 5.0 + (diff * 2.0),
                breakMult: 3.0 + (diff * 1.0),
                dmgReduction: Math.max(0.1, 0.5 - (diff * 0.05)),
                rewardFovMult: 3.0 + (diff * 0.5),
                bossDmgMult: 3.0 + (diff * 0.5)
            };
        }
        return mods;
    },

    setAscension(level) {
        if (level <= GameState.meta.highestAscensionUnlocked) {
            GameState.meta.currentAscensionSelection = level;
            return true;
        }
        return false;
    }
};
