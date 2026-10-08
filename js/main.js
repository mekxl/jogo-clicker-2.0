import { SaveSystem } from './core/SaveSystem.js';
import { RunManager } from './core/RunManager.js';
import { DamageSystem } from './combat/DamageSystem.js';
import { FeedbackSystem } from './feedback/FeedbackSystem.js';
import { AudioSystem } from './feedback/AudioSystem.js';
import { UIManager } from './ui/UIManager.js';
import { UpgradeSystem } from './progression/UpgradeSystem.js';
import { RelicSystem } from './progression/RelicSystem.js'; 
import { ChallengeSystem } from './endgame/ChallengeSystem.js';
import { CodexSystem } from './endgame/CodexSystem.js';

FeedbackSystem.init();
AudioSystem.init();
UIManager.init();
UpgradeSystem.init();

// Inicializa Listeners Globais do Endgame ANTES do Save Load/Start
ChallengeSystem.init();
CodexSystem.init();

SaveSystem.load();

const coreElement = document.getElementById('the-core');
coreElement.addEventListener('pointerdown', (event) => {
    DamageSystem.processClickDamage({
        x: event.clientX,
        y: event.clientY
    });
});

const restartBtn = document.getElementById('btn-restart');
restartBtn.addEventListener('click', () => {
    RunManager.restartRun();
});

window.addEventListener('beforeunload', () => {
    SaveSystem.save();
});

RunManager.startRun();
