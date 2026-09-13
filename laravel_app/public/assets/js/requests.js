/**
 * Persona 5 Phansite - Mementos Target Requests Engine
 * Manages public target submissions, upvoting, and target detail dossiers
 */

class PhansiteRequests {
  constructor() {
    this.storageKey = 'phansite_target_requests_v1';
    this.requests = this.loadRequests();
    this.votedRequestIds = new Set(JSON.parse(localStorage.getItem('phansite_voted_requests') || '[]'));

    this.init();
  }

  loadRequests() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Failed to parse requests storage", e);
      }
    }

    // Authentic Persona 5 targets & Mementos targets
    return [
      {
        id: 'req-1',
        title: 'Shujin Academy Abuse of Authority',
        target: 'Suguru Kamoshida',
        category: 'Physical Abuse / Blackmail',
        votes: 14208,
        status: 'CHANGE OF HEART CONFIRMED',
        statusCode: 'completed',
        summary: 'PE teacher abusing volleyball students and exploiting school authority without repercussion.',
        details: 'Forcing students into harsh physical punishment and emotionally blackmailing families. Demands immediate change of heart before another student gets hurt.',
        submittedBy: 'Mishima_Admin',
        date: '2026-04-11',
        dangerLevel: 'RANK S'
      },
      {
        id: 'req-2',
        title: 'Plagiarism & Exploitation of Young Artists',
        target: 'Ichiryusai Madarame',
        category: 'Fraud / Intellectual Theft',
        votes: 11950,
        status: 'CHANGE OF HEART CONFIRMED',
        statusCode: 'completed',
        summary: 'Renowned Japanese artist stealing artworks from his impoverished pupils and claiming them as his own.',
        details: 'Dozens of young disciples had their lives ruined while Madarame made millions selling plagiarized masterworks.',
        submittedBy: 'Disillusioned_Pupil',
        date: '2026-05-18',
        dangerLevel: 'RANK S'
      },
      {
        id: 'req-3',
        title: 'Shibuya Underage Extortion Ring',
        target: 'Junya Kaneshiro',
        category: 'Extortion / Organized Crime',
        votes: 9840,
        status: 'CHANGE OF HEART CONFIRMED',
        statusCode: 'completed',
        summary: 'Mafia boss trapping high school students in debts and forcing them into illicit courier delivery.',
        details: 'Operates in the shadows of Shibuya central street. Threatens family members of victims if they attempt to contact the police.',
        submittedBy: 'Anonymous_Student',
        date: '2026-06-25',
        dangerLevel: 'RANK SS'
      },
      {
        id: 'req-4',
        title: 'Corporate Sweatshop CEO & Worker Exploitation',
        target: 'Kunazu Okumura',
        category: 'Labor Abuse / Malpractice',
        votes: 18500,
        status: 'CHANGE OF HEART CONFIRMED',
        statusCode: 'completed',
        summary: 'Fast-food empire magnate working employees to extreme exhaustion and bribing labor inspectors.',
        details: 'Over 20 cases of severe employee hospitalizations due to overtime. Denies all unionization attempts.',
        submittedBy: 'Burger_Staff_Union',
        date: '2026-09-02',
        dangerLevel: 'RANK SS'
      },
      {
        id: 'req-5',
        title: 'Predatory Pet Abuser in Yongen-Jaya',
        target: 'Takanori Jochi',
        category: 'Cruelty to Animals / Harassment',
        votes: 3410,
        status: 'TARGET LOCKED',
        statusCode: 'investigating',
        summary: 'Local resident repeatedly poisoning neighborhood stray cats and threatening elders.',
        details: 'Reports from residents near the back-alley laundromat. Multiple witnesses confirmed suspicious traps set late at night.',
        submittedBy: 'Cat_Lover_Yongen',
        date: '2026-09-10',
        dangerLevel: 'RANK B'
      },
      {
        id: 'req-6',
        title: 'Online Romance Scammer Impersonating Celebrities',
        target: 'Kazuo Shimizu',
        category: 'Cyber Fraud / Identity Theft',
        votes: 1890,
        status: 'UNDER REVIEW',
        statusCode: 'pending',
        summary: 'Stealing retirement savings from elderly citizens across Tokyo via fake social media accounts.',
        details: 'Over 12 million yen stolen in recent months. The victims are left destitute and police claim lack of cyber jurisdiction.',
        submittedBy: 'Victim_Relative',
        date: '2026-09-12',
        dangerLevel: 'RANK A'
      }
    ];
  }

  saveRequests() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.requests));
    localStorage.setItem('phansite_voted_requests', JSON.stringify([...this.votedRequestIds]));
  }

  init() {
    this.renderRequestsList();
    this.bindEvents();
  }

  bindEvents() {
    const filterButtons = document.querySelectorAll('.request-filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (window.phansiteAudio) window.phansiteAudio.playSfx('click');
        filterButtons.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const filter = btn.getAttribute('data-filter');
        this.renderRequestsList(filter);
      });
    });

    const submitForm = document.getElementById('new-target-form');
    if (submitForm) {
      submitForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleNewTargetSubmit();
      });
    }
  }

  renderRequestsList(filter = 'all') {
    const container = document.getElementById('requests-table-body');
    if (!container) return;

    let list = this.requests;
    if (filter === 'completed') {
      list = list.filter(r => r.statusCode === 'completed');
    } else if (filter === 'active') {
      list = list.filter(r => r.statusCode !== 'completed');
    }

    container.innerHTML = list.map((r, index) => {
      const isVoted = this.votedRequestIds.has(r.id);
      const statusBadgeClass = `badge-status-${r.statusCode}`;

      return `
        <tr class="request-table-row" data-id="${r.id}">
          <td class="col-num">${String(index + 1).padStart(2, '0')}</td>
          <td class="col-target">
            <span class="target-name">${this.escapeHTML(r.target)}</span>
            <span class="target-category">${this.escapeHTML(r.category)}</span>
          </td>
          <td class="col-title">
            <a href="javascript:void(0)" class="target-link" onclick="phansiteRequests.openDetail('${r.id}')">
              ${this.escapeHTML(r.title)}
            </a>
          </td>
          <td class="col-status">
            <span class="request-status-pill ${statusBadgeClass}">${r.status}</span>
          </td>
          <td class="col-votes">
            <button class="btn-vote-request ${isVoted ? 'is-voted' : ''}" onclick="phansiteRequests.toggleVote('${r.id}', event)">
              <span class="vote-icon">★</span>
              <span class="vote-count">${r.votes.toLocaleString()}</span>
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  toggleVote(id, event) {
    if (event) event.stopPropagation();
    const req = this.requests.find(r => r.id === id);
    if (!req) return;

    if (this.votedRequestIds.has(id)) {
      this.votedRequestIds.delete(id);
      req.votes = Math.max(0, req.votes - 1);
      if (window.phansiteAudio) window.phansiteAudio.playSfx('click');
      if (window.phansiteApp) window.phansiteApp.showToast('VOTE WITHDRAWN', 'info');
    } else {
      this.votedRequestIds.add(id);
      req.votes += 1;
      if (window.phansiteAudio) window.phansiteAudio.playSfx('target');
      if (window.phansiteApp) window.phansiteApp.showToast(`VOTED FOR TARGET: ${req.target.toUpperCase()}`, 'success');
    }

    this.saveRequests();
    const activeFilter = document.querySelector('.request-filter-btn.is-active')?.getAttribute('data-filter') || 'all';
    this.renderRequestsList(activeFilter);

    // Also update detail modal if open
    const modal = document.getElementById('target-detail-modal');
    if (modal && !modal.classList.contains('is-hidden')) {
      const voteCountEl = document.getElementById('detail-vote-count');
      if (voteCountEl) voteCountEl.textContent = req.votes.toLocaleString();
    }
  }

  openDetail(id) {
    const req = this.requests.find(r => r.id === id);
    if (!req) return;

    if (window.phansiteAudio) window.phansiteAudio.playSfx('select');

    const modal = document.getElementById('target-detail-modal');
    if (!modal) return;

    document.getElementById('detail-target-name').textContent = req.target;
    document.getElementById('detail-target-title').textContent = req.title;
    document.getElementById('detail-category').textContent = req.category;
    document.getElementById('detail-status').textContent = req.status;
    document.getElementById('detail-status').className = `request-status-pill badge-status-${req.statusCode}`;
    document.getElementById('detail-danger').textContent = req.dangerLevel || 'RANK A';
    document.getElementById('detail-summary').textContent = req.summary;
    document.getElementById('detail-description').textContent = req.details;
    document.getElementById('detail-submitted-by').textContent = req.submittedBy;
    document.getElementById('detail-date').textContent = req.date;
    document.getElementById('detail-vote-count').textContent = req.votes.toLocaleString();

    const voteBtn = document.getElementById('detail-vote-btn');
    if (voteBtn) {
      const isVoted = this.votedRequestIds.has(req.id);
      voteBtn.classList.toggle('is-voted', isVoted);
      voteBtn.onclick = (e) => this.toggleVote(req.id, e);
    }

    modal.classList.remove('is-hidden');
  }

  closeDetail() {
    if (window.phansiteAudio) window.phansiteAudio.playSfx('click');
    const modal = document.getElementById('target-detail-modal');
    if (modal) modal.classList.add('is-hidden');
  }

  openNewTargetModal() {
    if (window.phansiteAudio) window.phansiteAudio.playSfx('select');
    const modal = document.getElementById('new-target-modal');
    if (modal) modal.classList.remove('is-hidden');
  }

  closeNewTargetModal() {
    if (window.phansiteAudio) window.phansiteAudio.playSfx('click');
    const modal = document.getElementById('new-target-modal');
    if (modal) modal.classList.add('is-hidden');
  }

  handleNewTargetSubmit() {
    const targetInput = document.getElementById('input-target-name');
    const titleInput = document.getElementById('input-target-crime');
    const detailsInput = document.getElementById('input-target-details');

    if (!targetInput || !titleInput || !detailsInput) return;

    const target = targetInput.value.trim();
    const title = titleInput.value.trim();
    const details = detailsInput.value.trim();

    if (!target || !title || !details) {
      if (window.phansiteApp) window.phansiteApp.showToast('PLEASE FILL IN ALL TARGET INTEL FIELDS', 'error');
      return;
    }

    const newReq = {
      id: 'req-' + Date.now(),
      title: title,
      target: target,
      category: 'Citizen Report / Unverified',
      votes: 1,
      status: 'UNDER REVIEW',
      statusCode: 'pending',
      summary: title,
      details: details,
      submittedBy: window.phansiteChat ? window.phansiteChat.getCurrentUser() : 'Phantom_Aficionado',
      date: new Date().toISOString().split('T')[0],
      dangerLevel: 'RANK B'
    };

    this.requests.unshift(newReq);
    this.votedRequestIds.add(newReq.id);
    this.saveRequests();

    targetInput.value = '';
    titleInput.value = '';
    detailsInput.value = '';

    this.closeNewTargetModal();
    this.renderRequestsList();

    if (window.phansiteAudio) window.phansiteAudio.playSfx('target');
    if (window.phansiteApp) {
      window.phansiteApp.showToast('TARGET REPORTED! MISHIMA HAS LOGGED THE REQUEST.', 'success');
    }
  }

  escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }
}

window.phansiteRequests = new PhansiteRequests();
