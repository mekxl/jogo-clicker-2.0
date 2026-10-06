// ==========================================
// BANCOS DE DADOS GERAIS (Configurações)
// ==========================================
const MILESTONES = [50, 150, 300, 500, 800, 1200, 1700, 2500, 3500, 5000, 7500, 10000];

const META_DB = {
    dmg_inicial: { id: 'dmg_inicial', name: 'Dano Inicial', desc: '+1 Dano Base', baseCost: 10, costMult: 1.5 },
    reserva: { id: 'reserva', name: 'Reserva', desc: '+10 Energia Inicial', baseCost: 15, costMult: 1.6 },
    fortuna: { id: 'fortuna', name: 'Fortuna', desc: '+Chance Upgrades Raros', baseCost: 50, costMult: 2.0 },
    perseveranca: { id: 'perseveranca', name: 'Perseverança', desc: '+100ms Tempo de Combo', baseCost: 25, costMult: 1.8 }
};

const RARITY_WEIGHTS = { common: 100, uncommon: 50, rare: 20, epic: 5, legendary: 1 };

const UPGRADE_DB = [
    { id: 'mao_pesada', name: 'Mão Pesada', desc: '+2 Dano Base', rarity: 'common', maxStacks: 10, tags: ['CLICK'] },
    { id: 'bateria_simples', name: 'Bateria Simples', desc: '+1 Energia/Clique', rarity: 'common', maxStacks: 10, tags: ['ENERGY'] },
    { id: 'reflexo_rapido', name: 'Reflexo Rápido', desc: '+1 Acúmulo de Combo/Clique', rarity: 'common', maxStacks: 5, tags: ['COMBO'] },
    { id: 'foco_estavel', name: 'Foco Estável', desc: '+200ms Duração de Combo', rarity: 'common', maxStacks: 5, tags: ['COMBO'] },
    { id: 'sedenta', name: 'Sedenta', desc: '+25% Dano Final', rarity: 'uncommon', maxStacks: 10, tags: ['DAMAGE'] },
    { id: 'precisao', name: 'Precisão', desc: '+5% Chance Crítico (2x Dano)', rarity: 'uncommon', maxStacks: 10, tags: ['CRIT'] },
    { id: 'recarga_cinetica', name: 'Carga Cinética', desc: 'Energia aumenta multiplicador de dano (+1% / 100 EN)', rarity: 'uncommon', maxStacks: 5, tags: ['ENERGY', 'SYNERGY'] },
    { id: 'sobrecarga', name: 'Sobrecarga', desc: '+5 Dano Base, -10% Duração Combo', rarity: 'rare', maxStacks: 5, tags: ['RISK', 'DAMAGE'] },
    { id: 'golpe_duplo', name: 'Golpe Duplo', desc: '10% Chance de duplo clique', rarity: 'rare', maxStacks: 5, tags: ['CLICK'] },
    { id: 'ferocidade', name: 'Ferocidade', desc: '+30% Dano Crítico', rarity: 'rare', maxStacks: 10, tags: ['CRIT'] },
    { id: 'combo_visceral', name: 'Combo Visceral', desc: '+1% Dano para cada 10 de Combo atual', rarity: 'epic', maxStacks: 5, tags: ['COMBO', 'DAMAGE', 'SYNERGY'] },
    { id: 'ruptura', name: 'Ruptura', desc: '+100% Dano se HP do Alvo < 30%', rarity: 'epic', maxStacks: 3, tags: ['EXECUTE'] },
    { id: 'reator', name: 'Reator do Vazio', desc: '+5 Energia por Clique', rarity: 'epic', maxStacks: 5, tags: ['ENERGY'] },
    { id: 'anomalia', name: 'Anomalia Crítica', desc: 'Críticos geram 10x mais Combo', rarity: 'legendary', maxStacks: 1, tags: ['CRIT', 'COMBO'] },
    { id: 'onipresenca', name: 'Onipresença', desc: '20% chance de disparar 3 cliques simultâneos', rarity: 'legendary', maxStacks: 3, tags: ['CLICK'] }
];

