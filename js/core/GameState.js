export const GameState = {
    meta: {
        totalClicks: 0,
        highestDamageHit: 0,
        enemiesDefeated: 0,
        bossesDefeated: 0,
        fragmentsOfVoid: 0,
        metaUpgrades: {
            startingDamage: 0,
            energyReserve: 0,
            luck: 0,
            knowledge: 0,
            resistance: 0
        }
    },
    run: {},

    resetRunState() {
        this.run = {
            isRunActive: false,
            isPaused: false,
            currentHP: 0,
            maxHP: 0,
            energy: 0,
            totalClicks: 0,
            currentCombo: 0,
            maxCombo: 0,
            comboMultiplier: 1,
            totalDamage: 0,
            
            encounterIndex: 0, // Qual Node/Room estamos
            combatCount: 0,    // Quantos inimigos de fato matamos
            enemiesDefeated: 0,
            totalBreaks: 0,
            
            eventState: "NONE", // NONE, ACTIVE, RESOLVING
            merchantState: "NONE",
            merchantRerolls: 0,
            skipNextCombat: false, // Efeito de eventos
            
            activeUpgrades: {},
            activeRelics: {}, 
            activeSynergies: [], 
            milestoneIndex: 0,
            
            // Modificadores extras vindos de eventos que sobrevivem na run
            eventModifiers: {
                baseDamage: 0,
                comboEffectiveness: 0,
                energyPerClick: 0
            },
            
            stats: {
                damagePerClick: 1,
                energyPerClick: 1,
                critChance: 0.0,
                critMultiplier: 1.5,
                comboEffectiveness: 1.0,
                globalMultiplier: 1.0,
                fovBonus: 1.0,
                breakDamage: 1,
                breakMultiplier: 1.5,
                breakDurationMs: 3000,
                comboGlobalMod: 0,
                comboCritBonus: 0,
                comboEnergyBonus: 0,
                critEnergyBonus: 0,
                breakAutoCrit: 0,
                luckBonus: 0
            }
        };
    }
};
