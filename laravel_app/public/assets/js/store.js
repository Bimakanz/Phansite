/**
 * Persona 5 Phansite - Reactive Data Store
 * Handles persistence, CRUD operations, event subscriptions, and export/import.
 */

const SEED_DATA = {
  projects: [
    {
      id: 'target-01',
      title: 'Metaverse Nexus E-Commerce',
      description: 'Defrauding corrupt merchants in the Shibuya underground. Engineered a blazing fast Next.js & Tailwind shopping platform with Stripe checkout, real-time inventory tracking, and custom P5 checkout animations.',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
      tech: ['React', 'Next.js', 'TailwindCSS', 'Stripe', 'PostgreSQL'],
      liveUrl: 'https://example.com/metaverse-nexus',
      repoUrl: 'https://github.com/example/metaverse-nexus',
      createdAt: '2026-01-15'
    },
    {
      id: 'target-02',
      title: 'Cognitive Palace Task Manager',
      description: 'Restoring distorted cognitive desires into productive workflows. Full-stack Kanban task manager featuring drag-and-drop mechanics, WebSocket real-time collaboration, and role-based permissions.',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      tech: ['Laravel', 'Vue.js', 'TailwindCSS', 'Redis', 'MySQL'],
      liveUrl: 'https://example.com/palace-tasks',
      repoUrl: 'https://github.com/example/palace-tasks',
      createdAt: '2026-02-20'
    },
    {
      id: 'target-03',
      title: 'Phantom Aficionado Audio Synthesizer',
      description: 'Audio processing and soundscape player replicating Persona 5 Royal sound mechanics. Built with the Web Audio API, responsive waveforms, and authentic soundfont sequencing.',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
      tech: ['JavaScript (ES6+)', 'Web Audio API', 'CSS3 Neo-Brutalism', 'HTML5 Canvas'],
      liveUrl: 'https://example.com/p5-synth',
      repoUrl: 'https://github.com/example/p5-synth',
      createdAt: '2026-03-05'
    }
  ],
  experiences: [
    {
      id: 'exp-01',
      role: 'Lead Full-Stack Infiltrator',
      company: 'Phantom Studio Lab',
      period: '2024 - Present',
      rank: 'RANK 10 (MAX)',
      arcana: 'THE FOOL',
      description: 'Architected high-performance web applications, led frontend transition to modern reactive frameworks, and optimized Lighthouse performance scores to 99+.',
      skills: ['React', 'Next.js', 'Node.js', 'Architecture']
    },
    {
      id: 'exp-02',
      role: 'Frontend Software Craftsman',
      company: 'Cognitive Systems Corp',
      period: '2022 - 2024',
      rank: 'RANK 8',
      arcana: 'THE MAGICIAN',
      description: 'Developed responsive user interfaces, built reusable design component libraries with Tailwind CSS, and integrated complex RESTful API endpoints.',
      skills: ['JavaScript', 'TailwindCSS', 'REST APIs', 'UI/UX']
    },
    {
      id: 'exp-03',
      role: 'Web Development Specialist',
      company: 'Shibuya Creative Tech',
      period: '2021 - 2022',
      rank: 'RANK 5',
      arcana: 'THE CHARIOT',
      description: 'Collaborated on client-facing portfolio sites, built interactive web animations, and ensured cross-browser compatibility across mobile and desktop devices.',
      skills: ['HTML5', 'CSS3', 'Vanilla JS', 'Git']
    }
  ],
  certificates: [
    {
      id: 'cert-01',
      title: 'Metaverse Full-Stack Engineer Certification',
      issuer: 'Cognitive Computing Institute',
      year: '2025',
      arcana: 'JUDGEMENT',
      credentialUrl: 'https://example.com/cert/fullstack-2025'
    },
    {
      id: 'cert-02',
      title: 'Advanced React & Architecture Master',
      issuer: 'Frontend Phantom Academy',
      year: '2024',
      arcana: 'STAR',
      credentialUrl: 'https://example.com/cert/react-master-2024'
    },
    {
      id: 'cert-03',
      title: 'Certified Cloud & Security Practitioner',
      issuer: 'Global Cloud Council',
      year: '2023',
      arcana: 'HERMIT',
      credentialUrl: 'https://example.com/cert/cloud-2023'
    }
  ]
};

class PhansiteStore {
  constructor() {
    this.storageKey = 'phansite_cms_v1';
    this.listeners = new Map();
    this.data = this.loadData();
  }