const ENCOUNTER_SEQUENCE = ['fragmento', 'fragmento', 'parasita', 'colosso', 'fragmento', 'espelho', 'instavel', 'boss_observador'];

const ENEMY_DB = {
    'fragmento': { name: 'FRAGMENTO', hp: 50, breakMax: 200, reward: 2, energy: 1 },
    'parasita': { name: 'PARASITA', hp: 120, breakMax: 300, reward: 5, energy: 2 },
    'colosso': { name: 'COLOSSO', hp: 800, breakMax: 1000, reward: 15, energy: 5 },
    'espelho': { name: 'ESPELHO', hp: 200, breakMax: 500, reward: 8, energy: 3 },
    'instavel': { name: 'NÚCLEO INSTÁVEL', hp: 300, breakMax: 150, reward: 10, energy: 4 },
    'boss_observador': { name: 'O OBSERVADOR', hp: 3000, breakMax: 1500, reward: 100, energy: 20, isBoss: true }
};

// ==========================================
// STATES
// ==========================================
class MetaState {
    constructor() {
        this.fragments = 0;
        this.upgrades = { dmg_inicial: 0, reserva: 0, fortuna: 0, perseveranca: 0 };
    }
}

class RunState {
    constructor() {
        this.isRunActive = false;
        this.isPaused = false;
        
        // Atributos de Combate & Economia
        this.energy = 0;
        this.totalClicks = 0;
        this.currentCombo = 0;
        this.maxCombo = 0;
        this.milestoneIndex = 0;
        this.runUpgrades = {};
        this.pendingFragments = 0; 
        
        // Progressão da Run
        this.difficultyTier = 1;
        this.encounterIndex = 0;
        
        // Estatísticas para Fim de Run
        this.stats = {
            totalDamage: 0,
            highestDamageHit: 0,
            enemiesDefeated: 0,
            bossesDefeated: 0,
            totalBreaks: 0
        };
    }
}

class SaveSystem {
    static saveMeta(metaState) {
        localStorage.setItem('breakcore_meta', JSON.stringify(metaState));
    }
    static loadMeta() {
        const saved = localStorage.getItem('breakcore_meta');
        const state = new MetaState();
        if (saved) {
            const parsed = JSON.parse(saved);
            state.fragments = parsed.fragments || 0;
            state.upgrades = { ...state.upgrades, ...parsed.upgrades };
        }
        return state;
    }
}

// ==========================================
// SISTEMA DE COMBATE E INIMIGOS
// ==========================================
class Enemy {
    constructor(id, data, tier) {
        this.id = id;
        this.name = data.name;
        this.isBoss = data.isBoss || false;
        
        const scaleMult = Math.pow(1.3, tier - 1);
        this.maxHP = Math.floor(data.hp * scaleMult);
        this.currentHP = this.maxHP;
        
        this.breakMax = Math.floor(data.breakMax * scaleMult);
        this.breakCurrent = this.breakMax;
        
        this.baseReward = Math.floor(data.reward * (1 + ((tier - 1) * 0.5)));
        this.energyReward = data.energy;
        
        this.state = 'ACTIVE'; // SPAWNING, ACTIVE, BREAKING, DEFEATED
        this.breakTimeoutId = null;
    }

    onHit(runState, clickSystem) {
        if(this.state === 'DEFEATED') return;
        if (this.id === 'parasita' && Math.random() < 0.1) {
            clickSystem.combo.breakCombo();
        }
    }

    takeBreakDamage(amount, runState) {
        if (this.state !== 'ACTIVE') return;
        this.breakCurrent -= amount;
        if (this.breakCurrent <= 0) this.triggerBreak(runState);
    }

    triggerBreak(runState) {
        this.state = 'BREAKING';
        this.breakCurrent = 0;
        runState.stats.totalBreaks++;
        
        this.breakTimeoutId = setTimeout(() => {
            if (this.state === 'BREAKING') {
                this.state = 'ACTIVE';
                this.breakCurrent = this.breakMax;
            }
        }, 3000);
    }

