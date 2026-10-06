import { EventBus } from '../core/EventBus.js';
import { GameState } from '../core/GameState.js';
import { NumberSystem } from '../core/NumberSystem.js';
import { UpgradeSystem } from '../progression/UpgradeSystem.js';
import { RelicSystem } from '../progression/RelicSystem.js';
import { MetaProgression } from '../progression/MetaProgression.js';
import { UPGRADE_RARITIES } from '../data/upgrades.js';
import { EnemySystem } from '../combat/EnemySystem.js';
import { RELICS, SYNERGIES } from '../data/relics.js';
import { EventSystem } from '../events/EventSystem.js';
import { MerchantSystem } from '../events/MerchantSystem.js';

export const UIManager = {
    init() {
        this.els = {
            hp: document.getElementById('ui-hp'),
            energy: document.getElementById('ui-energy'),
            combo: document.getElementById('ui-combo'),
            multiplier: document.getElementById('ui-multiplier'),
            dmg: document.getElementById('ui-dmg'),
            clicks: document.getElementById('ui-clicks'),
            fov: document.getElementById('ui-fov'),
            encounter: document.getElementById('ui-encounter'),
            enemyName: document.getElementById('ui-enemy-name'),
            break: document.getElementById('ui-break'),
            
            gameOverScreen: document.getElementById('game-over-screen'),
            upgradeModal: document.getElementById('upgrade-modal'),
            modalTitle: document.getElementById('modal-title'),
            upgradeContainer: document.getElementById('upgrade-choices-container'),
            
            eventModal: document.getElementById('event-modal'),
            eventTitle: document.getElementById('event-title'),
            eventDesc: document.getElementById('event-desc'),
            eventChoices: document.getElementById('event-choices'),
            
            merchantModal: document.getElementById('merchant-modal'),
            merchantItems: document.getElementById('merchant-items'),
            merchantRerollBtn: document.getElementById('btn-merchant-reroll'),
            merchantCloseBtn: document.getElementById('btn-merchant-close'),
            
            metaModal: document.getElementById('meta-modal'),
            metaContainer: document.getElementById('meta-upgrades-container'),
            relicsList: document.getElementById('relics-list'),
            synergiesList: document.getElementById('synergies-list'),
            
            endClicks: document.getElementById('end-clicks'),
            endDmg: document.getElementById('end-dmg'),
            endFov: document.getElementById('end-fov')
        };

        EventBus.on("runStarted", () => this.hideGameOver());
        EventBus.on("runEnded", (data) => this.showGameOver(data));
        EventBus.on("stateUpdated", () => this.updateAll());
        EventBus.on("metaUpdated", () => this.updateMetaUI());
        
        EventBus.on("showUpgradeChoices", (choices) => this.showCardScreen(choices, "SELECT UPGRADE", false));
        EventBus.on("upgradeApplied", () => this.els.upgradeModal.classList.add('hidden'));
        
        EventBus.on("renderRelicChoices", (choices) => this.showCardScreen(choices, "RELIC DISCOVERED", true));
        EventBus.on("relicApplied", () => {
            this.els.upgradeModal.classList.add('hidden');
            this.updateRelicsPanel();
        });

        // Eventos e Merchant listeners
        EventBus.on("showEvent", (ev) => this.showEventModal(ev));
        EventBus.on("showMerchant", (data) => this.showMerchantModal(data));
        
        this.els.merchantRerollBtn.addEventListener('click', () => MerchantSystem.reroll());
        this.els.merchantCloseBtn.addEventListener('click', () => {
            this.els.merchantModal.classList.add('hidden');
            MerchantSystem.closeMerchant();
        });

        document.getElementById('btn-open-meta').addEventListener('click', () => {
            this.updateMetaUI();
            this.els.metaModal.classList.remove('hidden');
        });
        document.getElementById('btn-close-meta').addEventListener('click', () => {
            this.els.metaModal.classList.add('hidden');
        });
        
        this.updateRelicsPanel();
    },

    updateAll() {
        if (!GameState.run.isRunActive) return;
        const r = GameState.run;
        const enemy = EnemySystem.getActiveEnemy();
        const fn = NumberSystem.formatNumber.bind(NumberSystem);

        if (r.eventState === "ACTIVE") {
            this.els.enemyName.innerText = "UNKNOWN EVENT";
            this.els.enemyName.style.color = "#ff00ff";
        } else if (r.merchantState === "ACTIVE") {
            this.els.enemyName.innerText = "MERCHANT NODE";
            this.els.enemyName.style.color = "#bb88ff";
        } else if (enemy && r.merchantState === "NONE" && r.eventState === "NONE") {
            this.els.enemyName.innerText = enemy.name;
            this.els.enemyName.style.color = enemy.color;
            this.els.hp.innerText = `${fn(enemy.currentHP)}/${fn(enemy.maxHP)}`;
            
            if(enemy.state === "BREAKING") {
                this.els.break.innerText = "VULNERABLE!";
            } else {
                this.els.break.innerText = `${fn(enemy.breakCurrent)}/${fn(enemy.breakMax)}`;
            }
        }

        this.els.encounter.innerText = r.encounterIndex;
        this.els.energy.innerText = fn(r.energy);
        this.els.combo.innerText = fn(r.currentCombo);
        this.els.multiplier.innerText = fn(r.comboMultiplier);
        this.els.dmg.innerText = fn(r.stats.damagePerClick); 
        this.els.clicks.innerText = fn(r.totalClicks);
        this.els.fov.innerText = fn(GameState.meta.fragmentsOfVoid);
    },

    showCardScreen(choices, titleText, isRelic) {
        this.els.modalTitle.innerText = titleText;
        this.els.upgradeContainer.innerHTML = '';
        
        choices.forEach(item => {
            const rarityInfo = UPGRADE_RARITIES[item.rarity] || { color: "#fff" };
            const card = document.createElement('div');
            card.className = 'card';
            card.style.borderColor = rarityInfo.color;
            
            let extraInfo = isRelic ? (item.unique ? "UNIQUE" : `Max Stacks: ${item.stackLimit}`) : "";
            let tagsHtml = item.tags ? `<div class="tags">${item.tags.join(' ')}</div>` : "";

            card.innerHTML = `
                <h3 style="color: ${rarityInfo.color}">${item.name}</h3>
                <div class="rarity" style="color: ${rarityInfo.color}">${item.rarity}</div>
                <div class="desc">${item.description}</div>
                <div style="font-size: 0.7rem; color:#888; margin-bottom: 5px;">${extraInfo}</div>
                ${tagsHtml}
            `;
            
            card.addEventListener('click', () => {
                if(isRelic) RelicSystem.addRelic(item.id);
                else UpgradeSystem.selectUpgrade(item.id);
            });
            this.els.upgradeContainer.appendChild(card);
        });
        this.els.upgradeModal.classList.remove('hidden');
    },

    showEventModal(eventData) {
        this.els.eventTitle.innerText = eventData.name;
        this.els.eventDesc.innerText = eventData.description;
        this.els.eventChoices.innerHTML = '';
        
        eventData.choices.forEach(choice => {
            const btn = document.createElement('div');
            btn.className = 'event-choice-btn';
            
            // Requerimentos Visuais
            let reqText = "";
            let disabled = false;
            if (choice.requirements) {
                if (choice.requirements.energy && GameState.run.energy < choice.requirements.energy) {
                    reqText = ` [Requires ${choice.requirements.energy} Energy]`;
                    disabled = true;
                }
                if (choice.requirements.minRelics && Object.keys(GameState.run.activeRelics || {}).length < choice.requirements.minRelics) {
                    reqText = ` [Requires a Relic]`;
                    disabled = true;
                }
            }
            if (disabled) btn.classList.add('disabled');

            let riskHtml = choice.risk ? `<div class="event-risk-label">RISK: ${choice.risk.probability * 100}%</div>` : "";

            btn.innerHTML = `
                <h4>${choice.label}${reqText}</h4>
                <p>${choice.description}</p>
                ${riskHtml}
            `;
            
            if (!disabled) {
                btn.addEventListener('click', () => {
                    this.els.eventModal.classList.add('hidden');
                    EventSystem.selectChoice(choice.id);
                });
            }
            
            this.els.eventChoices.appendChild(btn);
        });
        
        this.els.eventModal.classList.remove('hidden');
    },

    showMerchantModal(data) {
        this.els.merchantItems.innerHTML = '';
        this.els.merchantRerollBtn.innerText = `REROLL (${data.rerollCost} ENG)`;
        
        if (GameState.run.energy < data.rerollCost) {
            this.els.merchantRerollBtn.classList.add('disabled');
        } else {
            this.els.merchantRerollBtn.classList.remove('disabled');
        }

        data.items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card merchant-card';
            if (item.purchased) card.classList.add('disabled');
            
            let color = "#aaa";
            if(item.type === "UPGRADE" && item.rarity) color = UPGRADE_RARITIES[item.rarity].color;
            if(item.type === "RELIC") color = "#ffaa00";
            card.style.borderColor = color;

            card.innerHTML = `
                <h3 style="color: ${color}">${item.name}</h3>
                <div class="desc" style="margin-top:10px;">${item.description}</div>
                <div class="cost-tag">${item.purchased ? "SOLD OUT" : item.cost + " ENG"}</div>
            `;
            
            if (!item.purchased && GameState.run.energy >= item.cost) {
                card.addEventListener('click', () => {
                    MerchantSystem.buyItem(item.uid);
                });
            } else if (!item.purchased) {
                card.style.opacity = "0.5";
            }
            
            this.els.merchantItems.appendChild(card);
        });
        
        this.els.merchantModal.classList.remove('hidden');
    },

    updateRelicsPanel() {
        this.els.relicsList.innerHTML = '';
        const r = GameState.run;
        for (const [id, stacks] of Object.entries(r.activeRelics || {})) {
            const relic = RELICS.find(x => x.id === id);
            if (!relic) continue;
            const div = document.createElement('div');
            div.className = `relic-item ${relic.rarity.toLowerCase()}`;
            div.innerHTML = `
                <div class="relic-title">${relic.name} ${stacks > 1 ? `x${stacks}` : ''}</div>
                <div class="relic-tags">${relic.tags.join(', ')}</div>
            `;
            this.els.relicsList.appendChild(div);
        }

        this.els.synergiesList.innerHTML = '';
        for (const synId of (r.activeSynergies || [])) {
            const syn = SYNERGIES.find(s => s.id === synId);
            if (!syn) continue;
            const div = document.createElement('div');
            div.className = 'syn-item';
            div.innerText = syn.name;
            this.els.synergiesList.appendChild(div);
        }
    },

    updateMetaUI() {
        this.els.fov.innerText = NumberSystem.formatNumber(GameState.meta.fragmentsOfVoid);
        this.els.metaContainer.innerHTML = '';
        for (const [id, upgData] of Object.entries(MetaProgression.upgrades)) {
            const lvl = GameState.meta.metaUpgrades[id];
            const cost = MetaProgression.getCost(id);
            const canAfford = GameState.meta.fragmentsOfVoid >= cost && lvl < upgData.maxLvl;
            const div = document.createElement('div');
            div.className = 'meta-item';
            div.innerHTML = `
                <div>
                    <strong>${upgData.name}</strong> (Lvl ${lvl}/${upgData.maxLvl})<br>
                    <span style="font-size:0.8rem; color:#aaa">Cost: ${cost} FoV</span>
                </div>
                <button ${!canAfford ? 'disabled' : ''}>UPGRADE</button>
            `;
            div.querySelector('button').addEventListener('click', () => MetaProgression.buyUpgrade(id));
            this.els.metaContainer.appendChild(div);
        }
    },

    showGameOver(data) {
        const fn = NumberSystem.formatNumber.bind(NumberSystem);
        this.els.endClicks.innerText = fn(data.runState.totalClicks);
        this.els.endDmg.innerText = fn(data.runState.totalDamage);
        this.els.endFov.innerText = fn(data.fovGained);
        this.updateMetaUI(); 
        this.els.gameOverScreen.classList.remove('hidden');
    },

    hideGameOver() {
        this.els.gameOverScreen.classList.add('hidden');
        this.updateRelicsPanel(); 
    }
};
