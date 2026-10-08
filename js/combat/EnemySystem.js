import { GameState } from '../core/GameState.js';
import { EventBus } from '../core/EventBus.js';
import { BreakSystem } from './BreakSystem.js';
import { BossSystem } from './BossSystem.js';
import { AscensionSystem } from '../endgame/AscensionSystem.js';

export const EnemySystem = {
    activeEnemy: null,

    initEnemy(enemyData, level, isBoss = false) {
        const zone = Math.ceil(level / 10);
        
        let hpScale = Math.pow(1.15, level - 1); 
        let breakScale = 1 + (level * 0.05);

        if (zone > 1) {
            hpScale *= Math.pow(1.5, zone - 1);
            breakScale *= Math.pow(1.2, zone - 1);
        }

        // Aplica modificadores de ASCENSION
        const ascMods = AscensionSystem.getActiveModifiers();
        hpScale *= ascMods.hpMult;
        breakScale *= ascMods.breakMult;

        const maxHP = Math.floor(enemyData.baseHp || enemyData.baseHP * hpScale);
        const maxBreak = Math.floor(enemyData.baseBreak * breakScale);

        this.activeEnemy = {
            ...enemyData,
            maxHP: maxHP,
            currentHP: maxHP,
            breakMax: maxBreak,
            breakCurrent: maxBreak,
            state: "ACTIVE",
            level: level,
            type: isBoss ? "BOSS" : (enemyData.type || "BASIC")
        };

        if (isBoss) {
            this.activeEnemy.currentPhaseIndex = 0;
            this.activeEnemy.activePhaseId = this.activeEnemy.phases[0].id;
        }
        
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
        if (this.activeEnemy.state === "DEFEATED" || this.activeEnemy.state === "SPAWNING") return false;

        this.activeEnemy.currentHP -= amount;
        
        if (this.activeEnemy.currentHP <= 0) {
            this.activeEnemy.currentHP = 0;
            this.activeEnemy.state = "DEFEATED";
            GameState.run.currentHP = 0;
            
            BreakSystem.cancelBreakTimer();
            return true;
        }
        
        GameState.run.currentHP = this.activeEnemy.currentHP;
        
        if (this.activeEnemy.type === "BOSS") {
            BossSystem.checkPhaseTransition();
        }

        return false;
    }
};
