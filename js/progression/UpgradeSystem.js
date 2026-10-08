import { GameState } from '../core/GameState.js';
import { UPGRADES, UPGRADE_RARITIES } from '../data/upgrades.js';
import { EventBus } from '../core/EventBus.js';

export const RewardSystem = {
    milestones: [25, 75, 150, 250, 400, 600, 900, 1300, 2000],

    checkMilestones(currentClicks) {
        const nextMilestone = this.milestones[GameState.run.milestoneIndex];
        if (nextMilestone && currentClicks >= nextMilestone) {
            GameState.run.milestoneIndex++;
            this.triggerUpgradeChoice();
        }
    },

    triggerUpgradeChoice() {
        GameState.run.isTransitioning = true; // Anti-missclick
        
        setTimeout(() => {
            GameState.run.isPaused = true;
            GameState.run.isTransitioning = false;
            const choices = this.generateChoices(3);
            EventBus.emit("showUpgradeChoices", choices);
        }, 500); // 500ms micro-delay para a surpresa
    },

    generateChoices(amount, forcedRarity = null) {
        const choices = [];
        let attempts = 0;
        
        while (choices.length < amount && attempts < 50) {
            attempts++;
            const rarity = forcedRarity || this.rollRarity();
            const validUpgrades = UPGRADES.filter(u => u.rarity === rarity);
            
            if (validUpgrades.length === 0) continue;
            
            const randomUpg = validUpgrades[Math.floor(Math.random() * validUpgrades.length)];
            const currentStacks = GameState.run.activeUpgrades[randomUpg.id] || 0;
            const isAlreadyInChoices = choices.find(c => c.id === randomUpg.id);

            if (currentStacks < randomUpg.stackLimit && !isAlreadyInChoices) {
                choices.push(randomUpg);
            }
        }
        
        while(choices.length < amount && UPGRADES[0]) {
             if(!choices.find(c => c.id === UPGRADES[0].id)) choices.push(UPGRADES[0]);
             else break;
        }

        return choices;
    },

    rollRarity() {
        const metaLuck = GameState.meta.metaUpgrades.luck * 0.05;
        const runLuck = GameState.run.stats ? GameState.run.stats.luckBonus : 0;
        const totalLuckMod = metaLuck + runLuck;

        let totalWeight = 0;
        const weights = {};
        
        for (let r in UPGRADE_RARITIES) {
            let w = UPGRADE_RARITIES[r].weight;
            if(r !== "COMMON" && r !== "UNCOMMON") w += (w * totalLuckMod); 
            weights[r] = w;
            totalWeight += w;
        }

        let roll = Math.random() * totalWeight;
        for (let r in weights) {
            if (roll < weights[r]) return r;
            roll -= weights[r];
        }
        return "COMMON";
    }
};
