import { GameState } from '../core/GameState.js';
import { EnemySystem } from './EnemySystem.js';
import { BreakSystem } from './BreakSystem.js';
import { BossSystem } from './BossSystem.js';
import { CurrencySystem } from '../progression/CurrencySystem.js';
import { ComboSystem } from './ComboSystem.js';
import { EventBus } from '../core/EventBus.js';
import { RewardSystem } from '../progression/RewardSystem.js';
import { ModifierSystem } from '../core/ModifierSystem.js';
import { NumberSystem } from '../core/NumberSystem.js';
import { FrenzySystem } from '../feedback/FrenzySystem.js';
import { AscensionSystem } from '../endgame/AscensionSystem.js';

export const DamageSystem = {
    processClickDamage(clickEventData) {
        if (!GameState.run.isRunActive || GameState.run.isPaused || GameState.run.isTransitioning) return;
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
        
        const ascMods = AscensionSystem.getActiveModifiers();
        finalDamage *= (ascMods ? ascMods.dmgReduction : 1);
        
        if (target.type === "BOSS") finalDamage *= BossSystem.getDamageMultiplier();
        if (target.state === "BREAKING") finalDamage *= stats.breakMultiplier;

        finalDamage = NumberSystem.sanitizeNumber(finalDamage);
        if (finalDamage < 1) finalDamage = 1;

        const isDefeated = EnemySystem.takeDamage(finalDamage);
        
        let finalBreakDmg = stats.breakDamage;
        if (target.type === "BOSS") finalBreakDmg *= BossSystem.getBreakMultiplier();
        BreakSystem.takeBreakDamage(finalBreakDmg); 

        GameState.run.totalDamage += finalDamage;
        if (finalDamage > GameState.meta.highestDamageHit) GameState.meta.highestDamageHit = finalDamage;
        if (target.type === "BOSS") GameState.meta.totalBossDamage = (GameState.meta.totalBossDamage || 0) + finalDamage;

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

    processAutoDamage(baseAmount, sourceId) {
        if (!GameState.run.isRunActive || GameState.run.isPaused || GameState.run.isTransitioning) return;
        const target = EnemySystem.getActiveEnemy();
        if (!target || (target.state !== "ACTIVE" && target.state !== "BREAKING")) return;

        const stats = GameState.run.stats;
        let finalDamage = baseAmount * stats.autoDamageMult;
        
        let isCrit = Math.random() < stats.critChance; 
        if (isCrit) finalDamage *= stats.critMultiplier;

        finalDamage *= stats.globalMultiplier;
        
        const ascMods = AscensionSystem.getActiveModifiers();
        finalDamage *= (ascMods ? ascMods.dmgReduction : 1);

        if (target.type === "BOSS") finalDamage *= BossSystem.getDamageMultiplier();
        if (target.state === "BREAKING") finalDamage *= stats.breakMultiplier;

        finalDamage = NumberSystem.sanitizeNumber(finalDamage);
        if (finalDamage < 1) finalDamage = 1;

        const isDefeated = EnemySystem.takeDamage(finalDamage);
        GameState.run.totalDamage += finalDamage;
        if (target.type === "BOSS") GameState.meta.totalBossDamage = (GameState.meta.totalBossDamage || 0) + finalDamage;

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
        
        if (target.type === "BOSS") {
            GameState.meta.bossesDefeated++;
            GameState.run.bossesDefeated = (GameState.run.bossesDefeated || 0) + 1;
        }
        EventBus.emit("enemyDefeated", target);
    }
};
