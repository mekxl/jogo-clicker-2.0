import { EventBus } from '../core/EventBus.js';
import { GameState } from '../core/GameState.js';
import { NumberSystem } from '../core/NumberSystem.js';
import { UpgradeSystem } from '../progression/UpgradeSystem.js';
import { MetaProgression } from '../progression/MetaProgression.js';
import { UPGRADE_RARITIES } from '../data/upgrades.js';

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
            gameOverScreen: document.getElementById('game-over-screen'),
            upgradeModal: document.getElementById('upgrade-modal'),
            upgradeContainer: document.getElementById('upgrade-choices-container'),
            metaModal: document.getElementById('meta-modal'),
            metaContainer: document.getElementById('meta-upgrades-container'),
            this.els.encounter = document.getElementById('ui-encounter'),
            this.els.enemyName = document.getElementById('ui-enemy-name'),
            this.els.break = document.getElementById('ui-break'),
            
            endClicks: document.getElementById('end-clicks'),
            endDmg: document.getElementById('end-dmg'),
            endFov: document.getElementById('end-fov')
        };

        EventBus.on("runStarted", () => this.hideGameOver());
        EventBus.on("runEnded", (data) => this.showGameOver(data));
        EventBus.on("stateUpdated", () => this.updateAll());
        EventBus.on("metaUpdated", () => this.updateMetaUI());
        
        EventBus.on("showUpgradeChoices", (choices) => this.showUpgradeScreen(choices));
        EventBus.on("upgradeApplied", () => this.els.upgradeModal.classList.add('hidden'));

        document.getElementById('btn-open-meta').addEventListener('click', () => {
            this.updateMetaUI();
            this.els.metaModal.classList.remove('hidden');
        });
        document.getElementById('btn-close-meta').addEventListener('click', () => {
            this.els.metaModal.classList.add('hidden');
        });
    },

    updateAll() {
        if (!GameState.run.isRunActive) return;
        const r = GameState.run;
        const enemy = EnemySystem.getActiveEnemy();
        const fn = NumberSystem.formatNumber.bind(NumberSystem);

        if (enemy) {
            this.els.encounter.innerText = r.encounterIndex;
            this.els.enemyName.innerText = enemy.name;
            this.els.enemyName.style.color = enemy.color;
            this.els.hp.innerText = `${fn(enemy.currentHP)}/${fn(enemy.maxHP)}`;

            if(enemy.state === "BREAKING") {
                this.els.break.innerText = "VULNERABLE!";
                } else {
                this.els.break.innerText = `${fn(enemy.breakCurrent)}/${fn(enemy.breakMax)}`;
            }
        }

        this.els.hp.innerText = `${fn(r.currentHP)}/${fn(r.maxHP)}`;
        this.els.energy.innerText = fn(r.energy);
        this.els.combo.innerText = fn(r.currentCombo);
        this.els.multiplier.innerText = fn(r.comboMultiplier);
        
        // Agora mostra o dano BASE (antes de crits/combo dinâmico) para referência
        this.els.dmg.innerText = fn(r.stats.damagePerClick); 
        this.els.clicks.innerText = fn(r.totalClicks);
        this.els.fov.innerText = fn(GameState.meta.fragmentsOfVoid);
    },

    showUpgradeScreen(choices) {
        this.els.upgradeContainer.innerHTML = '';
        choices.forEach(upg => {
            const rarityInfo = UPGRADE_RARITIES[upg.rarity];
            const card = document.createElement('div');
            card.className = 'card';
            card.style.borderColor = rarityInfo.color;
            
            card.innerHTML = `
                <h3 style="color: ${rarityInfo.color}">${upg.name}</h3>
                <div class="rarity" style="color: ${rarityInfo.color}">${upg.rarity}</div>
                <div class="desc">${upg.description}</div>
                <div class="tags">${upg.tags.join(' ')}</div>
            `;
            
            card.addEventListener('click', () => {
                UpgradeSystem.selectUpgrade(upg.id);
            });
            this.els.upgradeContainer.appendChild(card);
        });
        this.els.upgradeModal.classList.remove('hidden');
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
            
            const btn = div.querySelector('button');
            btn.addEventListener('click', () => MetaProgression.buyUpgrade(id));
            
            this.els.metaContainer.appendChild(div);
        }
    },

    showGameOver(data) {
        const fn = NumberSystem.formatNumber.bind(NumberSystem);
        this.els.endClicks.innerText = fn(data.runState.totalClicks);
        this.els.endDmg.innerText = fn(data.runState.totalDamage);
        this.els.endFov.innerText = fn(data.fovGained);
        
        this.updateMetaUI(); // Atualiza FoV no topo
        this.els.gameOverScreen.classList.remove('hidden');
    },

    hideGameOver() {
        this.els.gameOverScreen.classList.add('hidden');
    }
};
