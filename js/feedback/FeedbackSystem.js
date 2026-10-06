import { EventBus } from '../core/EventBus.js';
import { NumberSystem } from '../core/NumberSystem.js';
import { EnemySystem } from '../combat/EnemySystem.js';

export const FeedbackSystem = {
    init() {
        this.coreElement = document.getElementById('the-core');
        this.container = document.getElementById('core-container');

        EventBus.on("damage", (data) => this.spawnFloatingDamage(data));
        EventBus.on("damage", () => this.pulseCore());
        EventBus.on("comboChanged", (runState) => this.updateCoreVisualIntensity(runState.comboMultiplier));
    },

    pulseCore() {
        if (!this.coreElement) return;
        // Remove e adiciona classe para forçar re-trigger de animação CSS
        this.coreElement.classList.remove('pulse');
        void this.coreElement.offsetWidth; // trigger reflow
        this.coreElement.classList.add('pulse');
    },

    spawnFloatingDamage(data) {
        if (!this.container) return;
        
        const floatEl = document.createElement('div');
        floatEl.classList.add('floating-damage');
        floatEl.innerText = NumberSystem.formatNumber(data.amount);

        // Posição baseada no clique, relativizada ao contêiner
        const rect = this.container.getBoundingClientRect();
        const x = data.x - rect.left - 20; // offset centralização do texto
        const y = data.y - rect.top - 20;

        floatEl.style.left = `${x}px`;
        floatEl.style.top = `${y}px`;

        this.container.appendChild(floatEl);

        // Cleanup
        setTimeout(() => {
            floatEl.remove();
        }, 800); // 800ms deve combinar com a duração da animação em floatUp
    },

    updateCoreVisualIntensity(multiplier) {
        if (!this.coreElement) return;
        // Futuramente: muda brilho ou partículas baseado no multiplicador de combo
        const baseSize = 250;
        const glowSpread = 60 + (multiplier * 10);
        this.coreElement.style.boxShadow = `0 0 ${glowSpread}px var(--core-glow), inset 0 0 20px #000`;
    }

    init() {
        // ... manter events anteriores ...
        EventBus.on("breakTriggered", () => this.spawnBreakText());
        EventBus.on("stateUpdated", () => this.updateCoreStateClass());
    },
    
    updateCoreStateClass() {
        if (!this.coreElement) return;
        const enemy = EnemySystem.getActiveEnemy();
        if (!enemy) return;

        this.coreElement.className = ''; // limpa classes antigas

        if (enemy.state === "BREAKING") {
            this.coreElement.classList.add('breaking-state');
        } else if (enemy.state === "DEFEATED") {
            this.coreElement.classList.add('defeated-state');
        } else {
            // Aplica cor do inimigo no modo ACTIVE via CSS var
            this.coreElement.style.setProperty('--core-base', enemy.color);
        }
    },

    spawnBreakText() {
        if (!this.container) return;
        const text = document.createElement('div');
        text.classList.add('floating-break-text');
        text.innerText = "BREAK!";
        
        // Centralizado no CORE
        text.style.left = "50%"; text.style.top = "50%";
        text.style.transform = "translate(-50%, -50%)";
        
        this.container.appendChild(text);
        setTimeout(() => text.remove(), 1000);
    },

    spawnFloatingDamage(data) {
        if (!this.container) return;
        const floatEl = document.createElement('div');
        floatEl.classList.add('floating-damage');
        
        let prefix = "";
        if (data.state === "BREAKING") {
            floatEl.style.color = "#00ccff"; // Dano azul claro no break
            floatEl.style.transform = "scale(1.2)";
        } else if (data.isCrit) {
            floatEl.style.color = "#ffaa00";
            prefix = "Cr!t ";
        }
        
        floatEl.innerText = `${prefix}${NumberSystem.formatNumber(data.amount)}`;
};