    takeDamage(amount) {
        if (this.state === 'DEFEATED' || this.state === 'SPAWNING') return false;
        this.currentHP -= amount;
        if (this.currentHP <= 0) {
            this.currentHP = 0;
            this.die();
            return true;
        }
        return false;
    }

    die() {
        this.state = 'DEFEATED';
        if (this.breakTimeoutId) clearTimeout(this.breakTimeoutId);
    }
}

class Boss extends Enemy {
    constructor(id, data, tier) {
        super(id, data, tier);
        this.phase = 1;
    }

    takeDamage(amount) {
        const died = super.takeDamage(amount);
        if (!died && this.state !== 'DEFEATED') this.checkPhases();
        return died;
    }

    checkPhases() {
        const percent = this.currentHP / this.maxHP;
        if (this.phase === 1 && percent <= 0.66) this.changePhase(2);
        else if (this.phase === 2 && percent <= 0.33) this.changePhase(3);
    }

    changePhase(newPhase) {
        if (this.phase === newPhase) return; 
        this.phase = newPhase;
        this.state = 'ACTIVE';
        if (this.breakTimeoutId) clearTimeout(this.breakTimeoutId);
        this.breakCurrent = this.breakMax;
    }
}

class EncounterManager {
    constructor(runState, uiManager) {
        this.run = runState;
        this.ui = uiManager;
        this.currentEnemy = null;
    }

    startEncounter() {
        if (!this.run.isRunActive) return;

        const cycleIndex = this.run.encounterIndex % ENCOUNTER_SEQUENCE.length;
        const enemyId = ENCOUNTER_SEQUENCE[cycleIndex];
        const data = ENEMY_DB[enemyId];

        if (data.isBoss) {
            this.currentEnemy = new Boss(enemyId, data, this.run.difficultyTier);
        } else {
            this.currentEnemy = new Enemy(enemyId, data, this.run.difficultyTier);
        }

        this.currentEnemy.state = 'SPAWNING';
        this.ui.updateCombatHUD(this.currentEnemy, this.run);
        
        setTimeout(() => {
            if(!this.run.isRunActive || !this.currentEnemy) return;
            this.currentEnemy.state = 'ACTIVE';
            this.ui.updateCombatHUD(this.currentEnemy, this.run);
        }, 500);
    }

    onEnemyDefeated() {
        const enemy = this.currentEnemy;
        this.run.energy += enemy.energyReward;
        
        let finalReward = enemy.baseReward;
        if (enemy.id === 'instavel' && enemy.state === 'BREAKING') finalReward = Math.floor(finalReward * 2.5); 
        
        this.run.pendingFragments += finalReward;
        this.run.stats.enemiesDefeated++;
        
        if (enemy.isBoss) {
            this.run.stats.bossesDefeated++;
            this.run.difficultyTier++; 
        }

        this.run.encounterIndex++;
        
        setTimeout(() => {
            if(this.run.isRunActive) this.startEncounter();
        }, 600);
    }
}

// ==========================================
// SISTEMA DE STATUS E UPGRADES
// ==========================================
class StatSystem {
    static getEffectiveStats(run, meta) {
        let stats = {
            baseDamage: 1 + (meta.upgrades.dmg_inicial * 1),
            damageMult: 1.0,
            critChance: 0.0,
            critDamage: 2.0,
            energyPerClick: 1,
            comboPerClick: 1,
            comboTimeout: 2000 + (meta.upgrades.perseveranca * 100),
            doubleClickChance: 0.0,
            tripleClickChance: 0.0,
            comboCritSynergy: false
        };

        const u = run.runUpgrades;
        const level = (id) => u[id] || 0;

        stats.baseDamage += level('mao_pesada') * 2;
        stats.baseDamage += level('sobrecarga') * 5;
        stats.damageMult += level('sedenta') * 0.25;
        
        stats.energyPerClick += level('bateria_simples') * 1;
        stats.energyPerClick += level('reator') * 5;
        
        stats.comboPerClick += level('reflexo_rapido') * 1;
        stats.comboTimeout += level('foco_estavel') * 200;
        stats.comboTimeout *= Math.pow(0.9, level('sobrecarga'));

        stats.critChance += level('precisao') * 0.05;
        stats.critDamage += level('ferocidade') * 0.30;
        stats.doubleClickChance += level('golpe_duplo') * 0.10;
        stats.tripleClickChance += level('onipresenca') * 0.20;

        if (level('anomalia') > 0) stats.comboCritSynergy = true;

        if (level('recarga_cinetica') > 0) stats.damageMult += (Math.floor(run.energy / 100) * 0.01) * level('recarga_cinetica');
        if (level('combo_visceral') > 0) stats.damageMult += Math.floor(run.currentCombo / 10) * 0.01 * level('combo_visceral');
        
        // Multiplicador do Combo Base
        let comboBaseMult = 1;
        if (run.currentCombo >= 50) comboBaseMult = 4;
        else if (run.currentCombo >= 25) comboBaseMult = 3;
        else if (run.currentCombo >= 10) comboBaseMult = 2;
        
        stats.damageMult *= comboBaseMult;

        return stats;
    }
}

