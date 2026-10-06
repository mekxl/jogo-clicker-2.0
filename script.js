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

// Definição dos 15 Upgrades de Run (Efeitos interpretados pelo StatSystem)
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

// ==========================================
// STATES (Separação estrita)
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
        
        // Atributos mutáveis
        this.currentHP = 0;
        this.maxHP = 1000000;
        this.energy = 0;
        
        // Controle de progressão da run
        this.totalClicks = 0;
        this.damageDealt = 0;
        this.currentCombo = 0;
        this.maxCombo = 0;
        this.milestoneIndex = 0;
        
        // Upgrades da Run atual { id: level }
        this.runUpgrades = {};
    }
}

// ==========================================
// SAVE SYSTEM
// ==========================================
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
// STAT SYSTEM (Motor de Cálculo Centralizado)
// ==========================================
class StatSystem {
    // Avalia o estado Meta + Run para cuspir os status reais daquele clique
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

        // Aplicação dos efeitos (Matemática pura, sem lógica de UI)
        stats.baseDamage += level('mao_pesada') * 2;
        stats.baseDamage += level('sobrecarga') * 5;
        stats.damageMult += level('sedenta') * 0.25;
        
        stats.energyPerClick += level('bateria_simples') * 1;
        stats.energyPerClick += level('reator') * 5;
        
        stats.comboPerClick += level('reflexo_rapido') * 1;
        stats.comboTimeout += level('foco_estavel') * 200;
        stats.comboTimeout *= Math.pow(0.9, level('sobrecarga')); // Perde 10% cumulativo

        stats.critChance += level('precisao') * 0.05;
        stats.critDamage += level('ferocidade') * 0.30;
        stats.doubleClickChance += level('golpe_duplo') * 0.10;
        stats.tripleClickChance += level('onipresenca') * 0.20;

        if (level('anomalia') > 0) stats.comboCritSynergy = true;

        // Multiplicadores Dinâmicos de Condição
        if (level('recarga_cinetica') > 0) {
            stats.damageMult += (Math.floor(run.energy / 100) * 0.01) * level('recarga_cinetica');
        }
        if (level('combo_visceral') > 0) {
            stats.damageMult += Math.floor(run.currentCombo / 10) * 0.01 * level('combo_visceral');
        }
        if (level('ruptura') > 0 && (run.currentHP / run.maxHP) < 0.3) {
            stats.damageMult += 1.0 * level('ruptura');
        }

        // Multiplicador do Combo Base (Step 1 mantido)
        let comboBaseMult = 1;
        if (run.currentCombo >= 50) comboBaseMult = 4;
        else if (run.currentCombo >= 25) comboBaseMult = 3;
        else if (run.currentCombo >= 10) comboBaseMult = 2;
        
        stats.damageMult *= comboBaseMult;

        return stats;
    }
}

// ==========================================
// UPGRADE SYSTEM (Sorteio e Lógica de Cartas)
// ==========================================
class UpgradeSystem {
    constructor(runState, metaState, uiManager) {
        this.run = runState;
        this.meta = metaState;
        this.ui = uiManager;
    }

    triggerMilestoneSelection() {
        this.run.isPaused = true;
        
        // Filtra upgrades que ainda não chegaram no maxStacks
        let availablePool = UPGRADE_DB.filter(up => {
            const currentLevel = this.run.runUpgrades[up.id] || 0;
            return currentLevel < up.maxStacks;
        });

        const choices = [];
        for(let i=0; i<3; i++) {
            if(availablePool.length === 0) break;
            
            // Sorteia raridade afetada pelo MetaUpgrade "Fortuna"
            const rarity = this.rollRarity();
            let poolByRarity = availablePool.filter(up => up.rarity === rarity);
            
            // Fallback se não tiver upgrade dessa raridade
            if(poolByRarity.length === 0) poolByRarity = availablePool; 

            const randomIndex = Math.floor(Math.random() * poolByRarity.length);
            const selected = poolByRarity[randomIndex];
            
            choices.push(selected);
            availablePool = availablePool.filter(up => up.id !== selected.id); // Remove da pool para não repetir
        }

        this.ui.showUpgradeSelection(choices, (chosenId) => this.acquireUpgrade(chosenId));
    }

