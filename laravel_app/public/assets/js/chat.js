/**
 * Persona 5 Phansite - Live Chat & Message Board
 * Authentic slanted Persona 5 comic dialog bubbles, channels, and simulated live chatter
 */

class PhansiteChat {
  constructor() {
    this.storageKey = 'phansite_chat_messages_v1';
    this.currentChannel = 'general';
    this.ambientChatInterval = null;

    this.defaultMessages = [
      {
        id: 'msg-1',
        channel: 'general',
        username: 'Mishima_Admin',
        role: 'Admin',
        avatar: 'red-star',
        timestamp: '10:14 AM',
        content: 'Welcome to the Phansite! This is the official hub for supporters of the Phantom Thieves of Hearts. Share the truth!',
        isSelf: false
      },
      {
        id: 'msg-2',
        channel: 'general',
        username: 'Shibuya_Student',
        role: 'Public',
        avatar: 'mask',
        timestamp: '10:22 AM',
        content: 'Did anyone see Kamoshida crying on the gym floor?! It really happened!! The Phantom Thieves are real!!',
        isSelf: false
      },
      {
        id: 'msg-3',
        channel: 'general',
        username: 'Tokyo_Skeptic_99',
        role: 'Public',
        avatar: 'user',
        timestamp: '10:35 AM',
        content: 'Come on, brainwashing? Hypnosis? There has to be a scientific explanation for this whole change of heart nonsense.',
        isSelf: false
      },
      {
        id: 'msg-4',
        channel: 'general',
        username: 'Yongene_Local',
        role: 'Public',
        avatar: 'coffee',
        timestamp: '11:05 AM',
        content: 'If they can stop criminals that the police won\'t touch, I don\'t care how they do it. Take their hearts!',
        isSelf: false
      },
      {
        id: 'msg-5',
        channel: 'general',
        username: 'Alibaba',
        role: 'Phantom',
        avatar: 'thief',
        timestamp: '11:18 AM',
        content: 'The Phantom Thieves do not seek fame. Justice will be served in the shadows.',
        isSelf: false
      },
      {
        id: 'msg-6',
        channel: 'requests-chat',
        username: 'Desperate_Worker',
        role: 'Public',
        avatar: 'user',
        timestamp: '09:40 AM',
        content: 'Please look at my boss in Shinjuku. He forces 16-hour unpaid overtime every single day. We are dying here.',
        isSelf: false
      },
      {
        id: 'msg-7',
        channel: 'requests-chat',
        username: 'Mishima_Admin',
        role: 'Admin',
        avatar: 'red-star',
        timestamp: '09:55 AM',
        content: 'Added to the review queue. Upvote the post in the Requests tab so the Thieves can investigate!',
        isSelf: false
      }
    ];

    this.ambientPool = [
      { username: 'ArcadeGamer_X', content: 'Saw someone in a black trench coat near the station... wait nevermind, just a cosplayer.' },
      { username: 'CurryEnthusiast', content: 'Leblanc\'s coffee aroma is carrying me through finals week. Highly recommended.' },
      { username: 'Anonymous_Tokyo', content: 'The calling card on the billboard this morning was legendary!' },
      { username: 'LawStudent_22', content: 'From a legal standpoint, what even IS a change of heart?! Prosecution is baffled.' },
      { username: 'Mementos_Explorer', content: 'Has anyone else heard train sounds deep under the subway tracks when no trains are running?' },
      { username: 'Gothic_Doctor_Fan', content: 'Back alley clinic in Yongen-Jaya has the best medicine, no joke.' },
      { username: 'Akechi_FanClub', content: 'Goro Akechi said on TV yesterday that vigilante justice is dangerous! Listen to him!' }
    ];

    this.messages = this.loadMessages();
    this.init();
  }

