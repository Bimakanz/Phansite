/**
 * Persona 5 Phansite - Audio & SFX Engine
 * Real local Persona 5 audio tracks and Web Audio SFX
 */

class PhansiteAudio {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.currentTrackIndex = 0;
    this.volume = 0.7;
    this.sfxVolume = 0.75;
    this.sfxBuffers = {};
    this.sfxLoading = false;

    // Authentic Persona 5 Royal Sound Effects
    this.sfxFiles = {
      hover: 'assets/audio/sfx/hover.mp3',
      click: 'assets/audio/sfx/click.mp3',
      select: 'assets/audio/sfx/select.mp3',
      tab: 'assets/audio/sfx/tab_slash.mp3',
      'vote-yes': 'assets/audio/sfx/important_click.mp3',
      'vote-no': 'assets/audio/sfx/click.mp3',
      message: 'assets/audio/sfx/notification.mp3',
      target: 'assets/audio/sfx/level_upgrade.mp3',
      important: 'assets/audio/sfx/important_click.mp3'
    };

    // Real local tracks
    this.tracks = [
      {
        title: "Beneath the Mask",
        artist: "アトラスサウンドチーム (Atlus Sound Team)",
        album: "Persona 5 OST",
        url: "assets/audio/beneath_the_mask.mp3"
      },
      {
        title: "Phantom",
        artist: "アトラスサウンドチーム (Atlus Sound Team)",
        album: "Persona 5 OST",
        url: "assets/audio/phantom.mp3"
      },
      {
        title: "Last Surprise",
        artist: "アトラスサウンドチーム (Atlus Sound Team)",
        album: "Persona 5 OST",
        url: "assets/audio/last_surprise.mp3"
      }
    ];

    this.audioElement = new Audio();
    this.audioElement.volume = this.volume;
    this.audioElement.loop = true;
    this.audioElement.preload = "auto";

