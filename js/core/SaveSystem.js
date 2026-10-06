import { GameState } from './GameState.js';

export const SaveSystem = {
    saveKey: 'BREAK_CORE_SAVE_V1',

    save() {
        const data = { meta: GameState.meta }; // Somente MetaState é persistente
        localStorage.setItem(this.saveKey, JSON.stringify(data));
    },
    load() {
        const savedData = localStorage.getItem(this.saveKey);
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                if (parsed.meta) GameState.meta = parsed.meta;
            } catch (e) {
                console.error("Save file corrupted.", e);
            }
        }
    },
    clear() {
        localStorage.removeItem(this.saveKey);
    }
};
