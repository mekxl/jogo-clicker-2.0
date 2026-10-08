export const GameState = {
    meta: {
        totalClicks: 0, highestDamageHit: 0, enemiesDefeated: 0, bossesDefeated: 0, totalBossDamage: 0, fragmentsOfVoid: 0,
        runsPlayed: 0, runsWon: 0, highestAscensionUnlocked: 0, currentAscensionSelection: 0, totalEventsResolved: 0,
        metaUpgrades: { startingDamage: 0, energyReserve: 0, luck: 0, knowledge: 0, resistance: 0 },
        settings: { particlesEnabled: true, screenShakeEnabled: true, sfxEnabled: true, sfxVolume: 0.5 },
        challenges: {},
        codex: { enemies: {}, relics: {}, upgrades: {}, events: {} }
    },
    run: {},

    resetRunState() {
        this.run = {
            isRunActive: false,
            isPaused: false,
            isTransitioning: false, // BLOQUEIO DE INPUTS ANTI-CLIQUE ACIDENTAL
            currentHP: 0, maxHP: 0, energy: 0, totalClicks: 0, currentCombo: 0, maxCombo: 0, comboMultiplier: 1, totalDamage: 0,
            encounterIndex: 0, zoneIndex: 1, combatCount: 0, enemiesDefeated: 0, bossesDefeated: 0, totalBreaks: 0, merchantHealsUsed: 0, frenzyActivations: 0,
            ascensionLevel: this.meta.currentAscensionSelection || 0,
            eventState: "NONE", merchantState: "NONE", merchantRerolls: 0, skipNextCombat: false,
            activeUpgrades: {}, activeRelics: {}, activeSynergies: [], milestoneIndex: 0,
            frenzy: { isActive: false, meter: 0 },
            automation: { activeEntities: {} },
            eventModifiers: { baseDamage: 0, comboEffectiveness: 0, energyPerClick: 0 },
            stats: {
                damagePerClick: 1, energyPerClick: 1, critChance: 0.0, critMultiplier: 1.5,
                comboEffectiveness: 1.0, globalMultiplier: 1.0, fovBonus: 1.0, breakDamage: 1, breakMultiplier: 1.5, breakDurationMs: 3000,
                comboGlobalMod: 0, comboCritBonus: 0, comboEnergyBonus: 0, critEnergyBonus: 0, breakAutoCrit: 0, luckBonus: 0,
                autoSpeedMult: 1.0, autoDamageMult: 1.0, frenzyMultiplierBonus: 2.0, frenzyDurationMs: 5000
            }
        };
    }
};
