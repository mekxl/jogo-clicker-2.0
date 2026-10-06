export const GameState = {
    meta: {
        totalClicks: 0,
        highestDamageHit: 0,
        enemiesDefeated: 0,
        bossesDefeated: 0,
        fragmentsOfVoid: 0,
        metaUpgrades: {
            startingDamage: 0, // níveis comprados
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
            isPaused: false, // Usado durante escolhas de upgrade
            currentHP: 0,
            maxHP: 0,
            energy: 0,
            totalClicks: 0,
            currentCombo: 0,
            maxCombo: 0,
            comboMultiplier: 1,
            totalDamage: 0,
            
            // Novos sistemas de progressão
            activeUpgrades: {}, // { id: count }
            milestoneIndex: 0,
            
            // Atributos finais calculados
            stats: {
                damagePerClick: 1,
                energyPerClick: 1,
                critChance: 0.0,
                critMultiplier: 1.5,
                comboEffectiveness: 1.0,
                globalMultiplier: 1.0,
                fovBonus: 1.0
            }
        };
    }
};
