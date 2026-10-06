import { GameState } from '../core/GameState.js';
import { RELICS, SYNERGIES } from '../data/relics.js';
import { ModifierSystem } from '../core/ModifierSystem.js';
import { EventBus } from '../core/EventBus.js';

export const RelicSystem = {
    currentChoices: [],

    addRelic(id, forceBypass = false) {
        if (!forceBypass && !GameState.run.isPaused) return;
        const relicData = RELICS.find(r => r.id === id);
        if (!relicData) return;

        if (!GameState.run.activeRelics[id]) {
            GameState.run.activeRelics[id] = 0;
        }

        if (relicData.unique && GameState.run.activeRelics[id] >= 1) return;
        if (relicData.stackable && GameState.run.activeRelics[id] >= relicData.stackLimit) return;

        GameState.run.activeRelics[id]++;
        
        this.updateSynergies();
        ModifierSystem.recalculateStats();

        if (!forceBypass) {
            this.currentChoices = [];
            GameState.run.isPaused = false;
            EventBus.emit("relicApplied");
            EventBus.emit("stateUpdated");
        }
    },

    removeRelic(id) {
        if (GameState.run.activeRelics[id]) {
            GameState.run.activeRelics[id]--;
            if (GameState.run.activeRelics[id] <= 0) {
                delete GameState.run.activeRelics[id];
            }
            this.updateSynergies();
            ModifierSystem.recalculateStats();
            EventBus.emit("stateUpdated");
        }
    },

    hasRelic(id) {
        return (GameState.run.activeRelics[id] || 0) > 0;
    },

    getRelicStacks(id) {
        return GameState.run.activeRelics[id] || 0;
    },

    countTag(tagTarget) {
        let count = 0;
        for (const [id, stacks] of Object.entries(GameState.run.activeRelics)) {
            const relic = RELICS.find(r => r.id === id);
            if (relic && relic.tags.includes(tagTarget)) {
                count += stacks; 
            }
        }
        return count;
    },

    updateSynergies() {
        GameState.run.activeSynergies = [];
        for (const syn of SYNERGIES) {
            let active = false;
            if (syn.condition.tag) {
                if (this.countTag(syn.condition.tag) >= syn.condition.count) active = true;
            } else if (syn.condition.multiTags) {
                active = true;
                for (const req of syn.condition.multiTags) {
                    if (this.countTag(req.tag) < req.count) {
                        active = false;
                        break;
                    }
                }
            }
            if (active) GameState.run.activeSynergies.push(syn.id);
        }
    },

    triggerRelicChoice() {
        GameState.run.isPaused = true;
        const choices = this.generateChoices(3);
        this.currentChoices = choices.map(c => c.id);
        EventBus.emit("renderRelicChoices", choices);
    },

    // Refatorado para aceitar forcedRarity p/ Eventos e Merchant
    generateChoices(amount, forcedRarity = null) {
        const choices = [];
        let attempts = 0;
        
        import('./RewardSystem.js').then(({ RewardSystem }) => {
            while (choices.length < amount && attempts < 100) {
                attempts++;
                const rarity = forcedRarity || RewardSystem.rollRarity();
                const validRelics = RELICS.filter(r => r.rarity === rarity);
                
                if (validRelics.length === 0) continue;
                
                const randomRelic = validRelics[Math.floor(Math.random() * validRelics.length)];
                const currentStacks = this.getRelicStacks(randomRelic.id);
                const isAlreadyInChoices = choices.find(c => c.id === randomRelic.id);

                let canPick = true;
                if (isAlreadyInChoices) canPick = false;
                if (randomRelic.unique && currentStacks >= 1) canPick = false;
                if (randomRelic.stackable && currentStacks >= randomRelic.stackLimit) canPick = false;

                if (canPick) choices.push(randomRelic);
            }
        });
        
        // Retorno síncrono da array vazia modificada via referência após resolução simples (RewardSystem é síncrono na prática)
        // No contexto do Vanilla JS, dynamic imports costumam quebrar sincronia, mas a infraestrutura base aqui lida com isso.
        // Para resolver de forma puramente síncrona:
        
        const rsLuckMod = GameState.meta.metaUpgrades.luck * 0.05 + (GameState.run.stats ? GameState.run.stats.luckBonus : 0);
        
        const rollRaritySync = () => {
             // Mock do RewardSystem rollRarity para não depender de dynamic import assíncrono durante eventos síncronos
             const w = { COMMON: 60, UNCOMMON: 25*(1+rsLuckMod), RARE: 10*(1+rsLuckMod), EPIC: 4*(1+rsLuckMod), LEGENDARY: 1*(1+rsLuckMod) };
             let tot = 0; for(let k in w) tot+=w[k];
             let r = Math.random() * tot;
             for(let k in w) { if (r < w[k]) return k; r -= w[k]; }
             return "COMMON";
        };

        attempts = 0;
        while (choices.length < amount && attempts < 100) {
            attempts++;
            const rarity = forcedRarity || rollRaritySync();
            const validRelics = RELICS.filter(r => r.rarity === rarity);
            if (validRelics.length === 0) continue;
            
            const randomRelic = validRelics[Math.floor(Math.random() * validRelics.length)];
            const currentStacks = this.getRelicStacks(randomRelic.id);
            const isAlreadyInChoices = choices.find(c => c.id === randomRelic.id);

            let canPick = true;
            if (isAlreadyInChoices) canPick = false;
            if (randomRelic.unique && currentStacks >= 1) canPick = false;
            if (randomRelic.stackable && currentStacks >= randomRelic.stackLimit) canPick = false;

            if (canPick) choices.push(randomRelic);
        }

        if(choices.length < amount) {
           const fallback = RELICS.filter(r => !choices.find(c => c.id === r.id) && r.rarity === "COMMON");
           for(let f of fallback) { if(choices.length < amount) choices.push(f); }
        }

        return choices;
    }
};
