import { SaveSystem } from './core/SaveSystem.js';
import { RunManager } from './core/RunManager.js';
import { DamageSystem } from './combat/DamageSystem.js';
import { FeedbackSystem } from './feedback/FeedbackSystem.js';
import { UIManager } from './ui/UIManager.js';

// Inicialização das cascas de visual/UI
FeedbackSystem.init();
UIManager.init();

// Carrega persistência inicial (se houver)
SaveSystem.load();

// Mapeamento de DOM Events para o Sistema Lógico
const coreElement = document.getElementById('the-core');
coreElement.addEventListener('pointerdown', (event) => {
    // A UI não calcula nada. Apenas capta a intenção do jogador.
    DamageSystem.processClickDamage({
        x: event.clientX,
        y: event.clientY
    });
});

const restartBtn = document.getElementById('btn-restart');
restartBtn.addEventListener('click', () => {
    RunManager.restartRun();
});

// Salvar meta-progresso periodicamente (básico)
window.addEventListener('beforeunload', () => {
    SaveSystem.save();
});

// Boot inicial
RunManager.startRun();
