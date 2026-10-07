import { GameState } from '../core/GameState.js';
import { EnemySystem } from './EnemySystem.js';
import { BreakSystem } from './BreakSystem.js';
import { CurrencySystem } from '../progression/CurrencySystem.js';
import { ComboSystem } from './ComboSystem.js';
import { EventBus } from '../core/EventBus.js';
import { RewardSystem } from '../progression/RewardSystem.js';
import { ModifierSystem } from '../core/ModifierSystem.js';
import { NumberSystem } from '../core/NumberSystem.js';
import { FrenzySystem } from '../feedback/FrenzySystem.js';

export const DamageSystem = {
    // Processa clique manual do Jogador
    processClickDamage(clickEventData) {
        if (!GameState.run.isRunActive || GameState.run.isPaused) return;
        const target = EnemySystem.getActiveEnemy();
        if (!target || (target.state !== "ACTIVE" && target.state !== "BREAKING")) return;

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
        if (target.state === "BREAKING") finalDamage *= stats.breakMultiplier;

        finalDamage = NumberSystem.sanitizeNumber(finalDamage);
        if (finalDamage < 1) finalDamage = 1;

        const isDefeated = EnemySystem.takeDamage(finalDamage);
        BreakSystem.takeBreakDamage(stats.breakDamage); 

        // Update run stats
        GameState.run.totalDamage += finalDamage;
        if (finalDamage > GameState.meta.highestDamageHit) GameState.meta.highestDamageHit = finalDamage;

        // Feedback System Triggers
        FrenzySystem.addFrenzy(isCrit ? 3 : 1);

        let energyGain = stats.energyPerClick;
        if (GameState.run.comboMultiplier > 1) energyGain += stats.comboEnergyBonus;
        if (isCrit) energyGain += stats.critEnergyBonus;
        CurrencySystem.addEnergy(energyGain);
        
        ComboSystem.incrementCombo();

        EventBus.emit("damage", { 
            amount: finalDamage, 
            isCrit: isCrit,
            state: target.state,
            x: clickEventData ? clickEventData.x : null, 
            y: clickEventData ? clickEventData.y : null,
            source: 'click'
        });
        
        RewardSystem.checkMilestones(GameState.run.totalClicks);
        EventBus.emit("stateUpdated");

        if (isDefeated) this.handleDefeat(target);
    },

    // Processa dano originado da Automação (Drones) sem estourar combo
    processAutoDamage(baseAmount, sourceId) {
        if (!GameState.run.isRunActive || GameState.run.isPaused) return;
        const target = EnemySystem.getActiveEnemy();
        if (!target || (target.state !== "ACTIVE" && target.state !== "BREAKING")) return;

        const stats = GameState.run.stats;
        let finalDamage = baseAmount * stats.autoDamageMult;
        
        let isCrit = Math.random() < stats.critChance; // Auto pode critar
        if (isCrit) finalDamage *= stats.critMultiplier;

        finalDamage *= stats.globalMultiplier;
        if (target.state === "BREAKING") finalDamage *= stats.breakMultiplier;

        finalDamage = NumberSystem.sanitizeNumber(finalDamage);
        if (finalDamage < 1) finalDamage = 1;

        const isDefeated = EnemySystem.takeDamage(finalDamage);
        
        GameState.run.totalDamage += finalDamage;

        EventBus.emit("damage", { 
            amount: finalDamage, 
            isCrit: isCrit,
            state: target.state,
            x: null, y: null,
            source: 'auto',
            sourceId: sourceId
        });
        
        EventBus.emit("stateUpdated");

        if (isDefeated) this.handleDefeat(target);
    },

    handleDefeat(target) {
        GameState.meta.enemiesDefeated++;
        GameState.run.enemiesDefeated = (GameState.run.enemiesDefeated || 0) + 1;
        EventBus.emit("enemyDefeated", target);
    }
};