class UpgradeSystem {
    constructor(runState, metaState, uiManager) {
        this.run = runState;
        this.meta = metaState;
        this.ui = uiManager;
    }

    triggerMilestoneSelection() {
        this.run.isPaused = true;
        
        let availablePool = UPGRADE_DB.filter(up => {
            const currentLevel = this.run.runUpgrades[up.id] || 0;
            return currentLevel < up.maxStacks;
        });

        const choices = [];
        for(let i=0; i<3; i++) {
            if(availablePool.length === 0) break;
            
            const rarity = this.rollRarity();
            let poolByRarity = availablePool.filter(up => up.rarity === rarity);
            if(poolByRarity.length === 0) poolByRarity = availablePool; 

            const randomIndex = Math.floor(Math.random() * poolByRarity.length);
            const selected = poolByRarity[randomIndex];
            
            choices.push(selected);
            availablePool = availablePool.filter(up => up.id !== selected.id);
        }

        this.ui.showUpgradeSelection(choices, (chosenId) => this.acquireUpgrade(chosenId));
    }

    rollRarity() {
        const bonus = this.meta.upgrades.fortuna * 5;
        const weights = {
            common: RARITY_WEIGHTS.common,
            uncommon: RARITY_WEIGHTS.uncommon + bonus,
            rare: RARITY_WEIGHTS.rare + (bonus * 0.8),
            epic: RARITY_WEIGHTS.epic + (bonus * 0.5),
            legendary: RARITY_WEIGHTS.legendary + (bonus * 0.2)
        };
        const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
        let random = Math.random() * totalWeight;

        for (const [rarity, weight] of Object.entries(weights)) {
            if (random < weight) return rarity;
            random -= weight;
        }
        return 'common';
    }

    acquireUpgrade(id) {
        if(!this.run.runUpgrades[id]) this.run.runUpgrades[id] = 0;
        this.run.runUpgrades[id]++;
        
        this.run.isPaused = false;
        this.ui.hideUpgradeSelection();
        this.ui.updateHUD(this.run, this.meta);
    }
}

// ==========================================
// CORE LOGIC SYSTEMS (Click e Combo)
// ==========================================
class ComboSystem {
    constructor(runState, uiManager) {
        this.run = runState;
        this.ui = uiManager;
        this.timeoutId = null;
    }

    registerCombo(stats, isCrit) {
        let gain = stats.comboPerClick;
        if (isCrit && stats.comboCritSynergy) gain *= 10;
        
        this.run.currentCombo += gain;
        if (this.run.currentCombo > this.run.maxCombo) this.run.maxCombo = this.run.currentCombo;
        this.resetTimer(stats.comboTimeout);
    }

    resetTimer(limitMs) {
        if (this.timeoutId) clearTimeout(this.timeoutId);
        this.timeoutId = setTimeout(() => this.breakCombo(), limitMs);
    }

    breakCombo() {
        if (!this.run.isRunActive || this.run.isPaused) return;
        this.run.currentCombo = 0;
        this.ui.updateHUD(this.run);
    }
}

