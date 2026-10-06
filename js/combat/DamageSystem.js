import { GameState } from '../core/GameState.js';
import { EnemySystem } from './EnemySystem.js';
import { BreakSystem } from './BreakSystem.js';
import { CurrencySystem } from '../progression/CurrencySystem.js';
import { ComboSystem } from './ComboSystem.js';
import { EventBus } from '../core/EventBus.js';
import { RewardSystem } from '../progression/RewardSystem.js';
import { ModifierSystem } from '../core/ModifierSystem.js';

export const DamageSystem = {
    processClickDamage(clickEventData) {
        if (!GameState.run.isRunActive || GameState.run.isPaused) return;

        const target = EnemySystem.getActiveEnemy();
        if (!target || (target.state !== "ACTIVE" && target.state !== "BREAKING")) return;

        // É crucial recalcular status aqui se dependermos do combo crescendo a cada hit
        ModifierSystem.recalculateStats();
        
        GameState.run.totalClicks++;
        GameState.meta.totalClicks++;

        const stats = GameState.run.stats;
        let finalDamage = stats.damagePerClick;
        
        const comboMult = 1 + ((GameState.run.comboMultiplier - 1) * stats.comboEffectiveness);
        finalDamage *= comboMult;

        let critChance = stats.critChance;
        if (target.state === "BREAKING" && stats.breakAutoCrit > 0) critChance = 1.0;

        let isCrit = Math.random() < critChance;
        if (isCrit) finalDamage *= stats.critMultiplier;

        finalDamage *= stats.globalMultiplier;

        // MULTIPLICADOR DE BREAK
        if (target.state === "BREAKING") {
            finalDamage *= stats.breakMultiplier;
        }

        finalDamage = Math.floor(finalDamage);
        if (finalDamage < 1) finalDamage = 1;

        const isDefeated = EnemySystem.takeDamage(finalDamage);
        
        // Dano de BREAK modular
        BreakSystem.takeBreakDamage(stats.breakDamage); 

        GameState.run.totalDamage += finalDamage;
        if (finalDamage > GameState.meta.highestDamageHit) {
            GameState.meta.highestDamageHit = finalDamage;
        }

        // Energia
        let energyGain = stats.energyPerClick;
        if (GameState.run.comboMultiplier > 1) energyGain += stats.comboEnergyBonus;
        if (isCrit) energyGain += stats.critEnergyBonus;
        CurrencySystem.addEnergy(energyGain);
        
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

        if (isDefeated) {
            GameState.meta.enemiesDefeated++;
            GameState.run.enemiesDefeated = (GameState.run.enemiesDefeated || 0) + 1;
            EventBus.emit("enemyDefeated", target);
        }
    }
};
