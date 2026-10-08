import { GameState } from './GameState.js';

export const SaveSystem = {
    saveKey: 'BREAK_CORE_SAVE',
    version: 2, // Bump para V2 (Migration Check)

    save() {
        const data = { 
            version: this.version,
            meta: GameState.meta 
        };
        localStorage.setItem(this.saveKey, JSON.stringify(data));
    },
    
    load() {
        const savedData = localStorage.getItem(this.saveKey);
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                
                // MIGRATION V1 -> V2
                if (parsed.version === 1) {
                    console.log("Migrating save V1 to V2...");
                    parsed.meta.runsPlayed = 0;
                    parsed.meta.runsWon = 0;
                    parsed.meta.highestAscensionUnlocked = 0;
                    parsed.meta.currentAscensionSelection = 0;
                    parsed.meta.challenges = {};
                    parsed.meta.codex = { enemies: {}, relics: {}, upgrades: {}, events: {} };
                }

                if (parsed.meta) {
                    // Deep merge simplificado para garantir chaves novas
                    GameState.meta = { ...GameState.meta, ...parsed.meta };
                    
                    // Garantir nested objects
                    if (!GameState.meta.challenges) GameState.meta.challenges = {};
                    if (!GameState.meta.codex) GameState.meta.codex = { enemies: {}, relics: {}, upgrades: {}, events: {} };
                    if (!GameState.meta.metaUpgrades) GameState.meta.metaUpgrades = { startingDamage: 0, energyReserve: 0, luck: 0, knowledge: 0, resistance: 0 };
                    if (!GameState.meta.settings) GameState.meta.settings = { particlesEnabled: true, screenShakeEnabled: true, sfxEnabled: true, sfxVolume: 0.5 };
                }
            } catch (e) {
                console.error("Save file corrupted.", e);
            }
        }
    },
    
    clear() {
        localStorage.removeItem(this.saveKey);
    }
};
