import { GameState } from '../core/GameState.js';
import { EventBus } from '../core/EventBus.js';
import { BreakSystem } from './BreakSystem.js';

export const EnemySystem = {
    activeEnemy: null,

    initEnemy(enemyData, level) {
        // Escalonamento Dinâmico (Configurado em BALANCE.md)
        const hpScale = Math.pow(1.15, level - 1); 
        const breakScale = 1 + (level * 0.05);

        const maxHP = Math.floor(enemyData.baseHP * hpScale);
        const maxBreak = Math.floor(enemyData.baseBreak * breakScale);

        this.activeEnemy = {
            ...enemyData,
            maxHP: maxHP,
            currentHP: maxHP,
            breakMax: maxBreak,
            breakCurrent: maxBreak,
            state: "ACTIVE", // Estados: SPAWNING, ACTIVE, BREAKING, DEFEATED
            level: level
        };
        
        GameState.run.currentHP = maxHP;
        GameState.run.maxHP = maxHP;
        
        EventBus.emit("enemySpawned", this.activeEnemy);
        EventBus.emit("stateUpdated");
    },

    getActiveEnemy() {
        return this.activeEnemy;
    },

    takeDamage(amount) {
        if (!this.activeEnemy) return false;
        // Anti-exploit de spam de cliques após morte
        if (this.activeEnemy.state === "DEFEATED" || this.activeEnemy.state === "SPAWNING") return false;

        this.activeEnemy.currentHP -= amount;
        
        if (this.activeEnemy.currentHP <= 0) {
            this.activeEnemy.currentHP = 0;
            this.activeEnemy.state = "DEFEATED";
            GameState.run.currentHP = 0;
            
            BreakSystem.cancelBreakTimer();
            return true; // Retorna true EXATAMENTE 1 vez na morte
        }
        
        GameState.run.currentHP = this.activeEnemy.currentHP;
        return false;
    }
};
