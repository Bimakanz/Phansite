/**
 * Persona 5 Phansite - Admin CMS Controller
 * Manages Passcode Authentication, CRUD Operations, and Data Management
 */

class PhansiteAdmin {
  constructor() {
    this.isAuthenticated = false;
    this.currentPin = '';
    this.correctPin = '1234'; // Default Admin passcode
    this.currentAdminTab = 'projects';
    this.activeDeleteAction = null;

    this.init();
  }

  init() {
    // Check existing session
    if (sessionStorage.getItem('phansite_admin_auth') === 'true') {
      this.isAuthenticated = true;
    }

    this.bindEvents();
    
    // Subscribe to store updates
    if (window.phansiteStore) {
      window.phansiteStore.subscribe('change', () => {
        if (this.isAuthenticated) {
          this.renderProjectList();
          this.renderExperienceList();
          this.updateDashboardStats();
        }
      });
    }
  }

  bindEvents() {
    // Safe Keypad buttons
    document.querySelectorAll('.admin-keypad-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.getAttribute('data-val');
        if (val === 'clear') {
          this.clearPin();
        } else if (val === 'submit') {
          this.verifyPin();
        } else if (val) {
          this.appendPin(val);
        }
      });
    });

    // Admin Navigation Tabs
    document.querySelectorAll('.admin-nav-tab').forEach(tabBtn => {
      tabBtn.addEventListener('click', () => {
        const tab = tabBtn.getAttribute('data-admin-tab');
        this.switchAdminTab(tab);
      });
    });

    // Project Form Submit
    const projForm = document.getElementById('admin-project-form');
    if (projForm) {
      projForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveProjectFromForm();
      });
    }

    // Experience Form Submit
    const expForm = document.getElementById('admin-experience-form');
    if (expForm) {
      expForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveExperienceFromForm();
      });
    }

    // Certificate Form Submit
    const certForm = document.getElementById('admin-cert-form');
    if (certForm) {
      certForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveCertificateFromForm();
      });
    }

    // JSON Import File Input
    const importInput = document.getElementById('admin-import-file');
    if (importInput) {
      importInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            try {
              window.phansiteStore.importJSON(event.target.result);
              this.showToast('DATA RESTORED FROM METAVERSE ARCHIVE!', 'success');
              if (window.phansiteAudio) window.phansiteAudio.playSfx('level_upgrade');
            } catch (err) {
              this.showToast('INVALID METAVERSE ARCHIVE FILE!', 'error');
            }
          };
          reader.readAsText(file);
        }
      });
    }
  }

  // --- AUTHENTICATION & SAFE KEYPAD ---
  openAdminModal() {
    if (window.phansiteAudio) window.phansiteAudio.playSfx('select');
    const modal = document.getElementById('admin-cms-modal');
    if (!modal) return;
    
    modal.classList.remove('is-hidden');

    if (this.isAuthenticated) {
      this.showDashboard();
    } else {
      this.showKeypad();
    }
  }

  closeAdminModal() {
    if (window.phansiteAudio) window.phansiteAudio.playSfx('click');
    const modal = document.getElementById('admin-cms-modal');
    if (modal) modal.classList.add('is-hidden');
    this.clearPin();
  }

  showKeypad() {
    document.getElementById('admin-keypad-panel')?.classList.remove('is-hidden');
    document.getElementById('admin-dashboard-panel')?.classList.add('is-hidden');
    this.clearPin();
  }

  showDashboard() {
    document.getElementById('admin-keypad-panel')?.classList.add('is-hidden');
    document.getElementById('admin-dashboard-panel')?.classList.remove('is-hidden');
    this.updateDashboardStats();
    this.renderProjectList();
    this.renderExperienceList();
  }

  appendPin(digit) {
    if (this.currentPin.length < 6) {
      this.currentPin += digit;
      this.updatePinDisplay();
      if (window.phansiteAudio) window.phansiteAudio.playSfx('click');
    }
  }

  clearPin() {
    this.currentPin = '';
    this.updatePinDisplay();
    if (window.phansiteAudio) window.phansiteAudio.playSfx('switch');
  }

  updatePinDisplay() {
    const dots = document.querySelectorAll('.admin-pin-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('is-filled', index < this.currentPin.length);
    });
  }

  verifyPin() {
    if (this.currentPin === this.correctPin) {
      this.isAuthenticated = true;
      sessionStorage.setItem('phansite_admin_auth', 'true');
      if (window.phansiteAudio) window.phansiteAudio.playSfx('level_upgrade');
      this.showToast('SECURITY BYPASSED. WELCOME, COGNITIVE OPERATOR.', 'success');
      this.showDashboard();
    } else {
      if (window.phansiteAudio) window.phansiteAudio.playSfx('notification');
      this.showToast('ACCESS DENIED: INCORRECT PASSCODE!', 'error');
      
      const pad = document.getElementById('admin-keypad-panel');
      if (pad) {
        pad.classList.add('p5-shake');
        setTimeout(() => pad.classList.remove('p5-shake'), 500);
      }
      this.clearPin();
    }
  }

  logout() {
    this.isAuthenticated = false;
    sessionStorage.removeItem('phansite_admin_auth');
    if (window.phansiteAudio) window.phansiteAudio.playSfx('switch');
    this.showToast('LOGGED OUT FROM COGNITIVE CMS', 'info');
    this.showKeypad();
  }

  switchAdminTab(tabName) {
    this.currentAdminTab = tabName;
    if (window.phansiteAudio) window.phansiteAudio.playSfx('tab_slash');

    document.querySelectorAll('.admin-nav-tab').forEach(btn => {
      btn.classList.toggle('is-active', btn.getAttribute('data-admin-tab') === tabName);
    });

    document.querySelectorAll('.admin-view-content').forEach(view => {
      if (view.id === `admin-view-${tabName}`) {
        view.classList.remove('is-hidden');
      } else {
        view.classList.add('is-hidden');
      }
    });
  }

  updateDashboardStats() {
    const projects = window.phansiteStore.getProjects();
    const experiences = window.phansiteStore.getExperiences();
    const certificates = window.phansiteStore.getCertificates();

    const elProjCount = document.getElementById('admin-stat-projects');
    const elExpCount = document.getElementById('admin-stat-exp');
    const elCertCount = document.getElementById('admin-stat-cert');

    if (elProjCount) elProjCount.textContent = projects.length;
    if (elExpCount) elExpCount.textContent = experiences.length;
    if (elCertCount) elCertCount.textContent = certificates.length;
  }

  // --- PROJECT CRUD UI ---
  renderProjectList() {
    const container = document.getElementById('admin-projects-table-body');
    if (!container) return;

    const projects = window.phansiteStore.getProjects();
    if (projects.length === 0) {
      container.innerHTML = `
        <tr>
          <td colspan="5" class="admin-table-empty">
            <div class="empty-state-p5">NO ACTIVE TARGETS IN DATABASE. METAVERSE IS SILENT.</div>
          </td>
        </tr>
      `;
      return;
    }

    container.innerHTML = projects.map((p, idx) => `
      <tr>
        <td class="col-index">#${idx + 1}</td>
        <td class="col-title">
          <div class="admin-item-title-row">
            <img src="${p.image || 'assets/img/joker_mask.png'}" class="admin-item-thumbnail" alt="thumbnail" onerror="this.src='assets/img/joker_mask.png'" />
            <div>
              <strong>${this.escapeHtml(p.title)}</strong>
              <div class="admin-tech-tags-mini">
                ${(p.tech || []).map(t => `<span class="admin-badge">${this.escapeHtml(t)}</span>`).join('')}
              </div>
            </div>
          </div>
        </td>
        <td class="col-desc">${this.escapeHtml(p.description).substring(0, 75)}...</td>
        <td class="col-date">${p.createdAt ? p.createdAt.split('T')[0] : 'N/A'}</td>
        <td class="col-actions">
          <button class="admin-btn-action btn-edit" onclick="phansiteAdmin.openProjectFormModal('${p.id}')" title="Edit Target">✎ EDIT</button>
          <button class="admin-btn-action btn-delete" onclick="phansiteAdmin.confirmDelete('project', '${p.id}', '${this.escapeHtml(p.title)}')" title="Eliminate Target">✖ DEL</button>
        </td>
      </tr>
    `).join('');
  }

  openProjectFormModal(projectId = null) {
    if (window.phansiteAudio) window.phansiteAudio.playSfx('select');
    const modal = document.getElementById('admin-project-form-modal');
    const form = document.getElementById('admin-project-form');
    if (!modal || !form) return;

    form.reset();
    document.getElementById('proj-form-id').value = '';
    const modalTitle = document.getElementById('proj-form-modal-title');

    if (projectId) {
      modalTitle.textContent = 'TARGET PROTOCOL: EDIT TARGET';
      const project = window.phansiteStore.getProjectById(projectId);
      if (project) {
        document.getElementById('proj-form-id').value = project.id;
        document.getElementById('proj-input-title').value = project.title || '';
        document.getElementById('proj-input-desc').value = project.description || '';
        document.getElementById('proj-input-image').value = project.image || '';
        document.getElementById('proj-input-live').value = project.liveUrl || '';
        document.getElementById('proj-input-repo').value = project.repoUrl || '';
        document.getElementById('proj-input-tech').value = (project.tech || []).join(', ');
      }
    } else {
      modalTitle.textContent = 'TARGET PROTOCOL: ISSUE NEW CALLING CARD';
    }

    modal.classList.remove('is-hidden');
  }

  closeProjectFormModal() {
    if (window.phansiteAudio) window.phansiteAudio.playSfx('click');
    document.getElementById('admin-project-form-modal')?.classList.add('is-hidden');
  }

  saveProjectFromForm() {
    const id = document.getElementById('proj-form-id').value.trim();
    const title = document.getElementById('proj-input-title').value.trim();
    const description = document.getElementById('proj-input-desc').value.trim();
    const image = document.getElementById('proj-input-image').value.trim() || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80';
    const liveUrl = document.getElementById('proj-input-live').value.trim();
    const repoUrl = document.getElementById('proj-input-repo').value.trim();
    const techRaw = document.getElementById('proj-input-tech').value.trim();

    if (!title || !description) {
      this.showToast('Target Title & Crime Description are required!', 'error');
      return;
    }

    const tech = techRaw ? techRaw.split(',').map(t => t.trim()).filter(Boolean) : ['Web'];

    const projectData = {
      title,
      description,
      image,
      liveUrl,
      repoUrl,
      tech
    };

    if (id) projectData.id = id;

    window.phansiteStore.saveProject(projectData);
    if (window.phansiteAudio) window.phansiteAudio.playSfx('level_upgrade');
    this.showToast(id ? 'TARGET PROTOCOL UPDATED!' : 'NEW TARGET POSTED TO PHANSITE!', 'success');
    this.closeProjectFormModal();
  }

  // --- EXPERIENCE & CERTIFICATE CRUD UI ---
  renderExperienceList() {
    const expContainer = document.getElementById('admin-experience-list');
    const certContainer = document.getElementById('admin-cert-list');

    if (expContainer) {
      const experiences = window.phansiteStore.getExperiences();
      if (experiences.length === 0) {
        expContainer.innerHTML = '<div class="admin-table-empty">NO CONFIDANT DATA RECORDED.</div>';
      } else {
        expContainer.innerHTML = experiences.map(exp => `
          <div class="admin-card-item">
            <div class="admin-card-header">
              <span class="admin-badge-rank">${this.escapeHtml(exp.rank || 'RANK 1')} // ${this.escapeHtml(exp.arcana || 'CONFIDANT')}</span>
              <div class="admin-card-actions">
                <button class="admin-btn-action btn-edit" onclick="phansiteAdmin.openExperienceFormModal('${exp.id}')">EDIT</button>
                <button class="admin-btn-action btn-delete" onclick="phansiteAdmin.confirmDelete('experience', '${exp.id}', '${this.escapeHtml(exp.role)}')">DEL</button>
              </div>
            </div>
            <h4 class="admin-card-title">${this.escapeHtml(exp.role)} @ <span class="text-red">${this.escapeHtml(exp.company)}</span></h4>
            <div class="admin-card-meta">${this.escapeHtml(exp.period)}</div>
            <p class="admin-card-desc">${this.escapeHtml(exp.description)}</p>
            <div class="admin-tech-tags-mini">
              ${(exp.skills || []).map(s => `<span class="admin-badge">${this.escapeHtml(s)}</span>`).join('')}
            </div>
          </div>
        `).join('');
      }
    }

    if (certContainer) {
      const certificates = window.phansiteStore.getCertificates();
      if (certificates.length === 0) {
        certContainer.innerHTML = '<div class="admin-table-empty">NO CERTIFICATES RECORDED.</div>';
      } else {
        certContainer.innerHTML = certificates.map(cert => `
          <div class="admin-card-item cert-item">
            <div class="admin-card-header">
              <span class="admin-badge-rank">${this.escapeHtml(cert.arcana || 'TAROT')} (${this.escapeHtml(cert.year)})</span>
              <div class="admin-card-actions">
                <button class="admin-btn-action btn-delete" onclick="phansiteAdmin.confirmDelete('certificate', '${cert.id}', '${this.escapeHtml(cert.title)}')">DEL</button>
              </div>
            </div>
            <h4 class="admin-card-title">${this.escapeHtml(cert.title)}</h4>
            <div class="admin-card-meta">ISSUER: ${this.escapeHtml(cert.issuer)}</div>
            ${cert.credentialUrl ? `<a href="${cert.credentialUrl}" target="_blank" class="admin-link-external">VIEW CREDENTIAL ↗</a>` : ''}
          </div>
        `).join('');
      }
    }
  }

  openExperienceFormModal(expId = null) {
    if (window.phansiteAudio) window.phansiteAudio.playSfx('select');
    const modal = document.getElementById('admin-experience-form-modal');
    const form = document.getElementById('admin-experience-form');
    if (!modal || !form) return;

    form.reset();
    document.getElementById('exp-form-id').value = '';

    if (expId) {
      const exp = window.phansiteStore.getExperiences().find(e => e.id === expId);
      if (exp) {
        document.getElementById('exp-form-id').value = exp.id;
        document.getElementById('exp-input-role').value = exp.role || '';
        document.getElementById('exp-input-company').value = exp.company || '';
        document.getElementById('exp-input-period').value = exp.period || '';
        document.getElementById('exp-input-rank').value = exp.rank || '';
        document.getElementById('exp-input-arcana').value = exp.arcana || '';
        document.getElementById('exp-input-desc').value = exp.description || '';
        document.getElementById('exp-input-skills').value = (exp.skills || []).join(', ');
      }
    }

    modal.classList.remove('is-hidden');
  }

  closeExperienceFormModal() {
    if (window.phansiteAudio) window.phansiteAudio.playSfx('click');
    document.getElementById('admin-experience-form-modal')?.classList.add('is-hidden');
  }

  saveExperienceFromForm() {
    const id = document.getElementById('exp-form-id').value.trim();
    const role = document.getElementById('exp-input-role').value.trim();
    const company = document.getElementById('exp-input-company').value.trim();
    const period = document.getElementById('exp-input-period').value.trim();
    const rank = document.getElementById('exp-input-rank').value.trim() || 'RANK 5';
    const arcana = document.getElementById('exp-input-arcana').value.trim() || 'THE FOOL';
    const description = document.getElementById('exp-input-desc').value.trim();
    const skillsRaw = document.getElementById('exp-input-skills').value.trim();

    if (!role || !company) {
      this.showToast('Role and Organization/Company are required!', 'error');
      return;
    }

    const skills = skillsRaw ? skillsRaw.split(',').map(s => s.trim()).filter(Boolean) : [];

    const expData = {
      role,
      company,
      period,
      rank,
      arcana,
      description,
      skills
    };

    if (id) expData.id = id;

    window.phansiteStore.saveExperience(expData);
    if (window.phansiteAudio) window.phansiteAudio.playSfx('level_upgrade');
    this.showToast('CONFIDANT EXPERIENCE RECORDED!', 'success');
    this.closeExperienceFormModal();
  }

  openCertFormModal() {
    if (window.phansiteAudio) window.phansiteAudio.playSfx('select');
    const modal = document.getElementById('admin-cert-form-modal');
    if (modal) {
      document.getElementById('admin-cert-form')?.reset();
      modal.classList.remove('is-hidden');
    }
  }

  closeCertFormModal() {
    if (window.phansiteAudio) window.phansiteAudio.playSfx('click');
    document.getElementById('admin-cert-form-modal')?.classList.add('is-hidden');
  }

  saveCertificateFromForm() {
    const title = document.getElementById('cert-input-title').value.trim();
    const issuer = document.getElementById('cert-input-issuer').value.trim();
    const year = document.getElementById('cert-input-year').value.trim() || '2026';
    const arcana = document.getElementById('cert-input-arcana').value.trim() || 'STAR';
    const credentialUrl = document.getElementById('cert-input-url').value.trim();

    if (!title || !issuer) {
      this.showToast('Certificate Title and Issuer are required!', 'error');
      return;
    }

    window.phansiteStore.saveCertificate({
      title,
      issuer,
      year,
      arcana,
      credentialUrl
    });

    if (window.phansiteAudio) window.phansiteAudio.playSfx('level_upgrade');
    this.showToast('COMPETENCY CERTIFICATE RECORDED!', 'success');
    this.closeCertFormModal();
  }

  // --- DELETE CONFIRMATION ---
  confirmDelete(type, id, name) {
    if (window.phansiteAudio) window.phansiteAudio.playSfx('notification');
    const modal = document.getElementById('admin-delete-modal');
    const msg = document.getElementById('admin-delete-message');
    if (!modal || !msg) return;

    msg.innerHTML = `Are you certain you wish to purge <strong class="text-red">"${this.escapeHtml(name)}"</strong> from the Cognition Database?`;
    this.activeDeleteAction = () => {
      if (type === 'project') {
        window.phansiteStore.deleteProject(id);
        this.showToast('TARGET PURGED FROM METAVERSE!', 'info');
      } else if (type === 'experience') {
        window.phansiteStore.deleteExperience(id);
        this.showToast('CONFIDANT RECORD PURGED!', 'info');
      } else if (type === 'certificate') {
        window.phansiteStore.deleteCertificate(id);
        this.showToast('CERTIFICATE RECORD PURGED!', 'info');
      }
      this.closeDeleteModal();
    };

    modal.classList.remove('is-hidden');
  }

  executeDelete() {
    if (typeof this.activeDeleteAction === 'function') {
      if (window.phansiteAudio) window.phansiteAudio.playSfx('switch');
      this.activeDeleteAction();
      this.activeDeleteAction = null;
    }
  }

  closeDeleteModal() {
    if (window.phansiteAudio) window.phansiteAudio.playSfx('click');
    document.getElementById('admin-delete-modal')?.classList.add('is-hidden');
    this.activeDeleteAction = null;
  }

  // --- BACKUP & RESET ---
  exportDatabase() {
    if (window.phansiteAudio) window.phansiteAudio.playSfx('select');
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(window.phansiteStore.exportJSON());
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `phansite_metaverse_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    this.showToast('METAVERSE DATA BACKUP DOWNLOADED!', 'success');
  }

  resetDatabase() {
    if (confirm('RESET ALL DATABASE TO ORIGINAL METAVERSE SEED DATA? Any custom records will be overwritten.')) {
      window.phansiteStore.resetToDefault();
      if (window.phansiteAudio) window.phansiteAudio.playSfx('level_upgrade');
      this.showToast('DATABASE RESTORED TO FACTORY COGNITION!', 'success');
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
window.phansiteAdmin = new PhansiteAdmin();
