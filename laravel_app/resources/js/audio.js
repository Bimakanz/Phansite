// Persona 5 Sound Effects & Audio Engine for Laravel Inertia/React

const SFX_FILES = {
    hover: '/assets/audio/sfx/hover.mp3',
    click: '/assets/audio/sfx/click.mp3',
    select: '/assets/audio/sfx/select.mp3',
    tab: '/assets/audio/sfx/tab_slash.mp3',
    'vote-yes': '/assets/audio/sfx/important_click.mp3',
    'vote-no': '/assets/audio/sfx/click.mp3',
    message: '/assets/audio/sfx/notification.mp3',
    target: '/assets/audio/sfx/level_upgrade.mp3',
    important: '/assets/audio/sfx/important_click.mp3',
    switch: '/assets/audio/sfx/switch.mp3',
};

class P5AudioEngine {
    constructor() {
        this.ctx = null;
        this.buffers = {};
        this.loading = false;
        this.sfxVolume = 0.75;
        this.lastHoverTime = 0;
        this.initialized = false;
    }

    initContext() {
        if (!this.ctx && typeof window !== 'undefined') {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume().catch(() => {});
        }
        if (this.ctx && !this.loading && Object.keys(this.buffers).length === 0) {
            this.preloadBuffers();
        }
    }

    async preloadBuffers() {
        if (!this.ctx || this.loading) return;
        this.loading = true;

        for (const [key, url] of Object.entries(SFX_FILES)) {
            try {
                const res = await fetch(url);
                if (!res.ok) continue;
                const arr = await res.arrayBuffer();
                this.ctx.decodeAudioData(
                    arr,
                    (decoded) => {
                        this.buffers[key] = decoded;
                    },
                    () => {}
                );
            } catch {
                // Ignore fetch errors in non-browser or offline
            }
        }
    }

    playSfx(type) {
        try {
            this.initContext();
            const key = SFX_FILES[type] ? type : 'click';
            const url = SFX_FILES[key];
            if (!url) return;

            let vol = this.sfxVolume;
            if (type === 'hover') vol *= 0.45;
            else if (type === 'click') vol *= 0.75;
            else if (type === 'select') vol *= 0.85;
            else if (type === 'tab') vol *= 0.85;
            else if (type === 'vote-yes' || type === 'important') vol *= 1.0;
            else if (type === 'target') vol *= 0.9;
            else if (type === 'message') vol *= 0.8;

            // 1. Web Audio API with pre-decoded buffer (Zero latency)
            if (this.ctx && this.buffers[key]) {
                const source = this.ctx.createBufferSource();
                source.buffer = this.buffers[key];
                const gain = this.ctx.createGain();
                gain.gain.setValueAtTime(vol, this.ctx.currentTime);
                source.connect(gain);
                gain.connect(this.ctx.destination);
                source.start(0);
                return;
            }

            // 2. Fallback using Audio element
            const audio = new Audio(url);
            audio.volume = Math.max(0, Math.min(1, vol));
            const p = audio.play();
            if (p !== undefined) {
                p.catch(() => {});
            }
        } catch {
            // Audio policy or device error
        }
    }

    playRadioStatic() {
        try {
            this.initContext();
            if (!this.ctx) {
                this.playSfx('switch');
                return;
            }

            const duration = 0.38; // 380ms of analog radio tuning static
            const bufferSize = Math.floor(this.ctx.sampleRate * duration);
            const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const output = noiseBuffer.getChannelData(0);

            // Generate crackling analog radio noise with intermittent needle pops
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                const pop = Math.random() > 0.97 ? (Math.random() * 2 - 1) * 1.8 : 0;
                output[i] = white * 0.65 + pop;
            }

            const noiseSource = this.ctx.createBufferSource();
            noiseSource.buffer = noiseBuffer;

            // Bandpass filter to simulate analog radio tuning between channels
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            const now = this.ctx.currentTime;
            filter.frequency.setValueAtTime(900, now);
            filter.frequency.exponentialRampToValueAtTime(3400, now + duration * 0.5);
            filter.frequency.exponentialRampToValueAtTime(1200, now + duration);
            filter.Q.setValueAtTime(3.0, now);

            // Volume envelope (quick swell, sustained crackle, decay)
            const gain = this.ctx.createGain();
            const targetVol = this.sfxVolume * 0.55;
            gain.gain.setValueAtTime(0.01, now);
            gain.gain.linearRampToValueAtTime(targetVol, now + 0.03);
            gain.gain.setValueAtTime(targetVol, now + duration * 0.7);
            gain.gain.linearRampToValueAtTime(0.001, now + duration);

            noiseSource.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            noiseSource.start(now);
            noiseSource.stop(now + duration);

            // Play physical switch click alongside static
            this.playSfx('switch');
        } catch {
            this.playSfx('switch');
        }
    }

    setupGlobalListeners() {
        if (this.initialized || typeof window === 'undefined') return;
        this.initialized = true;

        const unlockAudio = () => {
            this.initContext();
            window.removeEventListener('pointerdown', unlockAudio);
            window.removeEventListener('keydown', unlockAudio);
        };
        window.addEventListener('pointerdown', unlockAudio, { once: true, passive: true });
        window.addEventListener('keydown', unlockAudio, { once: true, passive: true });

        // Hover listener using event delegation for all interactive elements
        document.addEventListener('mouseover', (e) => {
            const target = e.target.closest(
                'button, a, .btn-p5-hero, .btn-target-action, .nav-tab-btn, .parameter-card, .confidant-card, .btn-p5-3d, .btn-p5-send, .m-btn, .c-tile, .btn-vote-request, .comment-report-flag-btn, input[type="checkbox"]'
            );

            if (!target) return;

            // Ensure we only trigger once when entering the interactive element
            if (target.contains(e.relatedTarget)) return;

            const now = Date.now();
            if (now - this.lastHoverTime < 35) return; // 35ms debounce
            this.lastHoverTime = now;

            this.playSfx('hover');
        }, { passive: true });
    }
}

export function showToast(message, type = 'info') {
    if (typeof document === 'undefined') return;
    const toastContainer = document.getElementById('p5-toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `p5-toast p5-toast-${type}`;
    toast.innerHTML = `
      <span class="p5-toast-icon">★</span>
      <span class="p5-toast-text">${message}</span>
    `;

    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('is-hiding');
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

export const audioEngine = new P5AudioEngine();
if (typeof window !== 'undefined') {
    window.phansiteAudio = audioEngine;
    window.phansiteApp = {
        ...(window.phansiteApp || {}),
        showToast,
    };
}
