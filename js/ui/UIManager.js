import { EventBus } from '../core/EventBus.js';
import { GameState } from '../core/GameState.js';
import { NumberSystem } from '../core/NumberSystem.js';

export const UIManager = {
    init() {
        this.els = {
            hp: document.getElementById('ui-hp'),
            energy: document.getElementById('ui-energy'),
            combo: document.getElementById('ui-combo'),
            multiplier: document.getElementById('ui-multiplier'),
            dmg: document.getElementById('ui-dmg'),
            clicks: document.getElementById('ui-clicks'),
            gameOverScreen: document.getElementById('game-over-screen')
        };

        // Escuta eventos de arquitetura
        EventBus.on("runStarted", () => this.hideGameOver());
        EventBus.on("runEnded", () => this.showGameOver());
        EventBus.on("stateUpdated", () => this.updateAll());
    },

    updateAll() {
        if (!GameState.run.isRunActive) return;
        
        const r = GameState.run;
        const fn = NumberSystem.formatNumber.bind(NumberSystem);

        this.els.hp.innerText = `${fn(r.currentHP)}/${fn(r.maxHP)}`;
        this.els.energy.innerText = fn(r.energy);
        this.els.combo.innerText = fn(r.currentCombo);
        this.els.multiplier.innerText = fn(r.comboMultiplier);
        this.els.dmg.innerText = fn(r.damagePerClick);
        
        // Clicks usa o MetaState (persistente) ou RunState?
        // A UI exige "Total Clicks". Mostrarei o total histórico (Meta), mas poderia ser da Run.
        this.els.clicks.innerText = fn(GameState.meta.totalClicks);
    },

    showGameOver() {
        this.els.gameOverScreen.classList.remove('hidden');
    },

    hideGameOver() {
        this.els.gameOverScreen.classList.add('hidden');
    }
};
