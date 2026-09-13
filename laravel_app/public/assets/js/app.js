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
        certGrid.innerHTML = certificates.map((cert, index) => {
          const imageSrc = cert.image || cert.imageUrl || '/assets/img/p5_certificate_sample.jpg';
          return `
          <div class="tarot-cert-card tarot-cert-interactive" onclick="phansiteApp.openCertificateModal(window.phansiteStore.getCertificates()[${index}])" style="cursor: pointer; position: relative; display: flex; flex-direction: column; justify-content: space-between; padding: 2rem; min-height: 440px;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">
                <div class="tarot-arcana-badge" style="margin: 0; font-size: 1.3rem;">TAROT // ${this.escapeHtml(cert.arcana || 'STAR')}</div>
              </div>
              <div class="cert-card-thumb-wrap" style="position: relative; width: 100%; height: 260px; overflow: hidden; margin-bottom: 1.2rem; border: 3px solid #2a2a2a; background: #0c0c0e; display: flex; align-items: center; justify-content: center;">
                <img src="${this.escapeHtml(imageSrc)}" alt="${this.escapeHtml(cert.title)}" class="cert-thumb-img" style="width: 100%; height: 100%; object-fit: contain; background: #000; transition: transform 0.35s ease;">
              </div>
              <h4 class="tarot-title" style="margin: 0.4rem 0; text-align: left; font-size: 1.5rem; line-height: 1.25;">${this.escapeHtml(cert.title)}</h4>
              <div class="tarot-issuer" style="text-align: left; font-size: 1rem; font-weight: bold; color: var(--p5-yellow); margin-bottom: 0.6rem;">${this.escapeHtml(cert.issuer)} &bull; ${this.escapeHtml(cert.year)}</div>
              ${cert.description ? `
                <div class="p5-dialog-chatbox" style="position: relative; background-color: #ffffff; border: 3px solid #000000; box-shadow: 5px 5px 0 var(--p5-red); transform: skewX(-3deg); padding: 1rem 1.2rem 0.9rem; margin-top: 1.2rem; color: #000000;">
                  <div style="position: absolute; top: -11px; left: 10px; background-color: #000000; color: #ffffff; padding: 0.1rem 0.55rem; font-family: var(--font-p5-menu); font-size: 0.8rem; letter-spacing: 1px; transform: skewX(-3deg); border: 1px solid var(--p5-red); user-select: none;">RECORD // 記録</div>
                  <p style="font-family: var(--font-p5-sans); font-size: 0.95rem; font-weight: 700; color: #000000; line-height: 1.45; margin: 0; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">${this.escapeHtml(cert.description)}</p>
                  <span style="position: absolute; bottom: 4px; right: 8px; color: var(--p5-red); font-size: 0.8rem; animation: pulse 1s infinite alternate; user-select: none; font-weight: bold;">▼</span>
                </div>
              ` : ''}
            </div>
            ${cert.credentialUrl ? `
            <div style="margin-top: 1.2rem; display: flex; justify-content: flex-end;">
              <a href="${cert.credentialUrl}" target="_blank" rel="noopener noreferrer" class="btn-target-action" onclick="event.stopPropagation();" style="font-size: 0.85rem; padding: 0.4rem 1rem;">VERIFY CREDENTIAL ↗</a>
            </div>
            ` : ''}
          </div>
        `;
        }).join('');
      }
    }

    this.bindHoverSfx();
  }

  // --- CALLING CARD FORM SUBMISSION & ANIMATION ---
  async handleCallingCardSubmit(e) {
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

    // Send to Discord Webhook
    const webhookUrl = 'https://ptb.discord.com/api/webhooks/1548594955159736400/Q-DSMtcFuk1rr6Jv8t8FgVTboqaiDSLNNbmeKquVj7dYjhM-sR4ShqzcXbs9fI9g8kdf';
    try {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'Phantom Aficionado Dispatch',
          avatar_url: 'https://raw.githubusercontent.com/Bimakanz/Phansite/main/assets/img/p5_tophat.png',
          content: '🚨 **A NEW CALLING CARD HAS BEEN DISPATCHED!** @here',
          embeds: [{
            title: '★ [CALLING CARD] INCOMING TRANSMISSION / HR INQUIRY',
            description: 'A decree / message has been transmitted via the Phansite Contact Terminal for **Bimakanz**!',
            color: 15073298,
            fields: [
              { name: '👤 SENDER / HR / ALIAS', value: '**' + name + '**', inline: true },
              { name: '📧 FREQUENCY (EMAIL)', value: '`' + email + '`', inline: true },
              { name: '📜 THE DECREE (MESSAGE)', value: '```\n' + message + '\n```', inline: false }
            ],
            footer: { text: 'PHANTOM AFICIONADO • COGNITIVE CMS DISPATCH' },
            timestamp: new Date().toISOString()
          }]
        })
      }).catch(err => console.warn('Discord webhook notice:', err));
    } catch (err) {
      console.warn('Webhook dispatch error:', err);
    }

    this.showToast(`CALLING CARD TRANSMITTED TO BIMAKANZ VIA DISCORD!`, 'success');

    // Reset Form
    document.getElementById('calling-card-form')?.reset();
  }

  // --- STEAL RESUME DOWNLOAD ---
  downloadResume() {
    if (window.phansiteAudio) window.phansiteAudio.playSfx('select');
    this.showToast('STEALING CV... ACQUIRING METAVERSE PAYLOAD!', 'success');

    const a = document.createElement('a');
    a.href = '/CV_BIMASENA.pdf';
    a.download = 'CV_BIMASENA.pdf';
    a.target = '_blank';
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

  openCertificateModal(cert) {
    if (!cert) return;
    if (window.phansiteAudio) window.phansiteAudio.playSfx('select');
    let modal = document.getElementById('cert-detail-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'cert-detail-modal';
      modal.className = 'p5-modal-overlay is-hidden';
      modal.innerHTML = `
        <div class="p5-modal-backdrop" onclick="phansiteApp.closeCertificateModal()"></div>
        <div class="p5-modal-dialog" style="max-width: 850px; background: #0a0a0c; border: 4px solid #ffffff; box-shadow: 12px 12px 0 var(--p5-red); transform: skewX(-2deg); overflow: hidden;">
          <div style="background: var(--p5-red); color: #000; padding: 0.8rem 1.2rem; display: flex; align-items: center; justify-content: space-between; font-family: var(--font-p5-menu);">
            <div style="display: flex; align-items: center; gap: 0.8rem;">
              <span id="cert-modal-arcana" style="background: #000; color: #fff; padding: 0.2rem 0.5rem; font-size: 0.85rem;">TAROT // STAR</span>
              <span style="font-size: 1.1rem; color: #fff;">CERTIFICATION SPECIMEN</span>
            </div>
            <button type="button" onclick="phansiteApp.closeCertificateModal()" onmouseenter="window.phansiteAudio && window.phansiteAudio.playSfx('hover')" class="p5-modal-close-btn">✕ CLOSE (ESC)</button>
          </div>
          <div style="padding: 1.5rem; overflow-y: auto; max-height: 80vh; display: flex; flex-direction: column; gap: 1.2rem; color: #fff;">
            <div style="background: #000; border: 3px solid #ffffff; box-shadow: 6px 6px 0 var(--p5-red); display: flex; align-items: center; justify-content: center; overflow: hidden; border-radius: 2px;">
              <img id="cert-modal-img" src="/assets/img/p5_certificate_sample.jpg" alt="Certificate" style="max-width: 100%; max-height: 56vh; object-fit: contain; display: block;" />
            </div>
            <div>
              <h3 id="cert-modal-title" style="font-family: var(--font-p5-menu); font-size: 1.6rem; color: #fff; margin: 0 0 0.4rem;"></h3>
              <div id="cert-modal-issuer" style="color: var(--p5-yellow); font-family: var(--font-p5-sans); font-size: 0.95rem; font-weight: bold;"></div>
              <div id="cert-modal-desc-wrap" class="p5-dialog-chatbox" style="position: relative; background-color: #ffffff; border: 3px solid #000000; box-shadow: 6px 6px 0 var(--p5-red); transform: skewX(-3deg); padding: 1.2rem 1.4rem 1rem; margin-top: 1.2rem; color: #000000; display: none;">
                <div style="position: absolute; top: -12px; left: 12px; background-color: #000000; color: #ffffff; padding: 0.15rem 0.65rem; font-family: var(--font-p5-menu); font-size: 0.85rem; letter-spacing: 1px; transform: skewX(-3deg); border: 1.5px solid var(--p5-red); user-select: none;">CONFIDANT ARCHIVE // 記録</div>
                <p id="cert-modal-desc" style="font-family: var(--font-p5-sans); font-size: 1rem; font-weight: 700; color: #000000; line-height: 1.6; margin: 0;"></p>
                <span style="position: absolute; bottom: 6px; right: 10px; color: var(--p5-red); font-size: 0.9rem; animation: pulse 1s infinite alternate; user-select: none; font-weight: bold;">▼</span>
              </div>
            </div>
            <div style="display: flex; align-items: center; justify-content: flex-start; flex-wrap: wrap; gap: 1rem; border-top: 1px solid #333; padding-top: 0.8rem;">
              <div style="display: flex; gap: 0.8rem; flex-wrap: wrap;">
                <a id="cert-modal-cred-btn" href="#" target="_blank" rel="noopener noreferrer" class="btn-target-action" style="display: none; font-size: 0.9rem; padding: 0.5rem 1.2rem;">VERIFY CREDENTIAL ↗</a>
                <a id="cert-modal-full-btn" href="#" target="_blank" rel="noopener noreferrer" class="btn-p5-cancel" style="font-size: 0.9rem; padding: 0.5rem 1.2rem; text-decoration: none;">OPEN FULL IMAGE ↗</a>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    const imageSrc = cert.image || cert.imageUrl || '/assets/img/p5_certificate_sample.jpg';
    const arcanaEl = document.getElementById('cert-modal-arcana');
    if (arcanaEl) arcanaEl.textContent = `TAROT // ${cert.arcana || 'STAR'}`;
    const titleEl = document.getElementById('cert-modal-title');
    if (titleEl) titleEl.textContent = cert.title || '';
    const issuerEl = document.getElementById('cert-modal-issuer');
    if (issuerEl) issuerEl.textContent = ` ${cert.issuer || 'Phantom Academy'} •  ${cert.year || '2025'}`;
    const imgEl = document.getElementById('cert-modal-img');
    if (imgEl) imgEl.src = imageSrc;
    const fullBtn = document.getElementById('cert-modal-full-btn');
    if (fullBtn) fullBtn.href = imageSrc;

    const descWrap = document.getElementById('cert-modal-desc-wrap');
    const descEl = document.getElementById('cert-modal-desc');
    if (descEl && descWrap) {
      if (cert.description) {
        descEl.textContent = cert.description;
        descWrap.style.display = 'block';
      } else {
        descWrap.style.display = 'none';
      }
    }

    const credBtn = document.getElementById('cert-modal-cred-btn');
    if (credBtn) {
      if (cert.credentialUrl) {
        credBtn.href = cert.credentialUrl;
        credBtn.style.display = 'inline-block';
      } else {
        credBtn.style.display = 'none';
      }
    }

    modal.classList.remove('is-hidden');
  }

  closeCertificateModal() {
    if (window.phansiteAudio) window.phansiteAudio.playSfx('click');
    const modal = document.getElementById('cert-detail-modal');
    if (modal) modal.classList.add('is-hidden');
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
