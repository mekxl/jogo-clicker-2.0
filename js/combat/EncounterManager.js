import { GameState } from '../core/GameState.js';
import { EventBus } from '../core/EventBus.js';
import { EnemySystem } from './EnemySystem.js';
import { ENEMIES } from '../data/enemies.js';
import { BOSSES } from '../data/bosses.js';
import { RelicSystem } from '../progression/RelicSystem.js';
import { EventSystem } from '../events/EventSystem.js';
import { MerchantSystem } from '../events/MerchantSystem.js';
import { RewardSystem } from '../progression/RewardSystem.js';
import { UpgradeSystem } from '../progression/UpgradeSystem.js';
import { RunManager } from '../core/RunManager.js';

export const EncounterManager = {
    initRun() {
        GameState.run.encounterIndex = 0;
        GameState.run.zoneIndex = 1;
        this.advanceNode();
    },

    advanceNode() {
        if (!GameState.run.isRunActive) return;
        GameState.run.isTransitioning = false; // Garante que o input destrave a cada novo nodo
        
        GameState.run.encounterIndex++;
        const node = GameState.run.encounterIndex;

        if (node > 0 && node % 10 === 0) {
            GameState.run.zoneIndex = Math.ceil(node / 10);
            EventBus.emit("encounterStarted", node);
            this.spawnBoss(GameState.run.zoneIndex);
            return;
        }

        EventBus.emit("encounterStarted", node);

        if (node % 5 === 0 && node % 10 !== 0) {
            MerchantSystem.triggerMerchant();
        } else if (node % 4 === 0) {
            EventSystem.triggerRandomEvent();
        } else {
            if (GameState.run.skipNextCombat) {
                GameState.run.skipNextCombat = false;
                setTimeout(() => this.advanceNode(), 500); 
            } else {
                this.spawnCombat();
            }
        }
    },

    spawnCombat() {
        const level = GameState.run.encounterIndex;
        const keys = Object.keys(ENEMIES);
        const enemyKey = keys[Math.floor(Math.random() * keys.length)];
        EnemySystem.initEnemy(ENEMIES[enemyKey], level, false);
    },

    spawnBoss(zone) {
        const level = GameState.run.encounterIndex;
        const keys = Object.keys(BOSSES);
        const bossIdx = Math.min(zone - 1, keys.length - 1);
        const bossKey = keys[bossIdx];
        EnemySystem.initEnemy(BOSSES[bossKey], level, true);
    },

    onEnemyDefeated(enemy) {
        GameState.run.combatCount++;
        GameState.run.isTransitioning = true; // Trava inputs imediatamente
        
        EventBus.emit("encounterCompleted", enemy);
        EventBus.emit("stateUpdated");
        
        setTimeout(() => {
            if (!GameState.run.isRunActive) return;
            GameState.run.isTransitioning = false; // Libera a trava
            
            if (enemy.type === "BOSS") {
                this.grantBossRewards(enemy);
            } else if (GameState.run.combatCount % 3 === 0) {
                RelicSystem.triggerRelicChoice();
            } else {
                this.advanceNode();
            }
        }, 1200); 
    },

    grantBossRewards(boss) {
        GameState.run.isPaused = true;
        GameState.meta.fragmentsOfVoid += boss.baseReward;

        const rew = boss.rewards;
        if (rew) {
            if (rew.relics > 0) {
                const rChoices = RelicSystem.generateChoices(rew.relics, rew.rarity);
                rChoices.forEach(c => RelicSystem.addRelic(c.id, true)); 
            }
            if (rew.upgrades > 0) {
                const uChoices = RewardSystem.generateChoices(rew.upgrades, rew.rarity);
                uChoices.forEach(c => UpgradeSystem.selectUpgrade(c.id, true));
            }
        }
        
        EventBus.emit("bossRewardsGranted", boss);
        
        setTimeout(() => {
            GameState.run.isPaused = false;
            if (boss.id === "boss_crimson") {
                RunManager.endRun(true); 
            } else {
                this.advanceNode();
            }
        }, 3000); 
    }
};

EventBus.on("relicApplied", () => {
    if(GameState.run.isRunActive && EnemySystem.getActiveEnemy()?.state === "DEFEATED" && EnemySystem.getActiveEnemy()?.type !== "BOSS") {
        EncounterManager.advanceNode();
    }
});

EventBus.on("eventResolved", () => {
    if(GameState.run.isRunActive) setTimeout(() => EncounterManager.advanceNode(), 800);
});

EventBus.on("merchantClosed", () => {
    if(GameState.run.isRunActive) setTimeout(() => EncounterManager.advanceNode(), 800);
});
