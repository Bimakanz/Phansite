import { Head } from '@inertiajs/react';
import P5RLayout from '@/Layouts/P5RLayout';
import { useState } from 'react';
import { audioEngine, showToast } from '@/audio';

export default function Contact() {
    const [sent, setSent] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', message: '' });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
            showToast('PLEASE FILL OUT ALL CALLING CARD FIELDS!', 'error');
            return;
        }

        audioEngine.playSfx('target');

        // Trigger Flying Calling Card animation across screen
        if (typeof document !== 'undefined') {
            const flyingCard = document.createElement('div');
            flyingCard.className = 'flying-card-anim';
            flyingCard.innerHTML = `<span>★ TAKE YOUR HEART ★</span>`;
            document.body.appendChild(flyingCard);
            setTimeout(() => flyingCard.remove(), 1800);
        }

        showToast(`CALLING CARD DISPATCHED BY ${form.name.toUpperCase()}! THE THIEVES WILL RESPOND.`, 'success');
        setSent(true);
    };

    return (
        <P5RLayout>
            <Head title="Contact — PHANSITE // Phantom Aficionado" />

            <section id="section-contact" className="app-section">
                <div className="section-header-row">
                    <h2 className="section-title-cutout">
                        {'CONTACT'.split('').map((c, i) => <span key={i} className="c-tile">{c}</span>)}
                    </h2>
                    <span className="chat-live-badge">★ PHANTOM DISPATCH</span>
                </div>

                <div className="calling-card-container">
                    <div className="calling-card-header">
                        <h2 className="calling-card-title">DISPATCH A CALLING CARD</h2>
                        <p style={{ fontFamily: 'var(--font-p5-sans)', color: '#000', fontWeight: 700, marginTop: '0.4rem' }}>
                            Sir/Madam: We have observed your project desires. Leave your decree below, and we shall initiate change of heart.
                        </p>
                    </div>

                    {sent ? (
                        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                            <div style={{ fontFamily: 'var(--font-p5-menu)', fontSize: '3rem', color: 'var(--p5-red)', marginBottom: '1rem' }}>✓</div>
                            <h3 style={{ fontFamily: 'var(--font-p5-menu)', fontSize: '2rem', color: '#000', marginBottom: '0.5rem' }}>CALLING CARD DISPATCHED!</h3>
                            <p style={{ fontFamily: 'var(--font-p5-sans)', fontWeight: 700, color: '#333' }}>The Phantom Thieves have received your decree. We will respond shortly.</p>
                            <button
                                className="btn-p5-hero"
                                style={{ marginTop: '1.5rem', display: 'inline-block' }}
                                onClick={() => {
                                    setSent(false);
                                    setForm({ name: '', email: '', message: '' });
                                }}
                            >
                                SEND ANOTHER CARD ✉
                            </button>
                        </div>
                    ) : (
                        <form className="calling-card-form" onSubmit={handleSubmit}>
                            <div className="calling-input-group">
                                <label className="calling-input-label" htmlFor="card-sender-name">SENDER (YOUR NAME / ALIAS):</label>
                                <input
                                    type="text"
                                    id="card-sender-name"
                                    className="calling-input-field"
                                    placeholder="e.g. Inspector Zenigata or Client"
                                    required
                                    value={form.name}
                                    onChange={e => setForm({...form, name: e.target.value})}
                                />
                            </div>
                            <div className="calling-input-group">
                                <label className="calling-input-label" htmlFor="card-sender-email">FREQUENCY (EMAIL ADDRESS):</label>
                                <input
                                    type="email"
                                    id="card-sender-email"
                                    className="calling-input-field"
                                    placeholder="e.g. client@shibuya.io"
                                    required
                                    value={form.email}
                                    onChange={e => setForm({...form, email: e.target.value})}
                                />
                            </div>
                            <div className="calling-input-group">
                                <label className="calling-input-label" htmlFor="card-message">THE DECREE (YOUR MESSAGE):</label>
                                <textarea
                                    id="card-message"
                                    className="calling-input-field"
                                    rows="4"
                                    placeholder="State the crime or the project challenge you want resolved..."
                                    required
                                    value={form.message}
                                    onChange={e => setForm({...form, message: e.target.value})}
                                ></textarea>
                            </div>
                            <button type="submit" className="btn-send-calling-card">
                                DISPATCH CALLING CARD ➔
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </P5RLayout>
    );
}