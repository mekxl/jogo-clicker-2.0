import { GameState } from '../core/GameState.js';
import { EventBus } from '../core/EventBus.js';

export const ComboSystem = {
    incrementCombo() {
        GameState.run.currentCombo += 1;
        if (GameState.run.currentCombo > GameState.run.maxCombo) {
            GameState.run.maxCombo = GameState.run.currentCombo;
        }
        
        this.calculateMultiplier();
        EventBus.emit("comboChanged", GameState.run);
    },

    calculateMultiplier() {
        const c = GameState.run.currentCombo;
        let m = 1;

        if (c >= 50) m = 4;
        else if (c >= 25) m = 3;
        else if (c >= 10) m = 2;

        GameState.run.comboMultiplier = m;
    }
};
