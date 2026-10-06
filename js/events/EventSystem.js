import { GameState } from '../core/GameState.js';
import { EventBus } from '../core/EventBus.js';
import { EVENTS } from '../data/events.js';
import { RiskSystem } from './RiskSystem.js';
import { RelicSystem } from '../progression/RelicSystem.js';
import { UpgradeSystem } from '../progression/UpgradeSystem.js';
import { RewardSystem } from '../progression/RewardSystem.js';
import { ModifierSystem } from '../core/ModifierSystem.js';

export const EventSystem = {
    activeEventData: null,

    triggerRandomEvent() {
        if (GameState.run.eventState !== "NONE") return;
        
        GameState.run.isPaused = true;
        GameState.run.eventState = "ACTIVE";
        
        const randomIndex = Math.floor(Math.random() * EVENTS.length);
        this.activeEventData = EVENTS[randomIndex];
        
        EventBus.emit("showEvent", this.activeEventData);
    },

    selectChoice(choiceId) {
        if (GameState.run.eventState !== "ACTIVE" || !this.activeEventData) return;
        
        const choice = this.activeEventData.choices.find(c => c.id === choiceId);
        if (!choice) return;

        // Valida requerimentos
        if (choice.requirements) {
            if (choice.requirements.energy && GameState.run.energy < choice.requirements.energy) return; // UI deve desativar o botão antes, mas checagem extra
            if (choice.requirements.minRelics && Object.keys(GameState.run.activeRelics || {}).length < choice.requirements.minRelics) return;
        }

        GameState.run.eventState = "RESOLVING"; // Trava multi-clicks

        // Resolve Risk/Reward
        const finalEffects = RiskSystem.evaluateRiskChoice(choice);
        this.applyEffects(finalEffects);

        // Limpeza e encerramento
        this.activeEventData = null;
        GameState.run.eventState = "NONE";
        GameState.run.isPaused = false;
        
        EventBus.emit("eventResolved");
        EventBus.emit("stateUpdated");
    },

    applyEffects(effects) {
        if (!effects) return;
        
        // --- HP & Stats Base ---
        if (effects.hpPercent) {
            const dmg = Math.floor(GameState.run.maxHP * Math.abs(effects.hpPercent));
            if (effects.hpPercent < 0) {
                GameState.run.currentHP -= dmg;
                if(GameState.run.currentHP < 1) GameState.run.currentHP = 1; // Evento não mata, deixa com 1 HP
            }
        }
        if (effects.setHp) GameState.run.currentHP = effects.setHp;
        if (effects.healPercent) {
            const heal = Math.floor(GameState.run.maxHP * effects.healPercent);
            GameState.run.currentHP += heal;
            if (GameState.run.currentHP > GameState.run.maxHP) GameState.run.currentHP = GameState.run.maxHP;
        }
        if (effects.heal) {
            GameState.run.currentHP += effects.heal;
            if (GameState.run.currentHP > GameState.run.maxHP) GameState.run.currentHP = GameState.run.maxHP;
        }
        if (effects.maxHp) {
            GameState.run.maxHP += effects.maxHp;
            GameState.run.currentHP += effects.maxHp;
        }

        // --- Recursos ---
        if (effects.energy) {
            GameState.run.energy += effects.energy;
            if(GameState.run.energy < 0) GameState.run.energy = 0;
        }
        if (effects.energyMult !== undefined) {
            GameState.run.energy = Math.floor(GameState.run.energy * effects.energyMult);
        }
        if (effects.fov) {
            GameState.meta.fragmentsOfVoid += effects.fov;
        }

        // --- Relics & Upgrades ---
        if (effects.randomRelic || effects.randomRelicRarity) {
            // Simplificado: Invoca o motor de escolhas para pegar o ID da primeira escolha e injeta direto
            const pool = RelicSystem.generateChoices(1, effects.randomRelicRarity); 
            if (pool.length > 0) RelicSystem.addRelic(pool[0].id, true); // true = force sem UI
        }
        if (effects.loseRandomRelic) {
            const activeIds = Object.keys(GameState.run.activeRelics || {});
            if (activeIds.length > 0) {
                const randomId = activeIds[Math.floor(Math.random() * activeIds.length)];
                RelicSystem.removeRelic(randomId);
            }
        }
        
        const grantUpgrades = (rarity, count) => {
            for(let i = 0; i < count; i++) {
                const pool = RewardSystem.generateChoices(1, rarity);
                if (pool.length > 0) UpgradeSystem.selectUpgrade(pool[0].id, true);
            }
        }

        if (effects.grantUpgradeRarity) grantUpgrades(effects.grantUpgradeRarity, effects.repeatUpgrade || 1);
        if (effects.grantRandomUpgrade) grantUpgrades(RewardSystem.rollRarity(), effects.grantRandomUpgrade);

        // --- Modificadores Permanentes da Run ---
        if (effects.runBaseDamage) GameState.run.eventModifiers.baseDamage += effects.runBaseDamage;
        if (effects.runComboBonus) GameState.run.eventModifiers.comboEffectiveness += effects.runComboBonus;
        if (effects.runEnergyPerClick) GameState.run.eventModifiers.energyPerClick += effects.runEnergyPerClick;

        if (effects.skipNextCombat) GameState.run.skipNextCombat = true;

        ModifierSystem.recalculateStats();
    }
};