class ClickSystem {
    constructor(runState, metaState, upgradeSystem, comboSystem, uiManager, encounterManager) {
        this.run = runState;
        this.meta = metaState;
        this.upgrades = upgradeSystem;
        this.combo = comboSystem;
        this.ui = uiManager;
        this.encounter = encounterManager;
    }

    processPhysicalClick(x, y) {
        if (!this.run.isRunActive || this.run.isPaused) return;

        const stats = StatSystem.getEffectiveStats(this.run, this.meta);
        
        let clicksToProcess = 1;
        if (Math.random() < stats.tripleClickChance) clicksToProcess = 3;
        else if (Math.random() < stats.doubleClickChance) clicksToProcess = 2;

        for(let i=0; i<clicksToProcess; i++) {
            this.executeLogicClick(stats, x, y, i > 0);
        }

        if (this.run.totalClicks >= MILESTONES[this.run.milestoneIndex]) {
            this.run.milestoneIndex++;
            this.upgrades.triggerMilestoneSelection();
        }

        this.ui.updateHUD(this.run, this.meta);
        this.ui.updateCombatHUD(this.encounter.currentEnemy, this.run);
    }

    executeLogicClick(stats, x, y, isEcho) {
        const enemy = this.encounter.currentEnemy;
        if (!enemy || enemy.state === 'DEFEATED' || enemy.state === 'SPAWNING') return;

        this.run.totalClicks++;
        
        let finalMult = stats.damageMult;
        
        // Multiplicadores Dinâmicos de Condição de HP
        const levelRuptura = this.run.runUpgrades['ruptura'] || 0;
        if (levelRuptura > 0 && (enemy.currentHP / enemy.maxHP) < 0.3) {
            finalMult += 1.0 * levelRuptura;
        }

        if (enemy.state === 'BREAKING') finalMult *= 2; 

        let finalDmg = stats.baseDamage * finalMult;
        let isCrit = Math.random() < stats.critChance;
        if (isCrit) finalDmg *= stats.critDamage;
        finalDmg = Math.floor(finalDmg);

        if (finalDmg > this.run.stats.highestDamageHit) this.run.stats.highestDamageHit = finalDmg;
        this.run.stats.totalDamage += finalDmg;

        enemy.onHit(this.run, this);

        const died = enemy.takeDamage(finalDmg);
        
        const breakDamage = 15; 
        if (!died) enemy.takeBreakDamage(breakDamage, this.run);

        this.run.energy += stats.energyPerClick;
        this.combo.registerCombo(stats, isCrit);

        const offset = isEcho ? 30 : 0; 
        this.ui.spawnFloatingNumber(finalDmg, x + offset, y + offset, isCrit);

        if (died) {
            this.encounter.onEnemyDefeated();
        }
    }
}

// ==========================================
// RUN MANAGER (Fluxo Central)
// ==========================================
class RunManager {
    constructor(runState, metaState, uiManager, encounterManager) {
        this.run = runState;
        this.meta = metaState;
        this.ui = uiManager;
        this.encounter = encounterManager;
    }

    startRun() {
        this.run.isRunActive = true;
        this.run.isPaused = false;
        this.run.energy = this.meta.upgrades.reserva * 10;
        this.run.totalClicks = 0;
        this.run.currentCombo = 0;
        this.run.maxCombo = 0;
        this.run.milestoneIndex = 0;
        this.run.runUpgrades = {};
        this.run.pendingFragments = 0;
        this.run.encounterIndex = 0;
        this.run.difficultyTier = 1;
        this.run.stats = { totalDamage: 0, highestDamageHit: 0, enemiesDefeated: 0, bossesDefeated: 0, totalBreaks: 0 };
        
        this.ui.hideModals();
        this.ui.updateHUD(this.run, this.meta);
        
        // Inicia o primeiro combate!
        this.encounter.startEncounter();
    }

    endRun() {
        this.run.isRunActive = false;
        this.run.isPaused = true;
        
        // Aplica fragmentos pendentes ao banco meta
        this.meta.fragments += this.run.pendingFragments;
        SaveSystem.saveMeta(this.meta);

        this.ui.showGameOver(this.run);
    }
}

