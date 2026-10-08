import { GameState } from '../core/GameState.js';
import { EventBus } from '../core/EventBus.js';
import { MERCHANT_POOL } from '../data/merchant.js';
import { RelicSystem } from '../progression/RelicSystem.js';
import { RewardSystem } from '../progression/RewardSystem.js';
import { UpgradeSystem } from '../progression/UpgradeSystem.js';

export const MerchantSystem = {
    currentItems: [],

    triggerMerchant() {
        if (GameState.run.merchantState !== "NONE") return;
        
        GameState.run.isPaused = true;
        GameState.run.merchantState = "ACTIVE";
        
        this.generateStock();
        this.emitState();
    },

    generateStock() {
        this.currentItems = [];
        const pool = [...MERCHANT_POOL];
        
        for (let i = 0; i < 3; i++) {
            if (pool.length === 0) break;
            const idx = Math.floor(Math.random() * pool.length);
            const item = pool.splice(idx, 1)[0];
            
            const inflation = 1 + (GameState.run.merchantRerolls * 0.2);
            this.currentItems.push({
                ...item,
                uid: `merch_${Date.now()}_${i}`,
                cost: Math.floor(item.baseCost * inflation),
                purchased: false
            });
        }
    },

    reroll() {
        if (GameState.run.merchantState !== "ACTIVE") return;
        
        const rerollCost = this.getRerollCost();
        if (GameState.run.energy < rerollCost) return;

        GameState.run.energy -= rerollCost;
        GameState.run.merchantRerolls++;
        
        this.generateStock();
        this.emitState();
        EventBus.emit("stateUpdated");
    },

    getRerollCost() {
        return 10 + (GameState.run.merchantRerolls * 15);
    },

    buyItem(uid) {
        if (GameState.run.merchantState !== "ACTIVE") return;

        const item = this.currentItems.find(i => i.uid === uid);
        if (!item || item.purchased) return;
        if (GameState.run.energy < item.cost) return;

        GameState.run.energy -= item.cost;
        item.purchased = true;

        if (item.type === "RELIC") {
            const pool = RelicSystem.generateChoices(1); 
            if (pool.length > 0) RelicSystem.addRelic(pool[0].id, true);
        } else if (item.type === "UPGRADE") {
            const pool = RewardSystem.generateChoices(1, item.rarity);
            if (pool.length > 0) {
                UpgradeSystem.selectUpgrade(pool[0].id, true);
                EventBus.emit("upgradeApplied", pool[0].id); // Integração Codex
            }
        } else if (item.type === "HEAL") {
            const healAmount = Math.floor(GameState.run.maxHP * item.amount);
            GameState.run.currentHP += healAmount;
            if(GameState.run.currentHP > GameState.run.maxHP) GameState.run.currentHP = GameState.run.maxHP;
            GameState.run.merchantHealsUsed++; // Tracking de challenge
        } else if (item.type === "MAX_HP") {
            GameState.run.maxHP += item.amount;
            GameState.run.currentHP += item.amount;
        }

        this.emitState();
        EventBus.emit("stateUpdated");
    },

    closeMerchant() {
        GameState.run.merchantState = "NONE";
        GameState.run.isPaused = false;
        this.currentItems = [];
        
        EventBus.emit("merchantClosed");
        EventBus.emit("stateUpdated");
    },

    emitState() {
        EventBus.emit("showMerchant", {
            items: this.currentItems,
            rerollCost: this.getRerollCost()
        });
    }
};
