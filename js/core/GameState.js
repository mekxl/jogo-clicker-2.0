export const GameState = {
    meta: {
        totalClicks: 0,
        highestDamageHit: 0,
        enemiesDefeated: 0,
        bossesDefeated: 0
    },
    run: {},

    resetRunState() {
        this.run = {
            isRunActive: false,
            currentHP: 0,
            maxHP: 0,
            damagePerClick: 1,
            energy: 0,
            totalClicks: 0,
            currentCombo: 0,
            maxCombo: 0,
            comboMultiplier: 1,
            totalDamage: 0
        };
    }
};
