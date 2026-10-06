import { GameState } from '../core/GameState.js';
import { RELICS, SYNERGIES } from '../data/relics.js';
import { ModifierSystem } from '../core/ModifierSystem.js';
import { EventBus } from '../core/EventBus.js';

export const RelicSystem = {
    currentChoices: [],

    addRelic(id) {
        if (!GameState.run.isPaused) return; // Segurança de UI
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

        this.currentChoices = [];
        GameState.run.isPaused = false;

        EventBus.emit("relicApplied");
        EventBus.emit("stateUpdated");
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
                count += stacks; // Conta 1 por stack da relíquia
            }
        }
        return count;
    },

    updateSynergies() {
        GameState.run.activeSynergies = [];
        
        for (const syn of SYNERGIES) {
            let active = false;
            
            // Checa condição simples de tag
            if (syn.condition.tag) {
                if (this.countTag(syn.condition.tag) >= syn.condition.count) {
                    active = true;
                }
            } 
            // Checa condição de múltiplas tags
            else if (syn.condition.multiTags) {
                active = true;
                for (const req of syn.condition.multiTags) {
                    if (this.countTag(req.tag) < req.count) {
                        active = false;
                        break;
                    }
                }
            }

            if (active) {
                GameState.run.activeSynergies.push(syn.id);
            }
        }
    },

    triggerRelicChoice() {
        GameState.run.isPaused = true;
        const choices = this.generateChoices(3);
        this.currentChoices = choices.map(c => c.id);
        EventBus.emit("showRelicChoices", choices);
    },

    generateChoices(amount) {
        // Usa o RewardSystem para reaproveitar a rolagem de raridade com Luck
        import('./RewardSystem.js').then(({ RewardSystem }) => {
            const choices = [];
            let attempts = 0;
            
            while (choices.length < amount && attempts < 100) {
                attempts++;
                const rarity = RewardSystem.rollRarity();
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
            
            // Fallback se faltar opção (muito improvável com 50 relíquias, mas evita softlock)
            if(choices.length < amount) {
               const fallback = RELICS.filter(r => !choices.find(c => c.id === r.id) && r.rarity === "COMMON");
               for(let f of fallback) {
                   if(choices.length < amount) choices.push(f);
               }
            }

            // Emite pro listener já configurado
            EventBus.emit("renderRelicChoices", choices);
        });
        return []; // Retorno assíncrono evitado delegando a emissão
    }
};
