import { GameState } from '../core/GameState.js';
import { EnemySystem } from './EnemySystem.js';
import { BreakSystem } from './BreakSystem.js';
import { CurrencySystem } from '../progression/CurrencySystem.js';
import { ComboSystem } from './ComboSystem.js';
import { EventBus } from '../core/EventBus.js';
import { RewardSystem } from '../progression/RewardSystem.js';

export const DamageSystem = {
    processClickDamage(clickEventData) {
        if (!GameState.run.isRunActive || GameState.run.isPaused) return;

        const target = EnemySystem.getActiveEnemy();
        if (!target || (target.state !== "ACTIVE" && target.state !== "BREAKING")) return;

        GameState.run.totalClicks++;
        GameState.meta.totalClicks++;

        const stats = GameState.run.stats;
        let finalDamage = stats.damagePerClick;
        
        const comboMult = 1 + ((GameState.run.comboMultiplier - 1) * stats.comboEffectiveness);
        finalDamage *= comboMult;

        let isCrit = Math.random() < stats.critChance;
        if (isCrit) finalDamage *= stats.critMultiplier;

        finalDamage *= stats.globalMultiplier;

        // MULTIPLICADOR DE BREAK (Se o inimigo está vulnerável)
        if (target.state === "BREAKING") {
            finalDamage *= BreakSystem.breakMultiplier;
        }

        finalDamage = Math.floor(finalDamage);
        if (finalDamage < 1) finalDamage = 1;

        // Aplica o Dano de HP (retorna true se matou)
        const isDefeated = EnemySystem.takeDamage(finalDamage);
        
        // Aplica o Dano de BREAK (1 por clique na base)
        BreakSystem.takeBreakDamage(1); 

        // Update Stats
        GameState.run.totalDamage += finalDamage;
        if (finalDamage > GameState.meta.highestDamageHit) {
            GameState.meta.highestDamageHit = finalDamage;
        }

        CurrencySystem.addEnergy(stats.energyPerClick);
        ComboSystem.incrementCombo();

        EventBus.emit("damage", { 
            amount: finalDamage, 
            isCrit: isCrit,
            state: target.state,
            x: clickEventData.x, 
            y: clickEventData.y 
        });
        
        RewardSystem.checkMilestones(GameState.run.totalClicks);
        EventBus.emit("stateUpdated");

        // Gatilho único de morte
        if (isDefeated) {
            GameState.meta.enemiesDefeated++;
            GameState.run.enemiesDefeated = (GameState.run.enemiesDefeated || 0) + 1;
            EventBus.emit("enemyDefeated", target);
        }
    }
};