  loadData() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse local storage, fallback to seed:', e);
    }
    this.saveData(SEED_DATA);
    return JSON.parse(JSON.stringify(SEED_DATA));
  }

  saveData(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      this.data = data;
      this.emit('change', this.data);
    } catch (e) {
      console.error('Error saving data to localStorage:', e);
    }
  }

  emit(event, payload) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => {
        try {
          cb(payload);
        } catch (err) {
          console.error(`Error in listener for ${event}:`, err);
        }
      });
    }
  }

  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => {
      this.listeners.get(event).delete(callback);
    };
  }

  // --- PROJECTS CRUD ---
  getProjects() {
    return this.data.projects || [];
  }

  getProjectById(id) {
    return this.getProjects().find(p => p.id === id);
  }

  saveProject(projectData) {
    const projects = [...this.getProjects()];
    if (projectData.id) {
      const idx = projects.findIndex(p => p.id === projectData.id);
      if (idx !== -1) {
        projects[idx] = { ...projects[idx], ...projectData, updatedAt: new Date().toISOString() };
      } else {
        projects.unshift({ ...projectData, createdAt: new Date().toISOString() });
      }
    } else {
      const newId = 'target-' + Date.now();
      projects.unshift({
        ...projectData,
        id: newId,
        createdAt: new Date().toISOString()
      });
    }
    this.saveData({ ...this.data, projects });
    this.emit('projects:change', projects);
    return true;
  }

  deleteProject(id) {
    const projects = this.getProjects().filter(p => p.id !== id);
    this.saveData({ ...this.data, projects });
    this.emit('projects:change', projects);
    return true;
  }

  // --- EXPERIENCES CRUD ---
  getExperiences() {
    return this.data.experiences || [];
  }

  saveExperience(expData) {
    const experiences = [...this.getExperiences()];
    if (expData.id) {
      const idx = experiences.findIndex(e => e.id === expData.id);
      if (idx !== -1) {
        experiences[idx] = { ...experiences[idx], ...expData };
      } else {
        experiences.unshift(expData);
      }
    } else {
      experiences.unshift({
        ...expData,
        id: 'exp-' + Date.now()
      });
    }
    this.saveData({ ...this.data, experiences });
    this.emit('experiences:change', experiences);
    return true;
  }

  deleteExperience(id) {
    const experiences = this.getExperiences().filter(e => e.id !== id);
    this.saveData({ ...this.data, experiences });
    this.emit('experiences:change', experiences);
    return true;
  }

  // --- CERTIFICATES CRUD ---
  getCertificates() {
    return this.data.certificates || [];
  }

  saveCertificate(certData) {
    const certificates = [...this.getCertificates()];
    if (certData.id) {
      const idx = certificates.findIndex(c => c.id === certData.id);
      if (idx !== -1) {
        certificates[idx] = { ...certificates[idx], ...certData };
      } else {
        certificates.unshift(certData);
      }
    } else {
      certificates.unshift({
        ...certData,
        id: 'cert-' + Date.now()
      });
    }
    this.saveData({ ...this.data, certificates });
    this.emit('certificates:change', certificates);
    return true;
  }

  deleteCertificate(id) {
    const certificates = this.getCertificates().filter(c => c.id !== id);
    this.saveData({ ...this.data, certificates });
    this.emit('certificates:change', certificates);
    return true;
  }

  // --- RESET & EXPORT / IMPORT ---
  resetToDefault() {
    this.saveData(JSON.parse(JSON.stringify(SEED_DATA)));
    this.emit('projects:change', this.data.projects);
    this.emit('experiences:change', this.data.experiences);
    this.emit('certificates:change', this.data.certificates);
    return true;
  }

  exportJSON() {
    return JSON.stringify(this.data, null, 2);
  }

  importJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed === 'object') {
        this.saveData({
          projects: Array.isArray(parsed.projects) ? parsed.projects : [],
          experiences: Array.isArray(parsed.experiences) ? parsed.experiences : [],
          certificates: Array.isArray(parsed.certificates) ? parsed.certificates : []
        });
        return true;
      }
    } catch (e) {
      console.error('Invalid JSON imported:', e);
      throw new Error('Invalid JSON format');
    }
    return false;
  }
}

// Global instance
window.phansiteStore = new PhansiteStore();
