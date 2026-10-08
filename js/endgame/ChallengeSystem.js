import { GameState } from '../core/GameState.js';
import { EventBus } from '../core/EventBus.js';
import { CHALLENGES } from '../data/challenges.js';

export const ChallengeSystem = {
    init() {
        EventBus.on("enemyDefeated", (enemy) => {
            this.check("ch_first_blood");
            if (enemy.id === "boss_observer") this.check("ch_boss_slayer");
            if (enemy.id === "boss_void_construct") this.check("ch_void_walker");
        });

        EventBus.on("breakTriggered", () => {
            if (GameState.run.totalBreaks >= 10) this.check("ch_core_breaker");
        });

        EventBus.on("stateUpdated", () => {
            if (GameState.run.currentCombo >= 500) this.check("ch_combo_master");
            if (GameState.run.energy >= 5000) this.check("ch_hoarder");
            
            let totalAuto = 0;
            for(let key in GameState.run.automation.activeEntities) totalAuto += GameState.run.automation.activeEntities[key].count;
            if (totalAuto >= 10) this.check("ch_automation");

            let totalRelics = 0;
            for(let key in GameState.run.activeRelics) totalRelics += GameState.run.activeRelics[key];
            if (totalRelics >= 15) this.check("ch_relic_collector");

            if (GameState.meta.fragmentsOfVoid >= 10000) this.check("ch_rich");
        });

        EventBus.on("frenzyStarted", () => {
            GameState.run.frenzyActivations = (GameState.run.frenzyActivations || 0) + 1;
            if (GameState.run.frenzyActivations >= 5) this.check("ch_frenzy_lord");
        });

        EventBus.on("damage", (data) => {
            if (data.amount >= 1000000) this.check("ch_big_numbers");
        });

        EventBus.on("eventResolved", () => {
            GameState.meta.totalEventsResolved = (GameState.meta.totalEventsResolved || 0) + 1;
            if (GameState.meta.totalEventsResolved >= 10) this.check("ch_event_survivor");
        });

        EventBus.on("runVictory", () => {
            this.check("ch_crimson_fall");
            if (GameState.run.ascensionLevel >= 1) this.check("ch_ascension_1");
            if (GameState.run.merchantHealsUsed === 0) this.check("ch_untouchable"); // Z1+ intacto
        });
    },

    check(challengeId) {
        if (!GameState.meta.challenges[challengeId]) {
            GameState.meta.challenges[challengeId] = true;
            this.grantReward(challengeId);
            EventBus.emit("challengeCompleted", challengeId);
            EventBus.emit("metaUpdated");
        }
    },

    grantReward(challengeId) {
        const ch = CHALLENGES.find(c => c.id === challengeId);
        if (ch && ch.rewardFov > 0) {
            GameState.meta.fragmentsOfVoid += ch.rewardFov;
        }
    }
};
