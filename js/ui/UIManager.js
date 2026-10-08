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
            
            endStats: document.getElementById('end-stats')
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
        
        EventBus.on("showUpgradeChoices", (choices) => this.showCardScreen(choices, "SELECIONE UM UPGRADE", false));
        EventBus.on("upgradeApplied", () => this.els.upgradeModal.classList.add('hidden'));
        EventBus.on("renderRelicChoices", (choices) => this.showCardScreen(choices, "NOVA RELÍQUIA", true));
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
            this.els.enemyName.innerText = "EVENTO DESCONHECIDO";
            this.els.enemyName.style.color = "#ff00ff";
            this.els.enemyPhase.innerText = "";
        } else if (r.merchantState === "ACTIVE") {
            this.els.enemyName.innerText = "MERCADOR ERRANTE";
            this.els.enemyName.style.color = "#bb88ff";
            this.els.enemyPhase.innerText = "";
        } else if (enemy && r.merchantState === "NONE" && r.eventState === "NONE") {
            this.els.enemyName.innerText = enemy.type === "BOSS" ? `[CHEFE] ${enemy.name}` : enemy.name;
            this.els.enemyName.style.color = enemy.color;
            this.els.hp.innerText = `${fn(enemy.currentHP)}/${fn(enemy.maxHP)}`;
            
            if (enemy.type === "BOSS" && enemy.phases[enemy.currentPhaseIndex]) {
                this.els.enemyPhase.innerText = `Fase ${enemy.currentPhaseIndex + 1}: ${enemy.phases[enemy.currentPhaseIndex].name}`;
                this.els.enemyPhase.style.color = "#ff0000";
            } else {
                this.els.enemyPhase.innerText = "";
            }

            if(enemy.state === "BREAKING") this.els.break.innerText = "VULNERÁVEL!";
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
        document.getElementById('ui-ascension-label').innerText = `ASCENSÃO ${GameState.meta.currentAscensionSelection}`;
    },

    showChallengeToast(id) {
        const ch = CHALLENGES.find(c => c.id === id);
        if (!ch) return;
        const toast = document.createElement('div');
        toast.className = 'challenge-toast float-up-anim';
        toast.innerHTML = `<strong>CONQUISTA DESBLOQUEADA</strong><br>${ch.name}<br><span style="font-size: 0.7rem;">+${ch.rewardFov} Fragmentos</span>`;
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
        
        choices.forEach((item, idx) => {
            const rarityInfo = UPGRADE_RARITIES[item.rarity] || { color: "#fff", label: "Desconhecido" };
            const card = document.createElement('div');
            card.className = 'card';
            card.style.borderColor = rarityInfo.color;
            
            // ANIMAÇÃO DE REVELAÇÃO EM CASCATA & INPUT LOCK ANTI-MISSCLICK
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out, box-shadow 0.2s';
            card.style.pointerEvents = 'none';

            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
                setTimeout(() => { card.style.pointerEvents = 'auto'; }, 300);
            }, 150 * idx + 200);
            
            let extraInfo = isRelic ? (item.unique ? "ÚNICO" : `Máx. Acúmulos: ${item.stackLimit}`) : "";
            let tagsHtml = item.tags ? `<div class="tags">${item.tags.join(' ')}</div>` : "";
            
            card.innerHTML = `
                <h3 style="color: ${rarityInfo.color}">${item.name}</h3>
                <div class="rarity" style="color: ${rarityInfo.color}">${rarityInfo.label}</div>
                <div class="desc">${item.description}</div>
                <div style="font-size: 0.7rem; color:#888; margin-bottom: 5px;">${extraInfo}</div>
                ${tagsHtml}
            `;
            card.addEventListener('click', () => {
                if(isRelic) {
                    RelicSystem.addRelic(item.id);
                    EventBus.emit("relicApplied", item.id); 
                }
                else {
                    UpgradeSystem.selectUpgrade(item.id);
                    EventBus.emit("upgradeApplied", item.id);
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
        eventData.choices.forEach((choice, idx) => {
            const btn = document.createElement('div');
            btn.className = 'event-choice-btn';
            
            btn.style.opacity = '0';
            btn.style.transform = 'translateY(20px)';
            btn.style.transition = 'opacity 0.3s, transform 0.3s, background 0.2s';
            btn.style.pointerEvents = 'none';
            setTimeout(() => {
                btn.style.opacity = '1';
                btn.style.transform = 'translateY(0)';
                setTimeout(() => { btn.style.pointerEvents = 'auto'; }, 300);
            }, 100 * idx + 200);

            let reqText = "";
            let disabled = false;
            if (choice.requirements) {
                if (choice.requirements.energy && GameState.run.energy < choice.requirements.energy) {
                    reqText = ` [Req: ${choice.requirements.energy} ENG]`;
                    disabled = true;
                }
            }
            if (disabled) btn.classList.add('disabled');
            let riskHtml = choice.risk ? `<div class="event-risk-label">RISCO: ${choice.risk.probability * 100}%</div>` : "";
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
        document.getElementById('btn-merchant-reroll').innerText = `REROLAR (${data.rerollCost} ENG)`;
        if (GameState.run.energy < data.rerollCost) document.getElementById('btn-merchant-reroll').classList.add('disabled');
        else document.getElementById('btn-merchant-reroll').classList.remove('disabled');

        data.items.forEach((item, idx) => {
            const card = document.createElement('div');
            card.className = 'card merchant-card';
            
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.3s, transform 0.3s';
            card.style.pointerEvents = 'none';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
                setTimeout(() => { card.style.pointerEvents = 'auto'; }, 300);
            }, 150 * idx + 200);

            if (item.purchased) card.classList.add('disabled');
            let color = item.type === "RELIC" ? "#ffaa00" : (item.rarity ? UPGRADE_RARITIES[item.rarity].color : "#aaa");
            card.style.borderColor = color;
            card.innerHTML = `<h3 style="color: ${color}">${item.name}</h3><div class="desc" style="margin-top:10px;">${item.description}</div><div class="cost-tag">${item.purchased ? "ESGOTADO" : item.cost + " ENG"}</div>`;
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
        const metaDict = {
            startingDamage: "Dano Inicial", energyReserve: "Reserva de Energia",
            luck: "Sorte (Bônus de Raridade)", knowledge: "Conhecimento (FoV Bônus)",
            resistance: "Resistência Base"
        };
        for (const [id, upgData] of Object.entries(MetaProgression.upgrades)) {
            const lvl = GameState.meta.metaUpgrades[id];
            const cost = MetaProgression.getCost(id);
            const canAfford = GameState.meta.fragmentsOfVoid >= cost && lvl < upgData.maxLvl;
            const div = document.createElement('div');
            div.className = 'meta-item';
            div.innerHTML = `<div><strong>${metaDict[id] || upgData.name}</strong> (Lvl ${lvl}/${upgData.maxLvl})<br><span style="font-size:0.8rem; color:#aaa">Custo: ${cost} FV</span></div><button ${!canAfford ? 'disabled' : ''}>MELHORAR</button>`;
            div.querySelector('button').addEventListener('click', () => MetaProgression.buyUpgrade(id));
            this.els.metaContainer.appendChild(div);
        }
    },

    showGameOver(data, isVictory) {
        const fn = NumberSystem.formatNumber.bind(NumberSystem);
        this.els.gameOverTitle.innerText = isVictory ? "VITÓRIA!" : "SISTEMA DESCONECTADO";
        this.els.gameOverTitle.style.color = isVictory ? "#ffaa00" : "var(--core-base)";
        
        let relicsObtained = Object.keys(data.runState.activeRelics).length;
        let upgradesGot = 0;
        for(let key in data.runState.activeUpgrades) upgradesGot += data.runState.activeUpgrades[key];

        this.els.endStats.innerHTML = `
            <p><strong>Dano Total:</strong> ${fn(data.runState.totalDamage)}</p>
            <p><strong>Combo Máximo:</strong> ${fn(data.runState.maxCombo)}</p>
            <p><strong>Inimigos Vencidos:</strong> ${fn(data.runState.enemiesDefeated)}</p>
            <p><strong>Relíquias Coletadas:</strong> ${relicsObtained}</p>
            <p><strong>Upgrades Comprados:</strong> ${upgradesGot}</p>
            <hr style="border-color:#333; margin:10px 0;">
            <p class="text-fov" style="font-size: 1.2rem;">+${fn(data.fovGained)} Fragmentos do Vazio</p>
        `;
        
        if (isVictory) {
            this.els.endStats.innerHTML += `<br><span style="color:#00ccff; font-weight:bold;">NÍVEL DE ASCENSÃO DESBLOQUEADO!</span>`;
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
