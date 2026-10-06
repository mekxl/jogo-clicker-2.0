// DATA-ONLY: Definição de Eventos Narrativos e suas Escolhas (Risco/Recompensa)
export const EVENTS = [
    {
        id: "ev_pact", name: "BLOOD PACT", type: "PACT",
        description: "A crimson anomaly pulses before you. It demands vitality in exchange for raw power.",
        choices: [
            { id: "c1", label: "Accept the Pact", description: "Lose 20% of Current HP. Gain an Epic Upgrade.", effects: { hpPercent: -0.2, grantUpgradeRarity: "EPIC" } },
            { id: "c2", label: "Decline", description: "Leave safely.", effects: {} }
        ]
    },
    {
        id: "ev_void", name: "THE VOID STARES BACK", type: "VOID",
        description: "A tear in reality reveals the primordial void. You can reach inside, but the void will take its toll.",
        choices: [
            { id: "c1", label: "Reach Inside", description: "Take heavy damage. Gain Fragments of Void.", effects: { hpPercent: -0.5, fov: 50 } },
            { id: "c2", label: "Look Away", description: "Avoid the gaze. Gain 10 Energy.", effects: { energy: 10 } }
        ]
    },
    {
        id: "ev_mirror", name: "SHATTERED MIRROR", type: "MIRROR",
        description: "A floating mirror reflects a distorted version of your core. It beckons you to touch it.",
        choices: [
            {
                id: "c1", label: "Touch the Glass", description: "50% chance to gain a Relic. 50% chance to lose 50 Energy.",
                risk: { probability: 0.5, successEffects: { randomRelic: 1 }, failureEffects: { energy: -50 } }
            },
            { id: "c2", label: "Shatter It", description: "Gain +5 Base Damage permanently for this run.", effects: { runBaseDamage: 5 } }
        ]
    },
    {
        id: "ev_offer", name: "UNHOLY OFFERING", type: "OFFER",
        description: "An altar of code awaits a tribute.",
        choices: [
            { id: "c1", label: "Offer Energy", description: "Pay 100 Energy. Gain a Rare Upgrade.", requirements: { energy: 100 }, effects: { energy: -100, grantUpgradeRarity: "RARE" } },
            { id: "c2", label: "Ignore", description: "Do nothing.", effects: {} }
        ]
    },
    {
        id: "ev_sacrifice", name: "ALTAR OF SACRIFICE", type: "SACRIFICE",
        description: "The machine requires a piece of your build to grant you ultimate momentum.",
        choices: [
            { id: "c1", label: "Sacrifice a Relic", description: "Lose a random Relic. Gain 200 Energy.", requirements: { minRelics: 1 }, effects: { loseRandomRelic: 1, energy: 200 } },
            { id: "c2", label: "Keep your build", description: "Walk away.", effects: {} }
        ]
    },
    {
        id: "ev_rift", name: "DIMENSIONAL RIFT", type: "RIFT",
        description: "A shortcut through the void. It feels unstable.",
        choices: [
            { id: "c1", label: "Enter Rift", description: "Skip the next combat node. Gain 50 Energy.", effects: { skipNextCombat: 1, energy: 50 } },
            { id: "c2", label: "Stay on Path", description: "Gain 5 Max HP.", effects: { maxHp: 5, heal: 5 } }
        ]
    },
    {
        id: "ev_memory", name: "ECHO OF A MEMORY", type: "MEMORY",
        description: "A faint hologram plays a record of a past run.",
        choices: [
            { id: "c1", label: "Download Data", description: "Gain 2 Common Upgrades.", effects: { grantUpgradeRarity: "COMMON", repeatUpgrade: 2 } },
            { id: "c2", label: "Corrupt Data", description: "Convert into 25 Fragments of Void.", effects: { fov: 25 } }
        ]
    },
    {
        id: "ev_entity", name: "WANDERING ENTITY", type: "ENTITY",
        description: "A neutral entity floats by, carrying a strange artifact.",
        choices: [
            { id: "c1", label: "Attack It", description: "70% chance to gain an Epic Relic. 30% chance to lose 80% HP.", risk: { probability: 0.7, successEffects: { randomRelicRarity: "EPIC" }, failureEffects: { hpPercent: -0.8 } } },
            { id: "c2", label: "Trade Energy", description: "Pay 50 Energy for a Common Relic.", requirements: { energy: 50 }, effects: { energy: -50, randomRelic: 1 } }
        ]
    },
    {
        id: "ev_contract", name: "BINDING CONTRACT", type: "CONTRACT",
        description: "A digital scroll appears. 'Sign away your safety for exponential growth.'",
        choices: [
            { id: "c1", label: "Sign", description: "HP reduced to 1. Gain +500 Energy and a Legendary Upgrade.", effects: { setHp: 1, energy: 500, grantUpgradeRarity: "LEGENDARY" } },
            { id: "c2", label: "Burn it", description: "Gain 20 Energy.", effects: { energy: 20 } }
        ]
    },
    {
        id: "ev_shrine", name: "SHRINE OF RESTORATION", type: "SHRINE",
        description: "A quiet, safe zone in the chaos.",
        choices: [
            { id: "c1", label: "Rest", description: "Restore 50% of your Max HP.", effects: { healPercent: 0.5 } },
            { id: "c2", label: "Dismantle Shrine", description: "Destroy it for 100 Energy, but take 10% HP damage.", effects: { energy: 100, hpPercent: -0.1 } }
        ]
    },
    {
        id: "ev_gamble", name: "HIGH STAKES", type: "GAMBLE",
        description: "A spinning terminal waits for your input.",
        choices: [
            { id: "c1", label: "Roll the Dice", description: "50% chance to double Energy. 50% chance to lose all Energy.", risk: { probability: 0.5, successEffects: { energyMult: 2.0 }, failureEffects: { energyMult: 0.0 } } },
            { id: "c2", label: "Leave", description: "Walk away.", effects: {} }
        ]
    },
    {
        id: "ev_glitch", name: "SYSTEM GLITCH", type: "GLITCH",
        description: "The matrix around you is breaking down. Code bleeds into reality.",
        choices: [
            { id: "c1", label: "Absorb Code", description: "Gain 3 random Upgrades.", effects: { grantRandomUpgrade: 3 } },
            { id: "c2", label: "Purge", description: "Heal to full HP.", effects: { healPercent: 1.0 } }
        ]
    },
    {
        id: "ev_echo", name: "RESONATING CHAMBER", type: "ECHO",
        description: "The walls echo with the sound of your clicks.",
        choices: [
            { id: "c1", label: "Amplify", description: "+0.5x Combo Effectiveness.", effects: { runComboBonus: 0.5 } },
            { id: "c2", label: "Absorb", description: "+1 Energy per Click.", effects: { runEnergyPerClick: 1 } }
        ]
    },
    {
        id: "ev_cache", name: "ABANDONED CACHE", type: "CACHE",
        description: "A forgotten supply drop from a previous runner.",
        choices: [
            { id: "c1", label: "Open Gently", description: "Gain 75 Energy.", effects: { energy: 75 } },
            { id: "c2", label: "Pry Open", description: "80% chance to gain a Relic. 20% it explodes (lose 30% HP).", risk: { probability: 0.8, successEffects: { randomRelic: 1 }, failureEffects: { hpPercent: -0.3 } } }
        ]
    },
    {
        id: "ev_parasite", name: "PARASITE NEST", type: "NEST",
        description: "A cluster of dormant parasites clinging to a node.",
        choices: [
            { id: "c1", label: "Burn them", description: "Take 10% HP damage, gain an Epic Upgrade.", effects: { hpPercent: -0.1, grantUpgradeRarity: "EPIC" } },
            { id: "c2", label: "Harvest", description: "Gain 150 Energy. No damage taken.", effects: { energy: 150 } }
        ]
    }
];
