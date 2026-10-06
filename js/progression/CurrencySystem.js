import { GameState } from '../core/GameState.js';
import { EventBus } from '../core/EventBus.js';

export const CurrencySystem = {
    addEnergy(amount) {
        if (!GameState.run.isRunActive) return;
        GameState.run.energy += amount;
        EventBus.emit("energyGained", GameState.run.energy);
    }
};
