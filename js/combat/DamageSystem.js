import { GameState } from '../core/GameState.js';
import { TargetSystem } from './TargetSystem.js';
import { CurrencySystem } from '../progression/CurrencySystem.js';
import { ComboSystem } from './ComboSystem.js';
import { EventBus } from '../core/EventBus.js';

export const DamageSystem = {
    processClickDamage(clickEventData) {
        if (!GameState.run.isRunActive) return;

        const target = TargetSystem.getCurrentTarget();
        if (!target || target.state !== "ACTIVE") return;

        // Registro do clique (Run e Meta)
        GameState.run.totalClicks++;
        GameState.meta.totalClicks++;

        // Obter dano base e calcular (ainda sem modificadores aplicados na prática)
        const baseDamage = GameState.run.damagePerClick;
        const finalDamage = baseDamage; // Futuramente: baseDamage * GameState.run.comboMultiplier * buffs...

        // Aplicar dano
        const isDefeated = TargetSystem.takeDamage(finalDamage);

        // Atualizar estatísticas numéricas
        GameState.run.totalDamage += finalDamage;
        if (finalDamage > GameState.meta.highestDamageHit) {
            GameState.meta.highestDamageHit = finalDamage;
        }

        // Conceder Recursos e Processar Combo
        CurrencySystem.addEnergy(1);
        ComboSystem.incrementCombo();

        // Emitir Eventos
        EventBus.emit("damage", { 
            amount: finalDamage, 
            x: clickEventData.x, 
            y: clickEventData.y 
        });
        
        EventBus.emit("stateUpdated"); // Força UI update

        if (isDefeated) {
            GameState.meta.enemiesDefeated++;
            EventBus.emit("targetDefeated", target);
        }
    }
};
