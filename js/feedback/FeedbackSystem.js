import { EventBus } from '../core/EventBus.js';
import { NumberSystem } from '../core/NumberSystem.js';

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
};