    rollRarity() {
        const bonus = this.meta.upgrades.fortuna * 5; // Aumenta peso das raras
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
// CORE LOGIC SYSTEMS (Click, Combo, Damage)
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
        if (!this.run.isRunActive || this.run.isPaused) return; // Congela se pausado
        this.run.currentCombo = 0;
        this.ui.updateHUD(this.run);
    }
}

class ClickSystem {
    constructor(runState, metaState, upgradeSystem, comboSystem, uiManager) {
        this.run = runState;
        this.meta = metaState;
        this.upgrades = upgradeSystem;
        this.combo = comboSystem;
        this.ui = uiManager;
    }

    processPhysicalClick(x, y) {
        if (!this.run.isRunActive || this.run.isPaused) return;

        const stats = StatSystem.getEffectiveStats(this.run, this.meta);
        
        // Verifica triggers de múltiplos cliques
        let clicksToProcess = 1;
        if (Math.random() < stats.tripleClickChance) clicksToProcess = 3;
        else if (Math.random() < stats.doubleClickChance) clicksToProcess = 2;

        for(let i=0; i<clicksToProcess; i++) {
            this.executeLogicClick(stats, x, y, i > 0);
        }

        // Checagem de Milestones
        if (this.run.totalClicks >= MILESTONES[this.run.milestoneIndex]) {
            this.run.milestoneIndex++;
            this.upgrades.triggerMilestoneSelection();
        }

        this.ui.updateHUD(this.run, this.meta);
    }

    executeLogicClick(stats, x, y, isEcho) {
        this.run.totalClicks++;
        
        // Cálculo de Dano com Critico
        let finalDmg = stats.baseDamage * stats.damageMult;
        let isCrit = Math.random() < stats.critChance;
        if (isCrit) finalDmg *= stats.critDamage;
        
        finalDmg = Math.floor(finalDmg);

        // Aplica
        this.run.currentHP -= finalDmg;
        this.run.damageDealt += finalDmg;
        this.run.energy += stats.energyPerClick;
        this.combo.registerCombo(stats, isCrit);

        // Feedback
        const offset = isEcho ? 30 : 0; // Desloca visualmente ecos
        this.ui.spawnFloatingNumber(finalDmg, x + offset, y + offset, isCrit);

        if (this.run.currentHP <= 0) {
            this.run.currentHP = 0;
            document.dispatchEvent(new Event('targetDied')); // Desacoplado
        }
    }
}

// ==========================================
// RUN MANAGER (Fragmentos e Controle de Ciclo)
// ==========================================
class RunManager {
    constructor(runState, metaState, uiManager) {
        this.run = runState;
        this.meta = metaState;
        this.ui = uiManager;
    }

    startRun() {
        this.run.isRunActive = true;
        this.run.isPaused = false;
        this.run.currentHP = this.run.maxHP;
        this.run.energy = this.meta.upgrades.reserva * 10;
        this.run.totalClicks = 0;
        this.run.damageDealt = 0;
        this.run.currentCombo = 0;
        this.run.maxCombo = 0;
        this.run.milestoneIndex = 0;
        this.run.runUpgrades = {};
        
        this.ui.hideModals();
        this.ui.updateHUD(this.run, this.meta);
    }

    endRun() {
        this.run.isRunActive = false;
        this.run.isPaused = true;
        
        // Cálculo de Fragmentos (Equilíbrio de recompensa)
        const fragBase = Math.floor(this.run.damageDealt / 1000);
        const fragCombo = Math.floor(this.run.maxCombo / 5);
        const fragMilestone = this.run.milestoneIndex * 50;
        const totalEarned = fragBase + fragCombo + fragMilestone;

        this.meta.fragments += totalEarned;
        SaveSystem.saveMeta(this.meta);

        this.ui.showGameOver(this.run, totalEarned);
    }
}