// ==========================================
// UI MANAGER
// ==========================================
class UIManager {
    constructor() {
        this.els = {
            energy: document.getElementById('ui-energy'),
            combo: document.getElementById('ui-combo'),
            comboMult: document.getElementById('ui-combo-mult'),
            damage: document.getElementById('ui-damage'),
            clicks: document.getElementById('ui-clicks'),
            fragments: document.getElementById('ui-fragments'),
            coreContainer: document.getElementById('core-container')
        };
    }

    updateHUD(run, meta) {
        if(!meta) return;
        const stats = StatSystem.getEffectiveStats(run, meta);
        
        document.getElementById('ui-stage').innerText = `${run.difficultyTier}-${(run.encounterIndex % ENCOUNTER_SEQUENCE.length) + 1}`;
        this.els.energy.innerText = run.energy;
        this.els.combo.innerText = run.currentCombo;
        this.els.clicks.innerText = run.totalClicks;
        this.els.fragments.innerText = meta.fragments + run.pendingFragments;
        
        this.els.damage.innerText = Math.floor(stats.baseDamage * stats.damageMult); 
        this.els.comboMult.innerText = (stats.damageMult).toFixed(1);
    }

    updateCombatHUD(enemy, run) {
        if(!enemy) return;
        
        document.getElementById('enemy-name').innerText = enemy.name;
        document.getElementById('ui-hp').innerText = enemy.currentHP > 1000 ? (enemy.currentHP/1000).toFixed(1)+'k' : enemy.currentHP;
        document.getElementById('ui-max-hp').innerText = enemy.maxHP > 1000 ? (enemy.maxHP/1000).toFixed(1)+'k' : enemy.maxHP;
        document.getElementById('hp-bar-fill').style.width = `${Math.max(0, (enemy.currentHP / enemy.maxHP) * 100)}%`;

        document.getElementById('ui-break').innerText = enemy.breakCurrent;
        document.getElementById('ui-max-break').innerText = enemy.breakMax;
        document.getElementById('break-bar-fill').style.width = `${Math.max(0, (enemy.breakCurrent / enemy.breakMax) * 100)}%`;

        const btn = document.getElementById('core-button');
        const breakStatus = document.getElementById('break-status');
        const bossPhase = document.getElementById('boss-phase-container');

        if (enemy.state === 'BREAKING') {
            btn.classList.add('core-breaking');
            breakStatus.classList.remove('hidden');
        } else {
            btn.classList.remove('core-breaking');
            breakStatus.classList.add('hidden');
        }

        if (enemy.isBoss) {
            btn.classList.add('core-boss');
            bossPhase.classList.remove('hidden');
            document.getElementById('ui-boss-phase').innerText = enemy.phase;
            if(enemy.state === 'SPAWNING') btn.style.animation = 'bossSpawn 0.5s ease-out';
        } else {
            btn.classList.remove('core-boss');
            bossPhase.classList.add('hidden');
            btn.style.animation = '';
        }
    }

    spawnFloatingNumber(amount, x, y, isCrit) {
        const floatEl = document.createElement('div');
        floatEl.classList.add('floating-number');
        if(isCrit) {
            floatEl.style.color = '#ffeb3b';
            floatEl.style.fontSize = '26px';
            amount = amount + "!";
        }
        floatEl.innerText = `-${amount}`;
        
        floatEl.style.left = `${x + (Math.random() - 0.5) * 40}px`;
        floatEl.style.top = `${y + (Math.random() - 0.5) * 40}px`;

        this.els.coreContainer.appendChild(floatEl);
        floatEl.addEventListener('animationend', () => floatEl.remove());
    }

    hideModals() {
        document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
    }

