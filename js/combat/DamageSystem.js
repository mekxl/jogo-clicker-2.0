import { GameState } from '../core/GameState.js';
import { TargetSystem } from './TargetSystem.js';
import { CurrencySystem } from '../progression/CurrencySystem.js';
import { ComboSystem } from './ComboSystem.js';
import { EventBus } from '../core/EventBus.js';
import { RewardSystem } from '../progression/RewardSystem.js';

export const DamageSystem = {
    processClickDamage(clickEventData) {
        if (!GameState.run.isRunActive || GameState.run.isPaused) return;

        const target = TargetSystem.getCurrentTarget();
        if (!target || target.state !== "ACTIVE") return;

        GameState.run.totalClicks++;
        GameState.meta.totalClicks++;

        // Cálculo de Dano com Modificadores
        const stats = GameState.run.stats;
        let finalDamage = stats.damagePerClick;
        
        // Multiplicador de Combo modificado pelos upgrades
        const comboMult = 1 + ((GameState.run.comboMultiplier - 1) * stats.comboEffectiveness);
        finalDamage *= comboMult;

        // Crit
        let isCrit = Math.random() < stats.critChance;
        if (isCrit) {
            finalDamage *= stats.critMultiplier;
        }

        finalDamage *= stats.globalMultiplier;
        finalDamage = Math.floor(finalDamage);
        if (finalDamage < 1) finalDamage = 1;

        const isDefeated = TargetSystem.takeDamage(finalDamage);

        GameState.run.totalDamage += finalDamage;
        if (finalDamage > GameState.meta.highestDamageHit) {
            GameState.meta.highestDamageHit = finalDamage;
        }

        CurrencySystem.addEnergy(stats.energyPerClick);
        ComboSystem.incrementCombo();

        EventBus.emit("damage", { 
            amount: finalDamage, 
            isCrit: isCrit,
            x: clickEventData.x, 
            y: clickEventData.y 
        });
        
        // Checagem de Milestones da Run
        RewardSystem.checkMilestones(GameState.run.totalClicks);

        EventBus.emit("stateUpdated");

        if (isDefeated) {
            GameState.meta.enemiesDefeated++;
            EventBus.emit("targetDefeated", target);
        }
    }
};
