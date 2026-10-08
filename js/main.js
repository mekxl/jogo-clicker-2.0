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

coreElement.addEventListener('pointerdown', (event) => {
    DamageSystem.processClickDamage({
        x: event.clientX,
        y: event.clientY
    });
});

// Remove a instrução visual no primeiro dano efetivo, polindo o onboarding
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