    showUpgradeSelection(choices, onSelectCallback) {
        const container = document.getElementById('upgrade-cards-container');
        container.innerHTML = '';
        
        choices.forEach(up => {
            const card = document.createElement('div');
            card.className = `upgrade-card ${up.rarity}`;
            card.innerHTML = `
                <div class="up-title">${up.name}</div>
                <div class="up-rarity">${up.rarity}</div>
                <div class="up-desc">${up.desc}</div>
                <div class="up-tags">${up.tags.join(' | ')}</div>
            `;
            card.onclick = () => onSelectCallback(up.id);
            container.appendChild(card);
        });
        document.getElementById('upgrade-modal').classList.remove('hidden');
    }

    showGameOver(run) {
        document.getElementById('sum-enemies').innerText = run.stats.enemiesDefeated;
        document.getElementById('sum-bosses').innerText = run.stats.bossesDefeated;
        document.getElementById('sum-high-dmg').innerText = run.stats.highestDamageHit;
        document.getElementById('sum-damage').innerText = run.stats.totalDamage;
        document.getElementById('sum-combo').innerText = run.maxCombo;
        document.getElementById('sum-fragments').innerText = run.pendingFragments;
        document.getElementById('game-over-modal').classList.remove('hidden');
    }

    showMetaScreen(metaState, buyCallback) {
        this.hideModals();
        document.getElementById('meta-fragments-display').innerText = metaState.fragments;
        
        const container = document.getElementById('meta-upgrades-container');
        container.innerHTML = '';

        Object.values(META_DB).forEach(up => {
            const level = metaState.upgrades[up.id] || 0;
            const cost = Math.floor(up.baseCost * Math.pow(up.costMult, level));
            const canAfford = metaState.fragments >= cost;

            const div = document.createElement('div');
            div.className = 'meta-item';
            div.innerHTML = `
                <div>
                    <div><strong>${up.name} (Nv ${level})</strong></div>
                    <div style="font-size:12px; color:#aaa">${up.desc}</div>
                </div>
                <button class="meta-btn" ${canAfford ? '' : 'disabled'}>Custa: ${cost}</button>
            `;
            
            if(canAfford) {
                div.querySelector('button').onclick = () => buyCallback(up.id, cost);
            }
            container.appendChild(div);
        });

        document.getElementById('meta-modal').classList.remove('hidden');
    }
}

// ==========================================
// BOOTSTRAP / INICIALIZAÇÃO
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const metaState = SaveSystem.loadMeta();
    const runState = new RunState();
    
    const ui = new UIManager();
    const comboSys = new ComboSystem(runState, ui);
    const upgradeSys = new UpgradeSystem(runState, metaState, ui);
    const encounterManager = new EncounterManager(runState, ui);
    const runManager = new RunManager(runState, metaState, ui, encounterManager);
    
    // Injeção de todos os sistemas centralizados para o processador de cliques
    const clickSys = new ClickSystem(runState, metaState, upgradeSys, comboSys, ui, encounterManager);

    // Controles HUD
    const coreBtn = document.getElementById('core-button');
    coreBtn.addEventListener('mousedown', (e) => clickSys.processPhysicalClick(e.clientX, e.clientY));
    
    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && runState.isRunActive && !runState.isPaused) {
            e.preventDefault();
            coreBtn.style.transform = 'scale(0.95)';
            coreBtn.style.backgroundColor = 'rgba(255, 42, 75, 0.2)';
            setTimeout(() => { coreBtn.style.transform = ''; coreBtn.style.backgroundColor = 'transparent'; }, 50);
            
            const rect = coreBtn.getBoundingClientRect();
            clickSys.processPhysicalClick(rect.left + rect.width / 2, rect.top + rect.height / 2);
        }
    });

    document.getElementById('extract-button').addEventListener('click', () => {
        if(runState.isRunActive && !runState.isPaused) runManager.endRun();
    });

    document.getElementById('to-meta-button').addEventListener('click', () => {
        const renderMeta = () => {
            ui.showMetaScreen(metaState, (id, cost) => {
                metaState.fragments -= cost;
                metaState.upgrades[id]++;
                SaveSystem.saveMeta(metaState);
                renderMeta(); 
            });
        };
        renderMeta();
    });

    document.getElementById('restart-button').addEventListener('click', () => runManager.startRun());

    // Inicia a primeira vez na tela de Meta
    document.getElementById('to-meta-button').click();
});