  loadMessages() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Failed to parse saved chat", e);
      }
    }
    return [...this.defaultMessages];
  }

  saveMessages() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.messages));
  }

  init() {
    this.renderMessages();
    this.bindEvents();
    this.startAmbientChat();
  }

  bindEvents() {
    const form = document.getElementById('chat-form');
    const input = document.getElementById('chat-input-text');
    const channelButtons = document.querySelectorAll('.chat-channel-btn');

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.sendMessage();
      });
    }

    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });
    }

    channelButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const chan = btn.getAttribute('data-channel');
        if (chan && chan !== this.currentChannel) {
          if (window.phansiteAudio) window.phansiteAudio.playSfx('click');
          this.switchChannel(chan);
        }
      });
    });
  }

  switchChannel(channel) {
    this.currentChannel = channel;
    document.querySelectorAll('.chat-channel-btn').forEach(btn => {
      btn.classList.toggle('is-active', btn.getAttribute('data-channel') === channel);
    });
    this.renderMessages();
  }

  getCurrentUser() {
    const stored = localStorage.getItem('phansite_username');
    return stored ? stored.trim() : 'Phantom_Aficionado';
  }

  sendMessage() {
    const input = document.getElementById('chat-input-text');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    if (window.phansiteAudio) {
      window.phansiteAudio.playSfx('message');
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg = {
      id: 'msg-' + Date.now(),
      channel: this.currentChannel,
      username: this.getCurrentUser(),
      role: 'Aficionado',
      avatar: 'thief',
      timestamp: timeStr,
      content: text,
      isSelf: true
    };

    this.messages.push(newMsg);
    this.saveMessages();
    input.value = '';

    this.renderMessages();
    this.scrollToBottom();

    // Occasional quick bot reply in General chat to simulate lively discussion
    if (Math.random() > 0.4 && this.currentChannel === 'general') {
      setTimeout(() => {
        this.receiveAmbientMessage();
      }, 1800 + Math.random() * 2500);
    }
  }

  receiveAmbientMessage() {
    const pool = this.ambientPool;
    const item = pool[Math.floor(Math.random() * pool.length)];
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const botMsg = {
      id: 'msg-' + Date.now(),
      channel: this.currentChannel,
      username: item.username,
      role: 'Public',
      avatar: 'user',
      timestamp: timeStr,
      content: item.content,
      isSelf: false
    };

    this.messages.push(botMsg);
    this.saveMessages();

    // If user is currently looking at chats, play sound and render
    const chatsSection = document.getElementById('section-chats');
    if (chatsSection && !chatsSection.classList.contains('is-hidden')) {
      if (window.phansiteAudio) window.phansiteAudio.playSfx('message');
      this.renderMessages();
      this.scrollToBottom();
    }
  }

  startAmbientChat() {
    if (this.ambientChatInterval) clearInterval(this.ambientChatInterval);
    this.ambientChatInterval = setInterval(() => {
      // 50% chance to generate chatter every 25 seconds
      if (Math.random() > 0.5) {
        this.receiveAmbientMessage();
      }
    }, 28000);
  }

  renderMessages() {
    const container = document.getElementById('chat-messages-container');
    if (!container) return;

    const filtered = this.messages.filter(m => m.channel === this.currentChannel);

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="chat-empty-state">
          <div class="empty-badge">NO COMMUNIQUE YET</div>
          <p>Be the first Aficionado to break the silence.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(m => {
      const isSelf = m.isSelf || m.username === this.getCurrentUser();
      const roleBadge = m.role ? `<span class="chat-role-badge role-${m.role.toLowerCase()}">${m.role}</span>` : '';
      
      return `
        <div class="chat-bubble-row ${isSelf ? 'is-self' : 'is-other'}" data-id="${m.id}">
          <div class="chat-bubble-card">
            <div class="chat-header">
              <span class="chat-author">${this.escapeHTML(m.username)}</span>
              ${roleBadge}
              <span class="chat-time">${m.timestamp}</span>
            </div>
            <div class="chat-body">
              ${this.escapeHTML(m.content)}
            </div>
          </div>
        </div>
      `;
    }).join('');

    this.scrollToBottom();
  }

  scrollToBottom() {
    const container = document.getElementById('chat-messages-container');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }

  escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }
}

window.phansiteChat = new PhansiteChat();