    this.initAudioEvents();
  }

  initContext() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (this.ctx && !this.sfxLoading && Object.keys(this.sfxBuffers).length === 0) {
      this.loadAllSfxBuffers();
    }
  }

  async loadAllSfxBuffers() {
    if (!this.ctx || this.sfxLoading) return;
    this.sfxLoading = true;
    for (const [key, url] of Object.entries(this.sfxFiles)) {
      try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        this.ctx.decodeAudioData(arrayBuffer, (decoded) => {
          this.sfxBuffers[key] = decoded;
        }, (err) => {
          console.warn(`Failed to decode SFX ${key}:`, err);
        });
      } catch (err) {
        console.warn(`Failed to fetch SFX ${key}:`, err);
      }
    }
  }

  initAudioEvents() {
    this.audioElement.addEventListener('play', () => {
      this.isPlaying = true;
      this.updatePlayerUI();
    });

    this.audioElement.addEventListener('pause', () => {
      this.isPlaying = false;
      this.updatePlayerUI();
    });

    this.audioElement.addEventListener('ended', () => {
      this.nextTrack();
    });

    // Preload first track
    this.loadTrack(0);
  }

  loadTrack(index, isUserSwitch = false) {
    this.currentTrackIndex = (index + this.tracks.length) % this.tracks.length;
    const track = this.tracks[this.currentTrackIndex];
    this.audioElement.src = track.url;
    this.updatePlayerUI();
    if (isUserSwitch) {
      this.triggerTrackChangeAnimations();
    }
  }

  // Triggered ONLY on song switch (next/prev track)
  triggerTrackChangeAnimations() {
    // 1. Sequential jumping wave animation from first to last letter in "NOW PLAYING"
    this.triggerNowPlayingWave();

    // 2. 360-degree rotation spin animation on album art (only on song change)
    const albumWrap = document.getElementById('music-box-album-wrap');
    if (albumWrap) {
      albumWrap.classList.remove('is-spinning');
      void albumWrap.offsetWidth; // force DOM reflow
      albumWrap.classList.add('is-spinning');
    }

    // 3. Glitch punch transition on track title (only on song change)
    const titleEl = document.getElementById('np-track-title');
    if (titleEl) {
      titleEl.classList.remove('is-glitching');
      void titleEl.offsetWidth; // force DOM reflow
      titleEl.classList.add('is-glitching');
    }
  }

  // Triggered when resuming from pause -> play (ONLY Now Playing letters bounce)
  triggerNowPlayingWave() {
    const waveEl = document.getElementById('np-wave-text');
    if (waveEl) {
      waveEl.classList.remove('is-waving');
      void waveEl.offsetWidth; // force DOM reflow
      waveEl.classList.add('is-waving');
    }
  }

  toggleMiniPlayer() {
    const player = document.getElementById('floating-music-player');
    const toggleIcon = document.getElementById('mini-toggle-icon');
    if (player) {
      this.playSfx('click');
      player.classList.toggle('is-minimized');
      const isMini = player.classList.contains('is-minimized');
      if (toggleIcon) {
        toggleIcon.textContent = isMini ? '▲' : '▼';
      }
    }
  }

  togglePlay() {
    this.initContext();
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    this.initContext();
    if (!this.audioElement.src || this.audioElement.src === '') {
      this.loadTrack(this.currentTrackIndex, false);
    }
    const p = this.audioElement.play();
    if (p !== undefined) {
      p.then(() => {
        this.isPlaying = true;
        this.updatePlayerUI();
        // Resuming from pause: ONLY animate "Now playing" letters, do NOT move album or glitch title
        this.triggerNowPlayingWave();
      }).catch(err => {
        console.warn("Audio autoplay blocked by browser policy until user interacts:", err);
      });
    }
  }

  pause() {
    this.audioElement.pause();
    this.isPlaying = false;
    this.updatePlayerUI();
  }

  nextTrack() {
    this.playSfx('select');
    this.loadTrack(this.currentTrackIndex + 1, true);
    this.play();
  }

  prevTrack() {
    this.playSfx('select');
    this.loadTrack(this.currentTrackIndex - 1, true);
    this.play();
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    this.audioElement.volume = this.volume;
  }

  setSfxVolume(vol) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
  }

  toggleMute() {
    this.playSfx('select');
    if (this.audioElement.volume > 0) {
      this.lastVolume = this.audioElement.volume;
      this.audioElement.volume = 0;
    } else {
      this.audioElement.volume = this.lastVolume || this.volume || 0.7;
    }
    this.updatePlayerUI();
  }

  updatePlayerUI() {
    const track = this.tracks[this.currentTrackIndex];
    const titleEls = document.querySelectorAll('.np-track-name, #np-track-title');
    const artistEls = document.querySelectorAll('.np-artist-name');
    const playBtns = document.querySelectorAll('.btn-play-toggle');
    const visualizers = document.querySelectorAll('.audio-visualizer');
    const widget = document.getElementById('floating-music-player');
    const headerBtn = document.getElementById('btn-header-music-toggle');
    const headerLabel = document.getElementById('header-music-label');
    const volBtn = document.getElementById('btn-music-volume-toggle');

    titleEls.forEach(el => el.textContent = track.title);
    artistEls.forEach(el => el.textContent = track.artist);

    playBtns.forEach(btn => {
      btn.innerHTML = this.isPlaying ? '❚❚ PAUSE' : '▶ PLAY BGM';
      btn.classList.toggle('is-playing', this.isPlaying);
    });

    if (widget) {
      widget.classList.toggle('is-playing', this.isPlaying);
    }

    if (headerBtn) {
      headerBtn.classList.toggle('is-playing', this.isPlaying);
    }
    if (headerLabel) {
      headerLabel.textContent = this.isPlaying ? 'PAUSE BGM' : 'PLAY BGM';
    }

    if (volBtn) {
      volBtn.classList.toggle('is-muted', this.audioElement.volume === 0);
    }

    visualizers.forEach(v => {
      v.classList.toggle('is-active', this.isPlaying);
    });
  }

  playSfx(type) {
    try {
      this.initContext();
      const url = this.sfxFiles[type] || this.sfxFiles['click'];
      if (!url) return;

      // Carefully balanced Persona 5 sound volumes
      let vol = this.sfxVolume;
      if (type === 'hover') vol *= 0.4;
      else if (type === 'click') vol *= 0.75;
      else if (type === 'select') vol *= 0.85;
      else if (type === 'tab') vol *= 0.85;
      else if (type === 'vote-yes' || type === 'important') vol *= 1.0;
      else if (type === 'target') vol *= 0.9;
      else if (type === 'message') vol *= 0.8;

      // 1. Zero-latency playback via AudioContext buffer if ready
      if (this.ctx && this.sfxBuffers && this.sfxBuffers[type]) {
        const source = this.ctx.createBufferSource();
        source.buffer = this.sfxBuffers[type];
        const gainNode = this.ctx.createGain();
        gainNode.gain.setValueAtTime(vol, this.ctx.currentTime);
        source.connect(gainNode);
        gainNode.connect(this.ctx.destination);
        source.start(0);
        return;
      }

      // If buffer not decoded yet, start loading all buffers
      if (this.ctx && (!this.sfxBuffers || !this.sfxBuffers[type])) {
        this.loadAllSfxBuffers();
      }

      // 2. High-performance fallback with Audio element
      const audio = new Audio(url);
      audio.volume = Math.max(0, Math.min(1, vol));
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } catch (e) {
      console.warn("SFX error:", e);
    }
  }
}

window.phansiteAudio = new PhansiteAudio();
