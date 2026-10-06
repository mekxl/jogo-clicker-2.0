import { GameState } from '../core/GameState.js';
import { NumberSystem } from '../core/NumberSystem.js';

export const TargetSystem = {
    currentTarget: null,

    initTarget(id, name, maxHP) {
        const cleanHP = NumberSystem.sanitizeNumber(maxHP);
        this.currentTarget = {
            id: id,
            name: name,
            maxHP: cleanHP,
            currentHP: cleanHP,
            state: "ACTIVE"
        };
        GameState.run.maxHP = cleanHP;
        GameState.run.currentHP = cleanHP;
    },

    getCurrentTarget() {
        return this.currentTarget;
    },

    takeDamage(amount) {
        if (!this.currentTarget || this.currentTarget.state !== "ACTIVE") return false;

        const cleanAmount = NumberSystem.sanitizeNumber(amount);
        this.currentTarget.currentHP -= cleanAmount;
        this.currentTarget.currentHP = NumberSystem.sanitizeNumber(this.currentTarget.currentHP);

        GameState.run.currentHP = this.currentTarget.currentHP;

        if (this.currentTarget.currentHP === 0) {
            this.currentTarget.state = "DEFEATED";
            return true; // Retorna true se foi derrotado
        }
        return false;
    }
};
