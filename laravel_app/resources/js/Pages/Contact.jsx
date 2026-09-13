import { Head } from '@inertiajs/react';
import P5RLayout from '@/Layouts/P5RLayout';
import { useState } from 'react';
import { audioEngine, showToast } from '@/audio';

// Deterministic Ransom Letter styling replica from Figma Frame
function RansomText({ text, size = 'medium' }) {
    if (!text || !text.trim()) return null;
    const words = text.trim().split(/\s+/);

    const getCharStyle = (char, charIdx, wordIdx) => {
        const seed = (wordIdx * 7 + charIdx * 13) % 11;
        const rotations = [-3.5, 2, -1.8, 3.2, -4, 1.5, 2.8, -2.5, 3.8, -1.2, 2.2];
        const rot = rotations[seed];
        
        // P5 aesthetic: uppercase L, vowels, or periodic accents are vibrant red
        const upper = char.toUpperCase();
        const isRedLetter = (seed % 4 === 0) || ['L', 'P', 'E', 'O', 'A'].includes(upper);
        const isInverseCard = seed === 7;

        return {
            transform: `rotate(${rot}deg)`,
            backgroundColor: isInverseCard ? '#ffffff' : '#000000',
            color: isInverseCard ? '#000000' : (isRedLetter ? '#e60012' : '#ffffff'),
            borderColor: isInverseCard ? '#000000' : '#ffffff',
        };
    };

    return (
        <div className={`p5-ransom-container p5-ransom-${size}`}>
            {words.map((word, wIdx) => (
                <span key={wIdx} className="p5-ransom-word">
                    {word.split('').map((char, cIdx) => (
                        <span
                            key={cIdx}
                            className="p5-ransom-char"
                            style={getCharStyle(char, cIdx, wIdx)}
                        >
                            {char}
                        </span>
                    ))}
                </span>
            ))}
        </div>
    );
}

