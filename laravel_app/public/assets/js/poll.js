/**
 * Persona 5 Phansite - Approval Rating Poll Engine
 * Initialized with authentic Persona 5 starting state (6.7%) from Figma Wireframe 1:27
 */

class PhansitePoll {
  constructor() {
    this.storageKey = 'phansite_poll_state_v2';
    this.state = this.loadState();
    this.counterAnimationId = null;

    this.initUI();
  }

  loadState() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse poll storage", e);
      }
    }
    // Seed matching Figma 1:27 (YES 6.7%)
    return {
      yesVotes: 67,
      noVotes: 933,
      userVote: null,
      lastVotedAt: null
    };
  }

  saveState() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.state));
  }

  getApprovalPercentage() {
    const total = this.state.yesVotes + this.state.noVotes;
    if (total === 0) return 6.7;
    return (this.state.yesVotes / total) * 100;
  }

  initUI() {
    this.updateDisplay(this.getApprovalPercentage(), false);
    this.highlightUserChoice();
  }

  vote(choice) {
    if (window.phansiteAudio) {
      window.phansiteAudio.playSfx(choice === 'YES' ? 'vote-yes' : 'vote-no');
    }

    const previousPercentage = this.getApprovalPercentage();

    if (this.state.userVote === choice) {
      this.showToast(`YOU ALREADY VOTED "${choice}"!`, 'info');
      return;
    }

    // Adjust votes
    if (this.state.userVote === 'YES') {
      this.state.yesVotes = Math.max(0, this.state.yesVotes - 1);
    } else if (this.state.userVote === 'NO') {
      this.state.noVotes = Math.max(0, this.state.noVotes - 1);
    }

    if (choice === 'YES') {
      this.state.yesVotes += 1;
      this.showToast('VOTE SUBMITTED! THE PHANTOM THIEVES HEARD YOU!', 'success');
    } else {
      this.state.noVotes += 1;
      this.showToast('VOTE SUBMITTED! SKEPTICISM RECORDED.', 'error');
    }

    this.state.userVote = choice;
    this.state.lastVotedAt = new Date().toISOString();
    this.saveState();

    this.highlightUserChoice();
    const newPercentage = this.getApprovalPercentage();
    this.animatePercentage(previousPercentage, newPercentage);
  }

  highlightUserChoice() {
    const btnYes = document.getElementById('btn-boxed-yes');
    const btnNo = document.getElementById('btn-boxed-no');

    if (btnYes) btnYes.classList.toggle('is-selected', this.state.userVote === 'YES');
    if (btnNo) btnNo.classList.toggle('is-selected', this.state.userVote === 'NO');
  }

  animatePercentage(startVal, endVal, duration = 800) {
    if (this.counterAnimationId) {
      cancelAnimationFrame(this.counterAnimationId);
    }

    const startTime = performance.now();
    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = startVal + (endVal - startVal) * easeProgress;

      this.updateDisplay(current, true);

      if (progress < 1) {
        this.counterAnimationId = requestAnimationFrame(step);
      } else {
        this.updateDisplay(endVal, false);
      }
    };

    this.counterAnimationId = requestAnimationFrame(step);
  }

  updateDisplay(percentage, isAnimating = false) {
    const formatted = percentage.toFixed(1);
    const valueEl = document.getElementById('poll-percent-display');
    const barEl = document.getElementById('poll-slanted-fill');

    if (valueEl) {
      valueEl.textContent = `${formatted}%`;
    }

    if (barEl) {
      barEl.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
    }
  }

  showToast(message, type = 'info') {
    if (window.phansiteApp && window.phansiteApp.showToast) {
      window.phansiteApp.showToast(message, type);
    }
  }
}

window.phansitePoll = new PhansitePoll();
