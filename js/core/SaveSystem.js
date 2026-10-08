import { GameState } from './GameState.js';

export const SaveSystem = {
    saveKey: 'BREAK_CORE_SAVE',
    version: 1,

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
                if (parsed.meta) {
                    GameState.meta.totalClicks = parsed.meta.totalClicks || 0;
                    GameState.meta.highestDamageHit = parsed.meta.highestDamageHit || 0;
                    GameState.meta.fragmentsOfVoid = parsed.meta.fragmentsOfVoid || 0;
                    GameState.meta.bossesDefeated = parsed.meta.bossesDefeated || 0;
                    GameState.meta.totalBossDamage = parsed.meta.totalBossDamage || 0;
                    
                    if (parsed.meta.metaUpgrades) {
                        GameState.meta.metaUpgrades = { ...GameState.meta.metaUpgrades, ...parsed.meta.metaUpgrades };
                    }
                    if (parsed.meta.settings) {
                        GameState.meta.settings = { ...GameState.meta.settings, ...parsed.meta.settings };
                    }
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
