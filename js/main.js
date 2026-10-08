import { SaveSystem } from './core/SaveSystem.js';
import { RunManager } from './core/RunManager.js';
import { DamageSystem } from './combat/DamageSystem.js';
import { FeedbackSystem } from './feedback/FeedbackSystem.js';
import { AudioSystem } from './feedback/AudioSystem.js';
import { UIManager } from './ui/UIManager.js';
import { UpgradeSystem } from './progression/UpgradeSystem.js';
import { ChallengeSystem } from './endgame/ChallengeSystem.js';
import { CodexSystem } from './endgame/CodexSystem.js';
import { EventBus } from './core/EventBus.js';

try {
    FeedbackSystem.init();
    AudioSystem.init();
    UIManager.init();
    UpgradeSystem.init();

    ChallengeSystem.init();
    CodexSystem.init();

    SaveSystem.load();
} catch (e) {
    console.error("Erro na inicialização dos sistemas:", e);
}

const coreElement = document.getElementById('the-core');
const tutorial = document.getElementById('tutorial-text');

const handleCoreClick = (event) => {
    if (event.type === 'touchstart') event.preventDefault(); 
    
    let x = event.clientX || 0;
    let y = event.clientY || 0;
    
    if (event.touches && event.touches.length > 0) {
        x = event.touches[0].clientX;
        y = event.touches[0].clientY;
    }

    DamageSystem.processClickDamage({ x, y });
};

if (coreElement) {
    coreElement.addEventListener('pointerdown', handleCoreClick);
    coreElement.addEventListener('touchstart', handleCoreClick, { passive: false });
}

EventBus.on("damage", () => {
    if (tutorial && !tutorial.classList.contains('hidden')) {
        tutorial.classList.add('hidden');
    }
});

const restartBtn = document.getElementById('btn-restart');
if (restartBtn) {
    restartBtn.addEventListener('click', () => {
        RunManager.restartRun();
    });
}

window.addEventListener('beforeunload', () => {
    SaveSystem.save();
});

try {
    RunManager.startRun();
} catch (e) {
    console.error("FATAL ERROR ON START RUN:", e);
    if(tutorial) tutorial.innerText = "ERRO CRÍTICO NO CONSOLE. VERIFIQUE SEUS ARQUIVOS.";
}
