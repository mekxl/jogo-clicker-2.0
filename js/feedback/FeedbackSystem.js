import { EventBus } from '../core/EventBus.js';
import { NumberSystem } from '../core/NumberSystem.js';
import { GameState } from '../core/GameState.js';
import { EnemySystem } from '../combat/EnemySystem.js';

export const FeedbackSystem = {
    damageTextPool: [],
    particlePool: [],

    init() {
        this.coreElement = document.getElementById('the-core');
        this.container = document.getElementById('core-container');
        this.body = document.body;

        for(let i=0; i < 30; i++) {
            let el = document.createElement('div');
            el.className = 'floating-damage hidden';
            this.container.appendChild(el);
            this.damageTextPool.push({el: el, active: false});
        }
        for(let i=0; i < 50; i++) {
            let p = document.createElement('div');
            p.className = 'particle hidden';
            this.container.appendChild(p);
            this.particlePool.push({el: p, active: false});
        }

        EventBus.on("damage", (data) => {
            this.spawnFloatingDamage(data);
            if(data.source === 'click') {
                this.pulseCore();
                if(data.isCrit) this.shakeScreen('low');
                this.spawnParticles(data.isCrit ? 5 : 1, data.state === "BREAKING" ? "#00ccff" : (data.isCrit ? "#ffaa00" : "#ff1a1a"));
            }
        });

        EventBus.on("breakTriggered", () => {
            this.spawnTextPop("BREAK!", "#00ccff");
            this.shakeScreen('high');
            this.spawnParticles(15, "#00ccff");
        });

        EventBus.on("enemyDefeated", (enemy) => {
            if (enemy.type === "BOSS") this.shakeScreen('extreme');
            else this.shakeScreen('medium');
            this.spawnParticles(enemy.type === "BOSS" ? 40 : 10, "#ffffff");
        });

        EventBus.on("frenzyStarted", () => {
            this.shakeScreen('extreme');
            this.spawnParticles(30, "#ff00ff");
        });

        EventBus.on("bossPhaseChanged", (data) => {
            this.spawnTextPop(`PHASE ${data.boss.currentPhaseIndex + 1}`, "#ff0000");
            this.shakeScreen('extreme');
            this.spawnParticles(20, "#ff0000");
            this.updateCoreStateClass(); // força estilo da fase
        });

        EventBus.on("stateUpdated", () => this.updateCoreStateClass());
    },

    getPoolItem(pool) {
        let item = pool.find(i => !i.active);
        if(!item) {
            item = pool[0];
            clearTimeout(item.timeout);
        }
        item.active = true;
        item.el.classList.remove('hidden');
        return item;
    },

    freePoolItem(item) {
        item.active = false;
        item.el.classList.add('hidden');
        item.el.className = item.el.className.split(' ')[0] + ' hidden'; 
    },

    shakeScreen(intensity) {
        if (!GameState.meta.settings.screenShakeEnabled) return;
        this.body.classList.remove('shake-low', 'shake-medium', 'shake-high', 'shake-extreme');
        void this.body.offsetWidth; 
        this.body.classList.add(`shake-${intensity}`);
        setTimeout(() => this.body.classList.remove(`shake-${intensity}`), 300);
    },

    pulseCore() {
        if (!this.coreElement) return;
        this.coreElement.classList.remove('pulse');
        void this.coreElement.offsetWidth; 
        this.coreElement.classList.add('pulse');
    },

    updateCoreStateClass() {
        if (!this.coreElement) return;
        const enemy = EnemySystem.getActiveEnemy();
        const frenzy = GameState.run.frenzy?.isActive;
        
        this.coreElement.className = ''; 

        if (enemy && enemy.state === "DEFEATED") {
            this.coreElement.classList.add('defeated-state');
            this.coreElement.style.filter = '';
        } else if (frenzy) {
            this.coreElement.classList.add('frenzy-state');
        } else if (enemy && enemy.state === "BREAKING") {
            this.coreElement.classList.add('breaking-state');
        } else if (enemy) {
            this.coreElement.style.setProperty('--core-base', enemy.color);
            
            // Aplica filtro de Boss Phase se houver
            if (enemy.type === "BOSS" && enemy.phases[enemy.currentPhaseIndex]) {
                const p = enemy.phases[enemy.currentPhaseIndex];
                if (p.bgMod) this.coreElement.style.filter = p.bgMod;
                this.coreElement.style.transform = `scale(${enemy.scale || 1.5})`;
            } else {
                this.coreElement.style.filter = 'none';
                this.coreElement.style.transform = 'scale(1)';
            }
        }
    },

    spawnParticles(amount, color) {
        if (!GameState.meta.settings.particlesEnabled || !this.container) return;
        for(let i=0; i<amount; i++) {
            const pInfo = this.getPoolItem(this.particlePool);
            const el = pInfo.el;
            el.style.background = color;
            const angle = Math.random() * Math.PI * 2;
            const distance = 50 + Math.random() * 100;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            el.style.setProperty('--tx', `${tx}px`);
            el.style.setProperty('--ty', `${ty}px`);
            el.classList.add('animate-particle');
            pInfo.timeout = setTimeout(() => this.freePoolItem(pInfo), 600);
        }
    },

    spawnTextPop(textStr, color) {
        if (!this.container) return;
        const text = document.createElement('div');
        text.classList.add('floating-break-text');
        text.innerText = textStr;
        text.style.color = color;
        text.style.textShadow = `0 0 20px ${color}`;
        text.style.left = "50%"; text.style.top = "50%";
        text.style.transform = "translate(-50%, -50%)";
        this.container.appendChild(text);
        setTimeout(() => text.remove(), 1000);
    },

    spawnFloatingDamage(data) {
        if (!this.container) return;
        const item = this.getPoolItem(this.damageTextPool);
        const floatEl = item.el;
        floatEl.classList.add('floating-damage');
        
        let prefix = "";
        floatEl.style.color = "#fff";
        floatEl.style.transform = "scale(1)";

        if (data.source === 'auto') {
            floatEl.style.color = "#888";
            floatEl.style.fontSize = "0.9rem";
        } else {
            floatEl.style.fontSize = "1.5rem";
            if (data.state === "BREAKING") {
                floatEl.style.color = "#00ccff"; 
                floatEl.style.transform = "scale(1.2)";
            } else if (data.isCrit) {
                floatEl.style.color = "#ffaa00";
                prefix = "Cr!t ";
            }
        }
        
        floatEl.innerText = `${prefix}${NumberSystem.formatNumber(data.amount)}`;

        if (data.x && data.y) {
            const rect = this.container.getBoundingClientRect();
            floatEl.style.left = `${data.x - rect.left - 20}px`;
            floatEl.style.top = `${data.y - rect.top - 20}px`;
        } else {
            floatEl.style.left = `${100 + Math.random() * 100}px`;
            floatEl.style.top = `${100 + Math.random() * 100}px`;
        }

        floatEl.classList.add('float-up-anim');
        item.timeout = setTimeout(() => this.freePoolItem(item), 800);
    }
};
