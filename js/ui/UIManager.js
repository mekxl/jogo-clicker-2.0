import { EventBus } from '../core/EventBus.js';
import { GameState } from '../core/GameState.js';
import { NumberSystem } from '../core/NumberSystem.js';
import { UpgradeSystem } from '../progression/UpgradeSystem.js';
import { RelicSystem } from '../progression/RelicSystem.js';
import { MetaProgression } from '../progression/MetaProgression.js';
import { AscensionSystem } from '../endgame/AscensionSystem.js';
import { UPGRADE_RARITIES } from '../data/upgrades.js';
import { EnemySystem } from '../combat/EnemySystem.js';
import { RELICS, SYNERGIES } from '../data/relics.js';
import { EventSystem } from '../events/EventSystem.js';
import { MerchantSystem } from '../events/MerchantSystem.js';
import { SaveSystem } from '../core/SaveSystem.js';
import { CHALLENGES } from '../data/challenges.js';

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
            enemyPhase: document.getElementById('ui-enemy-phase'), 
            break: document.getElementById('ui-break'),
            
            frenzyFill: document.getElementById('frenzy-fill'),
            automationPanel: document.getElementById('automation-panel'),
            
            gameOverScreen: document.getElementById('game-over-screen'),
            gameOverTitle: document.getElementById('game-over-title'),
            upgradeModal: document.getElementById('upgrade-modal'),
            modalTitle: document.getElementById('modal-title'),
            upgradeContainer: document.getElementById('upgrade-choices-container'),
            
            eventModal: document.getElementById('event-modal'),
            eventTitle: document.getElementById('event-title'),
            eventDesc: document.getElementById('event-desc'),
            eventChoices: document.getElementById('event-choices'),
            merchantModal: document.getElementById('merchant-modal'),
            merchantItems: document.getElementById('merchant-items'),
            
            settingsModal: document.getElementById('settings-modal'),
            metaModal: document.getElementById('meta-modal'),
            metaContainer: document.getElementById('meta-upgrades-container'),
            relicsList: document.getElementById('relics-list'),
            synergiesList: document.getElementById('synergies-list'),
            
            endClicks: document.getElementById('end-clicks'),
            endDmg: document.getElementById('end-dmg'),
            endFov: document.getElementById('end-fov')
        };

        EventBus.on("runStarted", () => {
            this.hideGameOver();
            this.updateAscensionUI();
        });
        EventBus.on("runEnded", (data) => this.showGameOver(data, false));
        EventBus.on("runVictory", (data) => this.showGameOver(data, true));
        
        EventBus.on("stateUpdated", () => this.updateAll());
        EventBus.on("metaUpdated", () => this.updateMetaUI());
        EventBus.on("frenzyUpdated", () => this.updateFrenzyUI());
        EventBus.on("automationUpdated", () => this.updateAutomationUI());
        
        EventBus.on("showUpgradeChoices", (choices) => this.showCardScreen(choices, "SELECT UPGRADE", false));
        EventBus.on("upgradeApplied", () => this.els.upgradeModal.classList.add('hidden'));
        EventBus.on("renderRelicChoices", (choices) => this.showCardScreen(choices, "RELIC DISCOVERED", true));
        EventBus.on("relicApplied", () => {
            this.els.upgradeModal.classList.add('hidden');
            this.updateRelicsPanel();
        });

        EventBus.on("showEvent", (ev) => this.showEventModal(ev));
        EventBus.on("showMerchant", (data) => this.showMerchantModal(data));
        
        EventBus.on("challengeCompleted", (id) => this.showChallengeToast(id));

        document.getElementById('btn-merchant-reroll').addEventListener('click', () => MerchantSystem.reroll());
        document.getElementById('btn-merchant-close').addEventListener('click', () => {
            this.els.merchantModal.classList.add('hidden');
            MerchantSystem.closeMerchant();
        });

        document.getElementById('btn-open-meta').addEventListener('click', () => {
            this.updateMetaUI();
            this.els.metaModal.classList.remove('hidden');
        });
        document.getElementById('btn-close-meta').addEventListener('click', () => this.els.metaModal.classList.add('hidden'));
        
        // Controle de Ascension no Menu de Meta
        document.getElementById('btn-ascension-down').addEventListener('click', () => {
            if(GameState.meta.currentAscensionSelection > 0) {
                AscensionSystem.setAscension(GameState.meta.currentAscensionSelection - 1);
                this.updateAscensionUI();
            }
        });
        document.getElementById('btn-ascension-up').addEventListener('click', () => {
            if(GameState.meta.currentAscensionSelection < GameState.meta.highestAscensionUnlocked) {
                AscensionSystem.setAscension(GameState.meta.currentAscensionSelection + 1);
                this.updateAscensionUI();
            }
        });

        document.getElementById('btn-open-settings').addEventListener('click', () => {
            document.getElementById('toggle-particles').checked = GameState.meta.settings.particlesEnabled;
            document.getElementById('toggle-shake').checked = GameState.meta.settings.screenShakeEnabled;
            document.getElementById('toggle-sfx').checked = GameState.meta.settings.sfxEnabled;
            this.els.settingsModal.classList.remove('hidden');
        });
        document.getElementById('btn-close-settings').addEventListener('click', () => {
            GameState.meta.settings.particlesEnabled = document.getElementById('toggle-particles').checked;
            GameState.meta.settings.screenShakeEnabled = document.getElementById('toggle-shake').checked;
            GameState.meta.settings.sfxEnabled = document.getElementById('toggle-sfx').checked;
            SaveSystem.save();
            this.els.settingsModal.classList.add('hidden');
        });

        this.updateRelicsPanel();
        this.updateAscensionUI();
    },

    updateAll() {
        if (!GameState.run.isRunActive) return;
        const r = GameState.run;
        const enemy = EnemySystem.getActiveEnemy();
        const fn = NumberSystem.formatNumber.bind(NumberSystem);

        if (r.eventState === "ACTIVE") {
            this.els.enemyName.innerText = "UNKNOWN EVENT";
            this.els.enemyName.style.color = "#ff00ff";
            this.els.enemyPhase.innerText = "";
        } else if (r.merchantState === "ACTIVE") {
            this.els.enemyName.innerText = "MERCHANT NODE";
            this.els.enemyName.style.color = "#bb88ff";
            this.els.enemyPhase.innerText = "";
        } else if (enemy && r.merchantState === "NONE" && r.eventState === "NONE") {
            this.els.enemyName.innerText = enemy.type === "BOSS" ? `[BOSS] ${enemy.name}` : enemy.name;
            this.els.enemyName.style.color = enemy.color;
            this.els.hp.innerText = `${fn(enemy.currentHP)}/${fn(enemy.maxHP)}`;
            
            if (enemy.type === "BOSS" && enemy.phases[enemy.currentPhaseIndex]) {
                this.els.enemyPhase.innerText = `Phase ${enemy.currentPhaseIndex + 1}: ${enemy.phases[enemy.currentPhaseIndex].name}`;
                this.els.enemyPhase.style.color = "#ff0000";
            } else {
                this.els.enemyPhase.innerText = "";
            }

            if(enemy.state === "BREAKING") this.els.break.innerText = "VULNERABLE!";
            else this.els.break.innerText = `${fn(enemy.breakCurrent)}/${fn(enemy.breakMax)}`;
        }

        this.els.encounter.innerText = r.encounterIndex;
        this.els.energy.innerText = fn(r.energy);
        this.els.combo.innerText = fn(r.currentCombo);
        this.els.multiplier.innerText = fn(r.comboMultiplier);
        this.els.dmg.innerText = fn(r.stats.damagePerClick); 
        this.els.clicks.innerText = fn(r.totalClicks);
        this.els.fov.innerText = fn(GameState.meta.fragmentsOfVoid);

        this.updateFrenzyUI();
    },

    updateAscensionUI() {
        document.getElementById('ui-ascension-label').innerText = `ASCENSION ${GameState.meta.currentAscensionSelection}`;
    },

    showChallengeToast(id) {
        const ch = CHALLENGES.find(c => c.id === id);
        if (!ch) return;
        
        const toast = document.createElement('div');
        toast.className = 'challenge-toast float-up-anim';
        toast.innerHTML = `<strong>CHALLENGE COMPLETED</strong><br>${ch.name}<br><span style="font-size: 0.7rem;">+${ch.rewardFov} FoV</span>`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
    },

    updateFrenzyUI() {
        if (!GameState.run.isRunActive) return;
        const frenzy = GameState.run.frenzy;
        if (frenzy.isActive) {
            this.els.frenzyFill.style.width = "100%";
            this.els.frenzyFill.style.background = "#ff00ff";
        } else {
            this.els.frenzyFill.style.width = `${frenzy.meter}%`;
            this.els.frenzyFill.style.background = "#fff";
        }
    },

    updateAutomationUI() {
        this.els.automationPanel.innerHTML = '';
        for (const [id, instance] of Object.entries(GameState.run.automation.activeEntities)) {
            const div = document.createElement('div');
            div.className = 'automation-item';
            div.innerText = `${instance.name} x${instance.count}`;
            this.els.automationPanel.appendChild(div);
        }
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
                if(isRelic) {
                    RelicSystem.addRelic(item.id);
                    EventBus.emit("relicApplied", item.id); // Para Codex
                }
                else {
                    UpgradeSystem.selectUpgrade(item.id);
                    EventBus.emit("upgradeApplied", item.id); // Para Codex
                }
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
            let reqText = "";
            let disabled = false;
            if (choice.requirements) {
                if (choice.requirements.energy && GameState.run.energy < choice.requirements.energy) {
                    reqText = ` [Req: ${choice.requirements.energy} ENG]`;
                    disabled = true;
                }
            }
            if (disabled) btn.classList.add('disabled');
            let riskHtml = choice.risk ? `<div class="event-risk-label">RISK: ${choice.risk.probability * 100}%</div>` : "";
            btn.innerHTML = `<h4>${choice.label}${reqText}</h4><p>${choice.description}</p>${riskHtml}`;
            if (!disabled) {
                btn.addEventListener('click', () => {
                    this.els.eventModal.classList.add('hidden');
                    import('../events/EventSystem.js').then(m => m.EventSystem.selectChoice(choice.id));
                });
            }
            this.els.eventChoices.appendChild(btn);
        });
        this.els.eventModal.classList.remove('hidden');
    },

    showMerchantModal(data) {
        this.els.merchantItems.innerHTML = '';
        document.getElementById('btn-merchant-reroll').innerText = `REROLL (${data.rerollCost} ENG)`;
        if (GameState.run.energy < data.rerollCost) document.getElementById('btn-merchant-reroll').classList.add('disabled');
        else document.getElementById('btn-merchant-reroll').classList.remove('disabled');

        data.items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card merchant-card';
            if (item.purchased) card.classList.add('disabled');
            let color = item.type === "RELIC" ? "#ffaa00" : (item.rarity ? UPGRADE_RARITIES[item.rarity].color : "#aaa");
            card.style.borderColor = color;
            card.innerHTML = `<h3 style="color: ${color}">${item.name}</h3><div class="desc" style="margin-top:10px;">${item.description}</div><div class="cost-tag">${item.purchased ? "SOLD OUT" : item.cost + " ENG"}</div>`;
            if (!item.purchased && GameState.run.energy >= item.cost) {
                card.addEventListener('click', () => import('../events/MerchantSystem.js').then(m => m.MerchantSystem.buyItem(item.uid)));
            } else if (!item.purchased) card.style.opacity = "0.5";
            this.els.merchantItems.appendChild(card);
        });
        this.els.merchantModal.classList.remove('hidden');
    },

    updateRelicsPanel() {
        this.els.relicsList.innerHTML = '';
        for (const [id, stacks] of Object.entries(GameState.run.activeRelics || {})) {
            const relic = RELICS.find(x => x.id === id);
            if (!relic) continue;
            const div = document.createElement('div');
            div.className = `relic-item ${relic.rarity.toLowerCase()}`;
            div.innerHTML = `<div class="relic-title">${relic.name} ${stacks > 1 ? `x${stacks}` : ''}</div><div class="relic-tags">${relic.tags.join(', ')}</div>`;
            this.els.relicsList.appendChild(div);
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
            div.innerHTML = `<div><strong>${upgData.name}</strong> (Lvl ${lvl}/${upgData.maxLvl})<br><span style="font-size:0.8rem; color:#aaa">Cost: ${cost} FoV</span></div><button ${!canAfford ? 'disabled' : ''}>UPGRADE</button>`;
            div.querySelector('button').addEventListener('click', () => MetaProgression.buyUpgrade(id));
            this.els.metaContainer.appendChild(div);
        }
    },

    showGameOver(data, isVictory) {
        const fn = NumberSystem.formatNumber.bind(NumberSystem);
        this.els.gameOverTitle.innerText = isVictory ? "RUN VICTORY" : "RUN ENDED";
        this.els.gameOverTitle.style.color = isVictory ? "#ffaa00" : "var(--core-base)";
        
        document.getElementById('end-clicks').innerText = fn(data.runState.totalClicks);
        document.getElementById('end-dmg').innerText = fn(data.runState.totalDamage);
        document.getElementById('end-fov').innerText = fn(data.fovGained);
        
        // Se desbloqueou Ascension
        if (isVictory) {
            document.getElementById('end-fov').innerHTML += `<br><span style="color:#00ccff">Ascension Unlocked!</span>`;
        }

        this.updateMetaUI(); 
        this.els.gameOverScreen.classList.remove('hidden');
    },

    hideGameOver() {
        this.els.gameOverScreen.classList.add('hidden');
        this.updateRelicsPanel(); 
        this.updateAutomationUI();
    }
};
