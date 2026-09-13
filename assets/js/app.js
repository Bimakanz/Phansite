/**
 * Persona 5 Phansite - Main Application Controller
 * Handles tab navigation, modal state, toast notifications, and user preferences
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
  }

  bindNavigation() {
    const navItems = document.querySelectorAll('.nav-tab-btn');
    navItems.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = btn.getAttribute('data-tab');
        if (tab) {
          if (window.phansiteAudio) window.phansiteAudio.playSfx('tab');
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

    // If switched to chat, scroll messages
    if (tabId === 'chats' && window.phansiteChat) {
      setTimeout(() => window.phansiteChat.scrollToBottom(), 100);
    }
  }

  bindGlobalModals() {
    // Backdrop click to close modals
    document.querySelectorAll('.p5-modal-backdrop').forEach(backdrop => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          backdrop.closest('.p5-modal-overlay').classList.add('is-hidden');
          if (window.phansiteAudio) window.phansiteAudio.playSfx('click');
        }
      });
    });

    // Escape key closes modals
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
    const modal = document.getElementById('settings-modal');
    if (modal) modal.classList.remove('is-hidden');
  }

  closeSettingsModal() {
    if (window.phansiteAudio) window.phansiteAudio.playSfx('click');
    const modal = document.getElementById('settings-modal');
    if (modal) modal.classList.add('is-hidden');
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
    const modal = document.getElementById('profile-modal');
    if (modal) modal.classList.add('is-hidden');
  }

  saveProfile(e) {
    if (e) e.preventDefault();
    const input = document.getElementById('profile-input-username');
    if (input && input.value.trim()) {
      const name = input.value.trim();
      localStorage.setItem('phansite_username', name);
      const nameDisplay = document.getElementById('current-user-display');
      if (nameDisplay) nameDisplay.textContent = name;
      this.showToast(`CODENAME UPDATED: ${name.toUpperCase()}`, 'success');
    }
    this.closeProfileModal();
  }

  initProfile() {
    let name = localStorage.getItem('phansite_username');
    if (!name) {
      name = 'Phantom_Aficionado';
      localStorage.setItem('phansite_username', name);
    }
    const nameDisplay = document.getElementById('current-user-display');
    if (nameDisplay) nameDisplay.textContent = name;

    let fanDate = localStorage.getItem('phansite_fan_since');
    if (!fanDate) {
      fanDate = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
      localStorage.setItem('phansite_fan_since', fanDate);
    }
    const fanDateDisplay = document.getElementById('profile-fan-since');
    if (fanDateDisplay) fanDateDisplay.textContent = fanDate;
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
        if (window.phansiteAudio) window.phansiteAudio.setSfxVolume(val);
      });
    }
  }

  bindHoverSfx() {
    let lastHoveredButton = null;
    let lastHoverTime = 0;

    // Attach crisp Persona 5 hover tick to buttons (strictly ONE sound per button, never per letter)
    document.addEventListener('mouseover', (e) => {
      const btn = e.target.closest('button, .nav-tab-btn, .p5-clickable, .target-link, .chat-channel-btn, .poll-vote-btn');
      if (!btn) {
        lastHoveredButton = null;
        return;
      }

      // If cursor is still inside the SAME button (e.g. moving between letter tiles in "HOME"), do NOT fire again
      if (btn === lastHoveredButton) {
        return;
      }

      // If entering from an inner child inside the same button, do NOT fire again
      if (e.relatedTarget && btn.contains(e.relatedTarget)) {
        return;
      }

      // Throttle rapid mouse movement sweeps (minimum 50ms interval)
      const now = Date.now();
      if (now - lastHoverTime < 50) {
        return;
      }

      lastHoveredButton = btn;
      lastHoverTime = now;

      if (window.phansiteAudio) {
        window.phansiteAudio.playSfx('hover');
      }
    });

    document.addEventListener('mouseout', (e) => {
      const btn = e.target.closest('button, .nav-tab-btn, .p5-clickable, .target-link, .chat-channel-btn, .poll-vote-btn');
      if (btn && (!e.relatedTarget || !btn.contains(e.relatedTarget))) {
        if (lastHoveredButton === btn) {
          lastHoveredButton = null;
        }
      }
    });
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `p5-toast p5-toast-${type}`;
    toast.innerHTML = `
      <div class="p5-toast-skew">
        <span class="p5-toast-icon">${type === 'success' ? '★' : (type === 'error' ? '!' : '♦')}</span>
        <span class="p5-toast-msg">${message}</span>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('is-leaving');
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.phansiteApp = new PhansiteApp();
});
