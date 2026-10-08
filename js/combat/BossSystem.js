import { GameState } from '../core/GameState.js';
import { EventBus } from '../core/EventBus.js';
import { EnemySystem } from './EnemySystem.js';

export const BossSystem = {
    checkPhaseTransition() {
        const enemy = EnemySystem.getActiveEnemy();
        if (!enemy || enemy.type !== "BOSS") return;

        const hpPercent = enemy.currentHP / enemy.maxHP;
        const currentPhaseData = enemy.phases[enemy.currentPhaseIndex];

        // Se o HP desceu abaixo do threshold da fase atual, transiciona
        if (currentPhaseData && hpPercent <= currentPhaseData.threshold) {
            // Avança até achar a fase correta (caso o dano tenha sido absurdo e pulado thresholds)
            while (enemy.currentPhaseIndex < enemy.phases.length - 1) {
                const nextPhase = enemy.phases[enemy.currentPhaseIndex + 1];
                if (hpPercent <= currentPhaseData.threshold && hpPercent > nextPhase.threshold) {
                    break;
                }
                enemy.currentPhaseIndex++;
            }
            
            const newPhaseData = enemy.phases[enemy.currentPhaseIndex];
            
            // Impede trigger duplicado da mesma fase
            if (enemy.activePhaseId !== newPhaseData.id) {
                enemy.activePhaseId = newPhaseData.id;
                
                EventBus.emit("bossPhaseChanged", {
                    boss: enemy,
                    phase: newPhaseData
                });
                EventBus.emit("stateUpdated");
            }
        }
    },

    getDamageMultiplier() {
        const enemy = EnemySystem.getActiveEnemy();
        if (!enemy || enemy.type !== "BOSS") return 1.0;
        const phase = enemy.phases[enemy.currentPhaseIndex];
        return phase ? phase.dmgMult : 1.0;
    },

    getBreakMultiplier() {
        const enemy = EnemySystem.getActiveEnemy();
        if (!enemy || enemy.type !== "BOSS") return 1.0;
        const phase = enemy.phases[enemy.currentPhaseIndex];
        return phase ? phase.breakMult : 1.0;
    }
};
