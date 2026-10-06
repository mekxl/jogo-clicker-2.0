import { SaveSystem } from './core/SaveSystem.js';
import { RunManager } from './core/RunManager.js';
import { DamageSystem } from './combat/DamageSystem.js';
import { FeedbackSystem } from './feedback/FeedbackSystem.js';
import { UIManager } from './ui/UIManager.js';
import { UpgradeSystem } from './progression/UpgradeSystem.js';
import { RelicSystem } from './progression/RelicSystem.js'; 
import { EventSystem } from './events/EventSystem.js'; // Garantindo carga da instância (mesmo que EventBus cuide do resto)

FeedbackSystem.init();
UIManager.init();
UpgradeSystem.init();

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
