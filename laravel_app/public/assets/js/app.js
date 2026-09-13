/**
 * Persona 5 Phansite - Main Application Controller
 * Handles tab navigation, dynamic portfolio rendering, calling cards, and UI orchestration
 */

class PhansiteApp {
  constructor() {
    this.currentTab = 'home';
    this.init();
  }

  init() {
    this.bindNavigation();
    this.bindGlobalModals();
    this.initProfile();
    this.bindSettings();
    this.bindHoverSfx();
    this.initDataRendering();
    this.animateApprovalRating();
  }

  bindNavigation() {
    const navItems = document.querySelectorAll('.nav-tab-btn');
    navItems.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = btn.getAttribute('data-tab');
        if (tab) {
          if (window.phansiteAudio) window.phansiteAudio.playSfx('tab_slash');
          this.switchTab(tab);
        }
      });
    });
  }

  switchTab(tabId) {
    if (this.currentTab === tabId) return;
    this.currentTab = tabId;

    // Update nav links
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.classList.toggle('is-active', btn.getAttribute('data-tab') === tabId);
    });

    // Update section visibility
    document.querySelectorAll('.app-section').forEach(sec => {
      if (sec.id === `section-${tabId}`) {
        sec.classList.remove('is-hidden');
        sec.classList.remove('p5-slide-in');
        void sec.offsetWidth; // trigger reflow
        sec.classList.add('p5-slide-in');
      } else {
        sec.classList.add('is-hidden');
      }
    });

    // Animate approval rating if switched to home
    if (tabId === 'home') {
      this.animateApprovalRating();
    }
  }

  // --- DYNAMIC DATA RENDERING (PORTFOLIO) ---
  initDataRendering() {
    this.renderPublicProjects();
    this.renderPublicExperience();

    // Subscribe to store updates
    if (window.phansiteStore) {
      window.phansiteStore.subscribe('projects:change', () => this.renderPublicProjects());
      window.phansiteStore.subscribe('experiences:change', () => this.renderPublicExperience());
      window.phansiteStore.subscribe('certificates:change', () => this.renderPublicExperience());
    }
  }

  renderPublicProjects() {
    const grid = document.getElementById('public-projects-grid');
    const emptyState = document.getElementById('public-projects-empty');
    if (!grid || !window.phansiteStore) return;

    const projects = window.phansiteStore.getProjects();

    // EMPTY STATE CONDITIONAL RENDER
    if (projects.length === 0) {
      grid.innerHTML = '';
      emptyState?.classList.remove('is-hidden');
      return;
    }

    emptyState?.classList.add('is-hidden');
    grid.innerHTML = projects.map((p, idx) => `
      <article class="project-target-card" id="card-${p.id}">
        <div class="target-card-cover">
          <img src="${p.image || 'assets/img/joker_mask.png'}" alt="${this.escapeHtml(p.title)}" onerror="this.src='assets/img/joker_mask.png'" />
          <span class="target-card-badge">TARGET #${String(idx + 1).padStart(2, '0')}</span>
        </div>
        <div class="target-card-body">
          <div>
            <h3 class="target-card-title">${this.escapeHtml(p.title)}</h3>
            <p class="target-card-desc">${this.escapeHtml(p.description)}</p>
          </div>
          <div>
            <div class="target-card-tech">
              ${(p.tech || []).map(t => `<span class="c-tile" style="width: auto; height: 26px; font-size: 0.85rem; padding: 0 0.5rem; font-family: var(--font-p5-sans); font-weight: 700;">${this.escapeHtml(t)}</span>`).join('')}
            </div>
            <div class="target-card-actions">
              ${p.liveUrl ? `<a href="${p.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn-target-action">LIVE DEMO ↗</a>` : ''}
              ${p.repoUrl ? `<a href="${p.repoUrl}" target="_blank" rel="noopener noreferrer" class="btn-target-action btn-repo">GITHUB ⎘</a>` : ''}
            </div>
          </div>
        </div>
      </article>
    `).join('');

    this.bindHoverSfx();
  }

  renderPublicExperience() {
    const timeline = document.getElementById('public-experience-timeline');
    const certGrid = document.getElementById('public-certifications-grid');
    if (!window.phansiteStore) return;

    if (timeline) {
      const experiences = window.phansiteStore.getExperiences();
      if (experiences.length === 0) {
        timeline.innerHTML = '<div class="p5-empty-state"><div class="empty-state-text">NO CONFIDANTS DOCUMENTED YET.</div></div>';
      } else {
        timeline.innerHTML = experiences.map(exp => `
          <div class="confidant-card">
            <div class="confidant-content">
              <span class="confidant-rank-tag">${this.escapeHtml(exp.rank || 'RANK 1')} // ARCANA: ${this.escapeHtml(exp.arcana || 'THE FOOL')}</span>
              <h4 class="confidant-role">${this.escapeHtml(exp.role)}</h4>
              <div class="confidant-company">@ ${this.escapeHtml(exp.company)} <span style="color: #888; font-weight: 400; font-size: 0.9rem;">(${this.escapeHtml(exp.period)})</span></div>
              <p class="confidant-desc">${this.escapeHtml(exp.description)}</p>
              <div class="target-card-tech">
                ${(exp.skills || []).map(s => `<span class="c-tile" style="width: auto; height: 24px; font-size: 0.8rem; padding: 0 0.5rem; font-family: var(--font-p5-sans); font-weight: 700;">${this.escapeHtml(s)}</span>`).join('')}
              </div>
            </div>
          </div>
        `).join('');
      }
    }

    if (certGrid) {
      const certificates = window.phansiteStore.getCertificates();
      if (certificates.length === 0) {
        certGrid.innerHTML = '<div class="p5-empty-state" style="grid-column: 1 / -1;"><div class="empty-state-text">NO CERTIFICATES RECORDED.</div></div>';
      } else {
        certGrid.innerHTML = certificates.map(cert => `
          <div class="tarot-cert-card">
            <div class="tarot-arcana-badge">TAROT // ${this.escapeHtml(cert.arcana || 'STAR')}</div>
            <h4 class="tarot-title">${this.escapeHtml(cert.title)}</h4>
            <div class="tarot-issuer">${this.escapeHtml(cert.issuer)} &bull; ${this.escapeHtml(cert.year)}</div>
            ${cert.credentialUrl ? `<a href="${cert.credentialUrl}" target="_blank" rel="noopener noreferrer" class="btn-target-action" style="display: block; margin-top: 0.8rem; font-size: 0.95rem;">VERIFY CREDENTIAL ↗</a>` : ''}
          </div>
        `).join('');
      }
    }

    this.bindHoverSfx();
  }

  // --- CALLING CARD FORM SUBMISSION & ANIMATION ---
  handleCallingCardSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('card-sender-name')?.value.trim();
    const email = document.getElementById('card-sender-email')?.value.trim();
    const message = document.getElementById('card-message')?.value.trim();

    if (!name || !email || !message) {
      this.showToast('PLEASE FILL OUT ALL CALLING CARD FIELDS!', 'error');
      return;
    }

    if (window.phansiteAudio) window.phansiteAudio.playSfx('level_upgrade');

    // Trigger Flying Calling Card animation across screen
    const flyingCard = document.createElement('div');
    flyingCard.className = 'flying-card-anim';
    flyingCard.innerHTML = `<span>★ TAKE YOUR HEART ★</span>`;
    document.body.appendChild(flyingCard);

    setTimeout(() => flyingCard.remove(), 1800);

    this.showToast(`CALLING CARD DISPATCHED BY ${name.toUpperCase()}! THE THIEVES WILL RESPOND.`, 'success');

    // Reset Form
    document.getElementById('calling-card-form')?.reset();
  }

  // --- STEAL RESUME DOWNLOAD ---
  downloadResume() {
    if (window.phansiteAudio) window.phansiteAudio.playSfx('select');
    this.showToast('STEALING RESUME... DECRYPTING METAVERSE PAYLOAD!', 'success');

    const resumeMarkdown = `# BIMASENA // FULL-STACK SOFTWARE ENGINEER & COGNITIVE CRAFTSMAN
Contact: bimasena@shibuya.io | GitHub: github.com/bimasena | Portfolio: Phansite

## EXECUTIVE SUMMARY
Lead Full-Stack Software Engineer with specialized mastery in React.js, Next.js, Tailwind CSS, Laravel, and resilient cloud architecture. Proven track record of architecting high-performance web systems with striking, uncompromising UI/UX design.

## CORE PARAMETERS & TECHNICAL SKILLS
- Frontend: React.js, Next.js, TypeScript, JavaScript (ES6+), Tailwind CSS, Neo-Brutalist Architecture, Web Audio API.
- Backend: Laravel, Node.js, Express.js, RESTful API Architecture, PostgreSQL, MySQL, Redis.
- Engineering & DevOps: Git, GitHub CI/CD, Vite, Docker, Unit/Integration Testing, Lighthouse Optimization (99+).
- Design & UI/UX: Persona 5 Thematic Design Systems, Figma Prototyping, Motion Choreography.

## FEATURED MISSIONS (PROJECTS)
1. Metaverse Nexus E-Commerce (Next.js, Tailwind, Stripe, PostgreSQL)
2. Cognitive Palace Task Manager (Laravel, Vue.js, Redis, WebSockets)
3. Phantom Aficionado Synthesizer (Vanilla ES6, Web Audio API, Canvas)

## CONFIDANT EXPERIENCE
- Lead Full-Stack Infiltrator @ Phantom Studio Lab (2024 - Present)
- Frontend Software Craftsman @ Cognitive Systems Corp (2022 - 2024)
- Web Development Specialist @ Shibuya Creative Tech (2021 - 2022)

---
Generated directly from the Persona 5 Phansite Cognitive Engine.
`;

    const blob = new Blob([resumeMarkdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Bimasena_FullStack_Resume.md';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  // --- APPROVAL RATING ANIMATION ---
  animateApprovalRating() {
    const numEl = document.getElementById('hero-approval-number');
    const fillEl = document.getElementById('hero-approval-fill');
    if (!numEl || !fillEl) return;

    fillEl.style.width = '0%';
    let current = 0;
    const target = 98;
    const duration = 1200;
    const stepTime = Math.abs(Math.floor(duration / target));

    const timer = setInterval(() => {
      current += 2;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      numEl.textContent = `${current}%`;
    }, stepTime);

    setTimeout(() => {
      fillEl.style.width = '98%';
    }, 150);
  }

  // --- SFX & HOVER BINDINGS ---
  bindHoverSfx() {
    const interactiveElements = document.querySelectorAll('button, .btn-p5-hero, .btn-target-action, .nav-tab-btn, .parameter-card, .confidant-card');
    interactiveElements.forEach(el => {
      if (!el.dataset.sfxBound) {
        el.dataset.sfxBound = 'true';
        el.addEventListener('mouseenter', () => {
          if (window.phansiteAudio) window.phansiteAudio.playSfx('hover');
        });
      }
    });
  }

  // --- MODALS & PROFILE ---
  bindGlobalModals() {
    document.querySelectorAll('.p5-modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          backdrop.closest('.p5-modal-overlay').classList.add('is-hidden');
          if (window.phansiteAudio) window.phansiteAudio.playSfx('click');
        }
      });
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.p5-modal-overlay:not(.is-hidden)').forEach(modal => {
          modal.classList.add('is-hidden');
        });
      }
    });
  }

  openSettingsModal() {
    if (window.phansiteAudio) window.phansiteAudio.playSfx('select');
    document.getElementById('settings-modal')?.classList.remove('is-hidden');
  }

  closeSettingsModal() {
    if (window.phansiteAudio) window.phansiteAudio.playSfx('click');
    document.getElementById('settings-modal')?.classList.add('is-hidden');
  }

  openProfileModal() {
    if (window.phansiteAudio) window.phansiteAudio.playSfx('select');
    const modal = document.getElementById('profile-modal');
    if (modal) {
      const username = localStorage.getItem('phansite_username') || 'Phantom_Aficionado';
      const input = document.getElementById('profile-input-username');
      if (input) input.value = username;
      modal.classList.remove('is-hidden');
    }
  }

  closeProfileModal() {
    if (window.phansiteAudio) window.phansiteAudio.playSfx('click');
    document.getElementById('profile-modal')?.classList.add('is-hidden');
  }

  saveProfile(e) {
    if (e) e.preventDefault();
    const input = document.getElementById('profile-input-username');
    if (input && input.value.trim()) {
      const name = input.value.trim();
      localStorage.setItem('phansite_username', name);
      this.showToast(`CODENAME UPDATED: ${name.toUpperCase()}`, 'success');
    }
    this.closeProfileModal();
  }

  initProfile() {
    if (!localStorage.getItem('phansite_username')) {
      localStorage.setItem('phansite_username', 'Phantom_Aficionado');
    }
  }

  bindSettings() {
    const bgmSlider = document.getElementById('settings-bgm-volume');
    if (bgmSlider) {
      bgmSlider.value = 60;
      bgmSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) / 100;
        if (window.phansiteAudio) window.phansiteAudio.setVolume(val);
      });
    }

    const sfxSlider = document.getElementById('settings-sfx-volume');
    if (sfxSlider) {
      sfxSlider.value = 80;
      sfxSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) / 100;
        if (window.phansiteAudio) window.phansiteAudio.sfxVolume = val;
      });
    }
  }

  // --- TOAST NOTIFICATIONS ---
  showToast(message, type = 'info') {
    const toastContainer = document.getElementById('p5-toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `p5-toast p5-toast-${type}`;
    toast.innerHTML = `
      <span class="p5-toast-icon">★</span>
      <span class="p5-toast-text">${this.escapeHtml(message)}</span>
    `;

    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('is-hiding');
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

// Global instance
window.phansiteApp = new PhansiteApp();