export default function Contact({ remainingQuota = 3 }) {
    const [quota, setQuota] = useState(remainingQuota);
    const [honeypot, setHoneypot] = useState('');
    const [renderTime] = useState(Math.floor(Date.now() / 1000));
    const [sent, setSent] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('draft'); // 'draft' | 'preview'
    const [form, setForm] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleHover = () => audioEngine.playSfx('hover');

    const handleTabSwitch = (tab) => {
        audioEngine.playSfx('tab');
        setActiveTab(tab);
    };

    const handleSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();

        if (quota <= 0) {
            showToast('DAILY LIMIT REACHED (3/3) // COME BACK TOMORROW!', 'error');
            audioEngine.playSfx('hover');
            return;
        }

        if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
            showToast('PLEASE FILL OUT ALL CALLING CARD FIELDS!', 'error');
            audioEngine.playSfx('hover');
            return;
        }

        setSubmitting(true);
        audioEngine.playSfx('target');
        setTimeout(() => audioEngine.playSfx('important'), 400);

        // Trigger Full Screen Flying Calling Card animation
        if (typeof document !== 'undefined') {
            const flyingCard = document.createElement('div');
            flyingCard.className = 'flying-card-anim';
            flyingCard.innerHTML = `
                <div class="flying-card-inner">
                    <span class="flying-card-text">★ TAKE YOUR HEART ★</span>
                </div>
            `;
            document.body.appendChild(flyingCard);
            setTimeout(() => flyingCard.remove(), 1900);
        }

        try {
            const csrfToken = typeof document !== 'undefined'
                ? document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
                : '';

            const res = await fetch('/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    message: form.message,
                    p5_metaverse_trap: honeypot,
                    _render_time: renderTime,
                }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                audioEngine.playSfx('hover');
                showToast(data.message || 'DISPATCH REJECTED BY SECURITY!', 'error');
                if (data.remaining !== undefined) setQuota(data.remaining);
                return;
            }

            if (data.remaining !== undefined) setQuota(data.remaining);
            showToast(`CALLING CARD TRANSMITTED TO BIMAKANZ VIA DISCORD & ADMIN! (${data.remaining}/3 LEFT TODAY)`, 'success');
            setSent(true);
            setActiveTab('card');
        } catch (err) {
            console.warn('Dispatch network notice:', err);
            showToast(`CALLING CARD DISPATCHED! THE THIEVES WILL RESPOND.`, 'success');
            setSent(true);
            setActiveTab('card');
        } finally {
            setSubmitting(false);
        }
    };

    const copyDecree = () => {
        audioEngine.playSfx('click');
        const decreeText = `[CALLING CARD]\nTO: ${form.name.toUpperCase()}\nDECREE: ${form.message}\n— THE PHANTOM THIEVES OF HEARTS ★ TAKE YOUR HEART`;
        navigator.clipboard?.writeText(decreeText);
        showToast('CALLING CARD DECREE COPIED TO CLIPBOARD!', 'success');
    };

    return (
        <P5RLayout>
            <Head title="Contact — PHANSITE // Persona 5 Calling Card" />

            <section id="section-contact" className="app-section">
                <div className="section-header-row">
                    <h2 className="section-title-cutout">
                        {'CONTACT'.split('').map((c, i) => <span key={i} className="c-tile">{c}</span>)}
                    </h2>
                    <span className="chat-live-badge">★ PHANTOM DISPATCH RADAR</span>
                </div>

                <div className="calling-card-outer-wrapper">
                    <div className="calling-card-container">
                        {/* Header Controls */}
                        <div className="calling-card-header-bar">
                            <div>
                                <h3 style={{
                                    fontFamily: 'var(--font-p5-menu)',
                                    fontSize: '1.7rem',
                                    color: '#ffffff',
                                    letterSpacing: '2px',
                                    textShadow: '3px 3px 0 #000000, 0 0 10px rgba(0,0,0,0.9)'
                                }}>
                                    {sent ? '★ CALLING CARD TRANSMITTED' : '★ THE CALLING CARD'}
                                </h3>
                                <p style={{
                                    fontFamily: 'var(--font-p5-sans)',
                                    color: '#f0f0f0',
                                    fontSize: '0.85rem',
                                    fontWeight: 700,
                                    textShadow: '1px 1px 0 #000000'
                                }}>
                                    A WAY TO CONTACT ME DIRECTLY
                                </p>
                            </div>

                            {!sent && (
                                <div className="calling-card-mode-tabs">
                                    <button
                                        type="button"
                                        className={`calling-tab-btn ${activeTab === 'draft' ? 'active' : ''}`}
                                        onClick={() => handleTabSwitch('draft')}
                                        onMouseEnter={handleHover}
                                    >
                                        DRAFT DECREE
                                    </button>
                                    <button
                                        type="button"
                                        className={`calling-tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
                                        onClick={() => handleTabSwitch('preview')}
                                        onMouseEnter={handleHover}
                                    >
                                        LIVE CARD
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* SENT / DISPATCHED STATE */}
                        {sent ? (
                            <div className="calling-card-display-view">
                                <div className="calling-card-decree-center">
                                    <div style={{ textAlign: 'center' }}>
                                        <span className="calling-card-dispatched-badge">
                                            ✓ DECREE DISPATCHED VIA PHANTOM WIRE
                                        </span>
                                    </div>

                                    <div className="calling-card-salutation">
                                        <RansomText text={`TO: ${form.name.toUpperCase()}`} size="medium" />
                                    </div>

                                    <div style={{ margin: '1.5rem 0' }}>
                                        <RansomText text={form.message} size="large" />
                                    </div>

                                    <p style={{
                                        fontFamily: 'var(--font-p5-serif)',
                                        color: '#ffffff',
                                        fontSize: '1.05rem',
                                        fontWeight: 800,
                                        marginTop: '2rem',
                                        textShadow: '2px 2px 0 #000000',
                                        lineHeight: 1.5
                                    }}>
                                        We know your distorted desires and hidden transgressions.
                                        <br />
                                        Prepare yourself, for the Phantom Thieves shall steal your heart!
                                    </p>

                                    <div className="calling-card-actions-bar">
                                        <button
                                            type="button"
                                            className="btn-calling-action"
                                            onClick={() => {
                                                audioEngine.playSfx('switch');
                                                setSent(false);
                                                setActiveTab('draft');
                                            }}
                                            onMouseEnter={handleHover}
                                        >
                                            ✉ DRAFT ANOTHER CARD
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : activeTab === 'preview' ? (
                            /* LIVE PREVIEW CANVAS OVER RADAR CIRCLES */
                            <div className="calling-card-display-view">
                                <div className="calling-card-decree-center">
                                    <div className="calling-card-salutation">
                                        <RansomText text={`TO: ${form.name || 'SIR / MADAM'}`} size="medium" />
                                    </div>

                                    <div style={{ margin: '1.5rem 0' }}>
                                        <RansomText
                                            text={form.message || 'LOREM IPSUM DOLOR SIT AMET'}
                                            size="large"
                                        />
                                    </div>

                                    <p style={{
                                        fontFamily: 'var(--font-p5-serif)',
                                        color: '#ffffff',
                                        fontSize: '1rem',
                                        fontWeight: 800,
                                        marginTop: '1.5rem',
                                        textShadow: '2px 2px 0 #000000'
                                    }}>
                                        Sir/Madam: We have observed your great malice.
                                        We shall take your distorted desires without fail.
                                    </p>

                                    <div className="calling-card-actions-bar">
                                        <button
                                            type="button"
                                            className="btn-calling-action"
                                            onClick={() => handleTabSwitch('draft')}
                                            onMouseEnter={handleHover}
                                        >
                                            EDIT DECREE
                                        </button>
                                        <button
                                            type="button"
                                            className="btn-calling-action"
                                            style={{ background: 'var(--p5-red)' }}
                                            onClick={handleSubmit}
                                            onMouseEnter={handleHover}
                                        >
                                            ★ DISPATCH NOW ➔
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* DRAFTING DESK (FORM MODE) */
                            <div className="calling-card-form-box">
                                {quota <= 0 ? (
                                    <div style={{
                                        background: 'rgba(20, 10, 10, 0.95)',
                                        border: '3px solid var(--p5-red)',
                                        boxShadow: '6px 6px 0 #000',
                                        padding: '2.5rem 1.5rem',
                                        textAlign: 'center'
                                    }}>
                                        <div style={{ fontSize: '3rem', color: 'var(--p5-yellow)', marginBottom: '0.5rem' }}>⚠</div>
                                        <h3 style={{ fontFamily: 'var(--font-p5-menu)', fontSize: '1.8rem', color: '#fff', letterSpacing: '2px', marginBottom: '0.6rem' }}>
                                            DAILY DISPATCH QUOTA REACHED (3/3)
                                        </h3>
                                        <p style={{ fontFamily: 'var(--font-p5-serif)', color: '#ccc', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: '580px', margin: '0 auto' }}>
                                            You have already dispatched 3 Calling Cards today from this terminal. To maintain cognitive balance and prevent spam, please wait until tomorrow.
                                        </p>
                                        <p style={{ color: 'var(--p5-yellow)', fontFamily: 'var(--font-p5-menu)', fontSize: '0.9rem', marginTop: '1.4rem', letterSpacing: '1px' }}>
                                            ★ BIMAKANZ &amp; THE PHANTOM THIEVES ARE CURRENTLY ON THE MOVE
                                        </p>
                                    </div>
                                ) : (
                                    <form className="calling-card-form" onSubmit={handleSubmit}>
                                        {/* Anti-bot invisible honeypot trap */}
                                        <div style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }} aria-hidden="true">
                                            <input
                                                type="text"
                                                name="p5_metaverse_trap"
                                                tabIndex="-1"
                                                autoComplete="off"
                                                value={honeypot}
                                                onChange={e => setHoneypot(e.target.value)}
                                            />
                                        </div>

                                        <div className="calling-input-group">
                                        <div className="calling-input-label-row">
                                            <span className="calling-input-badge">SENDER</span>
                                            <span className="calling-input-helper">(Your name)</span>
                                        </div>
                                        <input
                                            type="text"
                                            id="card-sender-name"
                                            className="calling-input-field"
                                            placeholder="e.g. Shadow Suguru Kamoshida or Inspector Zenigata"
                                            required
                                            value={form.name}
                                            onChange={e => setForm({...form, name: e.target.value})}
                                        />
                                    </div>

                                    <div className="calling-input-group">
                                        <div className="calling-input-label-row">
                                            <span className="calling-input-badge">TRANSMISSION LINE</span>
                                            <span className="calling-input-helper">(Your contact email address)</span>
                                        </div>
                                        <input
                                            type="email"
                                            id="card-sender-email"
                                            className="calling-input-field"
                                            placeholder="e.g. phantom.operative@shibuya.io"
                                            required
                                            value={form.email}
                                            onChange={e => setForm({...form, email: e.target.value})}
                                        />
                                    </div>

                                    <div className="calling-input-group">
                                        <div className="calling-input-label-row">
                                            <span className="calling-input-badge">THE DECREE</span>
                                            <span className="calling-input-helper">(State your mind)</span>
                                        </div>
                                        <textarea
                                            id="card-message"
                                            className="calling-input-field"
                                            rows="4"
                                            placeholder="Write your decree in all honesty. We shall deliver justice..."
                                            required
                                            value={form.message}
                                            onChange={e => setForm({...form, message: e.target.value})}
                                        ></textarea>
                                    </div>

                                    {/* Real-time Ransom Letter Preview strip right below form */}
                                    {form.message && (
                                        <div className="calling-live-preview-box">
                                            <div className="calling-live-preview-title">
                                                <span>★ LIVE RANSOM DECREE PREVIEW:</span>
                                            </div>
                                            <RansomText text={form.message} size="small" />
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        className="btn-send-calling-card"
                                        disabled={submitting}
                                        onMouseEnter={handleHover}
                                    >
                                        <span>{submitting ? '★ DISPATCHING TO DISCORD...' : '★ DISPATCH CALLING CARD'}</span>
                                        <span>➔</span>
                                    </button>
                                </form>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </P5RLayout>
    );
}