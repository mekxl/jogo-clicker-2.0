// script.js

// ==========================================
// 1. CONFIGURAÇÕES BASE
// ==========================================
const Config = {
    baseTargetHP: 100,
    baseDamage: 1,
    comboTimeoutMs: 1200
};

// ==========================================
// 2. ESTADO PRINCIPAL DA RUN
// ==========================================
const GameState = {
    isRunActive: false,
    currentHP: 0,
    maxHP: 0,
    damagePerClick: 0,
    energy: 0,
    totalClicks: 0,
    currentCombo: 0,
    maxCombo: 0,
    comboMultiplier: 1,
    comboTimer: null
};

// ==========================================
// 3. SISTEMAS DE LÓGICA (MODULARES)
// ==========================================

const CurrencySystem = {
    addEnergy(amount) {
        GameState.energy += amount;
    },
    getEnergy() {
        return GameState.energy;
    },
    spendEnergy(amount) {
        if (GameState.energy >= amount) {
            GameState.energy -= amount;
            return true;
        }
        return false;
    }
};

const ComboSystem = {
    registerClick() {
        GameState.currentCombo++;
        if (GameState.currentCombo > GameState.maxCombo) {
            GameState.maxCombo = GameState.currentCombo;
        }
        this.updateMultiplier();
        this.resetTimer();
    },
    updateMultiplier() {
        const combo = GameState.currentCombo;
        if (combo >= 50) GameState.comboMultiplier = 4;
        else if (combo >= 25) GameState.comboMultiplier = 3;
        else if (combo >= 10) GameState.comboMultiplier = 2;
        else GameState.comboMultiplier = 1;
    },
    resetTimer() {
        clearTimeout(GameState.comboTimer);
        GameState.comboTimer = setTimeout(() => {
            this.breakCombo();
        }, Config.comboTimeoutMs);
    },
    breakCombo() {
        GameState.currentCombo = 0;
        this.updateMultiplier();
        UIManager.updateAll();
    }
};

const DamageSystem = {
    calculateClickDamage() {
        // Arquitetura preparada para receber buffs, críticos e relíquias no futuro
        let finalDamage = GameState.damagePerClick * GameState.comboMultiplier;
        return finalDamage;
    }
};

const TargetSystem = {
    takeDamage(amount) {
        GameState.currentHP -= amount;
        if (GameState.currentHP <= 0) {
            GameState.currentHP = 0;
            this.die();
        }
    },
    die() {
        RunManager.endRun();
    }
};

// ==========================================
// 4. SISTEMAS DE INTERFACE E FEEDBACK
// ==========================================

const FeedbackSystem = {
    triggerClickFeedback(x, y, damageAmount) {
        // Efeito visual no CORE
        const core = document.getElementById('core');
        core.classList.remove('core-hit');
        void core.offsetWidth; // Força o reflow do DOM para reiniciar a animação
        core.classList.add('core-hit');

        this.spawnFloatingNumber(x, y, damageAmount);
    },
    spawnFloatingNumber(x, y, amount) {
        const layer = document.getElementById('floating-layer');
        const el = document.createElement('div');
        el.className = 'floating-number';
        el.innerText = amount;
        
        // Offset aleatório para os números não sobreporem perfeitamente
        const offsetX = (Math.random() - 0.5) * 40;
        const offsetY = (Math.random() - 0.5) * 20;
        
        el.style.left = `${x + offsetX}px`;
        el.style.top = `${y + offsetY}px`;
        
        layer.appendChild(el);
        
        // Limpeza de memória do DOM
        setTimeout(() => {
            el.remove();
        }, 600);
    }
};

const UIManager = {
    updateAll() {
        document.getElementById('ui-energy').innerText = GameState.energy;
        document.getElementById('ui-clicks').innerText = GameState.totalClicks;
        document.getElementById('ui-damage').innerText = DamageSystem.calculateClickDamage();
        
        document.getElementById('ui-combo').innerText = GameState.currentCombo;
        document.getElementById('ui-multiplier').innerText = `x${GameState.comboMultiplier}`;
        
        document.getElementById('ui-current-hp').innerText = GameState.currentHP;
        document.getElementById('ui-max-hp').innerText = GameState.maxHP;
        
        const hpPercent = (GameState.currentHP / GameState.maxHP) * 100;
        document.getElementById('hp-bar-fill').style.width = `${hpPercent}%`;
    },
    showGameOver() {
        document.getElementById('end-clicks').innerText = GameState.totalClicks;
        document.getElementById('end-combo').innerText = GameState.maxCombo;
        document.getElementById('game-over-screen').classList.remove('hidden');
    },
    hideGameOver() {
        document.getElementById('game-over-screen').classList.add('hidden');
    }
};

// ==========================================
// 5. SISTEMA DE CLIQUE E PIPELINE
// ==========================================

const ClickSystem = {
    processClick(x, y) {
        if (!GameState.isRunActive) return;

        // 1. Registro
        GameState.totalClicks++;

        // 2. Cálculo
        const damage = DamageSystem.calculateClickDamage();

        // 3. Aplicação
        TargetSystem.takeDamage(damage);

        // 4. Recursos e Combo
        CurrencySystem.addEnergy(1);
        ComboSystem.registerClick();

        // 5. Feedback e Atualização
        FeedbackSystem.triggerClickFeedback(x, y, damage);
        UIManager.updateAll();
    }
};

// ==========================================
// 6. GERENCIADOR DE RUN
// ==========================================

const RunManager = {
    startRun() {
        // Reset do Estado da Run (Progresso Temporário)
        GameState.maxHP = Config.baseTargetHP;
        GameState.currentHP = GameState.maxHP;
        GameState.damagePerClick = Config.baseDamage;
        GameState.energy = 0;
        GameState.totalClicks = 0;
        GameState.currentCombo = 0;
        GameState.maxCombo = 0;
        GameState.comboMultiplier = 1;
        clearTimeout(GameState.comboTimer);

        GameState.isRunActive = true;
        
        UIManager.hideGameOver();
        UIManager.updateAll();
    },
    endRun() {
        GameState.isRunActive = false;
        clearTimeout(GameState.comboTimer);
        UIManager.showGameOver();
    },
    restartRun() {
        this.startRun();
    }
};

// ==========================================
// 7. CONTROLES E INICIALIZAÇÃO
// ==========================================

const coreElement = document.getElementById('core');
coreElement.addEventListener('mousedown', (e) => {
    ClickSystem.processClick(e.clientX, e.clientY);
});

// Suporte para barra de espaço (Opcional, mas útil)
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && GameState.isRunActive) {
        const rect = coreElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        ClickSystem.processClick(centerX, centerY);
        
        // Evita rolagem da página
        e.preventDefault();
    }
});

document.getElementById('btn-restart').addEventListener('click', () => {
    RunManager.restartRun();
});

// Inicia o jogo
RunManager.startRun();
