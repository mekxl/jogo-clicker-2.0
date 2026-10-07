import { GameState } from '../core/GameState.js';
import { EventBus } from '../core/EventBus.js';

export const AudioSystem = {
    ctx: null,
    
    init() {
        // Inicializa o contexto de áudio procedural na primeira interação (Exigência dos navegadores)
        const unlockAudio = () => {
            if (!this.ctx) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                this.ctx = new AudioContext();
            }
            if(this.ctx.state === 'suspended') this.ctx.resume();
            document.removeEventListener('pointerdown', unlockAudio);
        };
        document.addEventListener('pointerdown', unlockAudio);

        EventBus.on("damage", (data) => {
            if (data.source === 'auto') return; // Preserva performance evitando spam de drones
            if (data.isCrit) this.playSound('crit');
            else this.playSound('click');
        });
        EventBus.on("breakTriggered", () => this.playSound('break'));
        EventBus.on("frenzyStarted", () => this.playSound('frenzy'));
        EventBus.on("encounterCompleted", () => this.playSound('reward'));
    },

    playSound(type) {
        if (!this.ctx || !GameState.meta.settings.sfxEnabled) return;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        const vol = GameState.meta.settings.sfxVolume || 0.5;
        const now = this.ctx.currentTime;

        if (type === 'click') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
            gain.gain.setValueAtTime(vol * 0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
        } 
        else if (type === 'crit') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(1500, now + 0.1);
            gain.gain.setValueAtTime(vol * 0.4, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
        } 
        else if (type === 'break') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.exponentialRampToValueAtTime(30, now + 0.4);
            gain.gain.setValueAtTime(vol * 0.8, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
            osc.start(now);
            osc.stop(now + 0.4);
        } 
        else if (type === 'frenzy') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.linearRampToValueAtTime(2000, now + 0.6);
            gain.gain.setValueAtTime(vol * 0.8, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.6);
            osc.start(now);
            osc.stop(now + 0.6);
        }
        else if (type === 'reward') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.setValueAtTime(800, now + 0.1);
            gain.gain.setValueAtTime(vol * 0.5, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        }
    }
};
