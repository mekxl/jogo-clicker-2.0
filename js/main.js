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

FeedbackSystem.init();
AudioSystem.init();
UIManager.init();
UpgradeSystem.init();

ChallengeSystem.init();
CodexSystem.init();

SaveSystem.load();

const coreElement = document.getElementById('the-core');
const tutorial = document.getElementById('tutorial-text');

// Função extraída para suportar múltiplos bindings
const handleCoreClick = (event) => {
    // Previne comportamento padrão duplo em touch
    if (event.type === 'touchstart') event.preventDefault(); 
    
    // Suporta tanto toques de tela (touches[0]) quanto clique de mouse
    let x = event.clientX;
    let y = event.clientY;
    
    if (event.touches && event.touches.length > 0) {
        x = event.touches[0].clientX;
        y = event.touches[0].clientY;
    }

    DamageSystem.processClickDamage({ x, y });
};

coreElement.addEventListener('pointerdown', handleCoreClick);
coreElement.addEventListener('touchstart', handleCoreClick, { passive: false });

EventBus.on("damage", () => {
    if (tutorial && !tutorial.classList.contains('hidden')) {
        tutorial.classList.add('hidden');
    }
});

const restartBtn = document.getElementById('btn-restart');
restartBtn.addEventListener('click', () => {
    RunManager.restartRun();
});

window.addEventListener('beforeunload', () => {
    SaveSystem.save();
});

RunManager.startRun();