// ==========================================
// UI MANAGER
// ==========================================
class UIManager {
    constructor() {
        this.els = {
            hp: document.getElementById('ui-hp'),
            energy: document.getElementById('ui-energy'),
            combo: document.getElementById('ui-combo'),
            comboMult: document.getElementById('ui-combo-mult'),
            damage: document.getElementById('ui-damage'),
            clicks: document.getElementById('ui-clicks'),
            fragments: document.getElementById('ui-fragments'),
            hpBarFill: document.getElementById('hp-bar-fill'),
            coreContainer: document.getElementById('core-container')
        };
    }

    updateHUD(run, meta) {
        if(!meta) return;
        const stats = StatSystem.getEffectiveStats(run, meta);
        
        this.els.hp.innerText = run.currentHP > 1000 ? (run.currentHP/1000).toFixed(1)+'k' : run.currentHP;
        this.els.energy.innerText = run.energy;
        this.els.combo.innerText = run.currentCombo;
        this.els.clicks.innerText = run.totalClicks;
        this.els.fragments.innerText = meta.fragments;
        
        // Mostra o dano normal projetado no HUD
        this.els.damage.innerText = Math.floor(stats.baseDamage * stats.damageMult); 
        this.els.comboMult.innerText = (stats.damageMult).toFixed(1);

        const hpPercent = (run.currentHP / run.maxHP) * 100;
        this.els.hpBarFill.style.width = `${Math.max(0, hpPercent)}%`;
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

    // -- Telas --
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

    showGameOver(run, fragmentsEarned) {
        document.getElementById('sum-clicks').innerText = run.totalClicks;
        document.getElementById('sum-damage').innerText = run.damageDealt;
        document.getElementById('sum-combo').innerText = run.maxCombo;
        document.getElementById('sum-upgrades').innerText = Object.keys(run.runUpgrades).length;
        document.getElementById('sum-fragments').innerText = fragmentsEarned;
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
                <button class="meta-btn" ${canAfford ? '' : 'disabled'}>
                    Custa: ${cost}
                </button>
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
    const clickSys = new ClickSystem(runState, metaState, upgradeSys, comboSys, ui);
    const runManager = new RunManager(runState, metaState, ui);

    // Controles HUD
    const coreBtn = document.getElementById('core-button');
    coreBtn.addEventListener('mousedown', (e) => clickSys.processPhysicalClick(e.clientX, e.clientY));
    
    // Suporte a espaço
    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && runState.isRunActive && !runState.isPaused) {
            e.preventDefault();
            coreBtn.style.transform = 'scale(0.95)';
            coreBtn.style.backgroundColor = 'rgba(255, 42, 75, 0.2)';
            setTimeout(() => { coreBtn.style.transform = ''; coreBtn.style.backgroundColor = 'transparent'; }, 50);
            clickSys.processPhysicalClick(window.innerWidth/2, window.innerHeight/2 + 50);
        }
    });

    // Eventos de Sistema
    document.addEventListener('targetDied', () => runManager.endRun());
    document.getElementById('extract-button').addEventListener('click', () => {
        if(runState.isRunActive && !runState.isPaused) runManager.endRun();
    });

    document.getElementById('to-meta-button').addEventListener('click', () => {
        const renderMeta = () => {
            ui.showMetaScreen(metaState, (id, cost) => {
                metaState.fragments -= cost;
                metaState.upgrades[id]++;
                SaveSystem.saveMeta(metaState);
                renderMeta(); // Re-renderiza para atualizar botões e custos
            });
        };
        renderMeta();
    });

    document.getElementById('restart-button').addEventListener('click', () => runManager.startRun());

    // Inicia a primeira vez na tela de Meta (Hub inicial)
    document.getElementById('to-meta-button').click();
});
