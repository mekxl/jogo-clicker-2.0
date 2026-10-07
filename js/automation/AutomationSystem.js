import { GameState } from '../core/GameState.js';
import { DamageSystem } from '../combat/DamageSystem.js';
import { AUTOMATION_ENTITIES } from '../data/automation.js';
import { EventBus } from '../core/EventBus.js';
import { FrenzySystem } from '../feedback/FrenzySystem.js';

export const AutomationSystem = {
    timer: null,
    lastTick: 0,

    start() {
        if (this.timer) cancelAnimationFrame(this.timer);
        this.lastTick = performance.now();
        this.tick = this.tick.bind(this);
        this.timer = requestAnimationFrame(this.tick);
    },

    stop() {
        if (this.timer) {
            cancelAnimationFrame(this.timer);
            this.timer = null;
        }
    },

    tick(now) {
        if (!GameState.run.isRunActive || GameState.run.isPaused) {
            this.lastTick = now;
            this.timer = requestAnimationFrame(this.tick);
            return;
        }

        const delta = now - this.lastTick;
        this.lastTick = now;

        const activeBots = GameState.run.automation.activeEntities;
        const autoSpeedMult = GameState.run.stats.autoSpeedMult || 1.0;

        for (const [id, instance] of Object.entries(activeBots)) {
            instance.timer += delta;
            
            const effectiveInterval = instance.baseInterval / autoSpeedMult;

            if (instance.timer >= effectiveInterval) {
                // Mantém o resto para não perder precisão rítmica em framerates baixos
                instance.timer -= effectiveInterval; 
                this.fireEntity(id, instance);
            }
        }

        this.timer = requestAnimationFrame(this.tick);
    },

    grantAutomation(id, amount = 1) {
        const data = AUTOMATION_ENTITIES[id];
        if (!data) return;

        if (!GameState.run.automation.activeEntities[id]) {
            GameState.run.automation.activeEntities[id] = {
                id: id,
                name: data.name,
                baseDamage: data.baseDamage,
                baseInterval: data.intervalMs,
                timer: 0,
                count: 0,
                special: data.special
            };
        }
        GameState.run.automation.activeEntities[id].count += amount;
        EventBus.emit("automationUpdated");
    },

    fireEntity(id, instance) {
        if (instance.special === "FRENZY_CHARGE") {
            FrenzySystem.addFrenzy(5 * instance.count);
        } else if (instance.baseDamage > 0) {
            const totalBaseDmg = instance.baseDamage * instance.count;
            DamageSystem.processAutoDamage(totalBaseDmg, id);
        }
    }
};
