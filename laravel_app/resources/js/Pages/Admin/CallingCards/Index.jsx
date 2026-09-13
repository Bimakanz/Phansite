import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

export default function CallingCardsIndex({ cards, unreadCount }) {
    const [expandedId, setExpandedId] = useState(null);

    const markAsRead = (id) => {
        router.patch(`/admin/calling-cards/${id}/read`, {}, {
            preserveScroll: true,
        });
    };

    const handleDelete = (id, name) => {
        if (confirm(`Are you sure you want to delete the calling card from "${name}"?`)) {
            router.delete(`/admin/calling-cards/${id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Calling Cards // HR Dispatches — Admin" />

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontFamily: 'var(--font-p5-menu)', fontSize: '2.4rem', color: '#ffffff', letterSpacing: '0.08em', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img src="/assets/img/p5_calling_card_icon.webp" alt="" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
                        CALLING CARDS // HR INQUIRIES
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-p5-sans)', fontSize: '0.9rem', fontWeight: 700 }}>
                        Decrees & Messages dispatched by HR recruiters, clients, and operatives via the Phansite Terminal.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{
                        background: '#141414',
                        border: '2px solid var(--p5-red)',
                        padding: '0.6rem 1.2rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        fontFamily: 'var(--font-p5-menu)',
                        boxShadow: '3px 3px 0 #000'
                    }}>
                        <span style={{ color: 'var(--p5-yellow)', fontSize: '1.2rem' }}>★</span>
                        <span style={{ color: '#fff', fontSize: '1rem', letterSpacing: '1px' }}>
                            UNREAD: <strong style={{ color: 'var(--p5-red)', fontSize: '1.2rem' }}>{unreadCount}</strong>
                        </span>
                    </div>
                </div>
            </div>

            {/* Cards List */}
            {cards.data && cards.data.length === 0 ? (
                <div style={{
                    background: '#141414',
                    border: '2px dashed rgba(230,0,18,0.4)',
                    padding: '4rem 2rem',
                    textAlign: 'center',
                    color: '#888'
                }}>
                    <p style={{ fontFamily: 'var(--font-p5-menu)', fontSize: '1.8rem', color: '#fff', marginBottom: '0.5rem' }}>
                        NO CALLING CARDS RECEIVED YET
                    </p>
                    <p style={{ fontFamily: 'var(--font-p5-sans)', fontSize: '0.95rem' }}>
                        When HR recruiters or clients submit a Calling Card, it will appear here and ping your Discord Webhook!
                    </p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    {cards.data.map((card) => {
                        const isExpanded = expandedId === card.id;
                        const isUnread = card.status === 'unread';

                        return (
                            <div
                                key={card.id}
                                style={{
                                    background: isUnread ? '#1a1212' : '#141414',
                                    border: isUnread ? '2px solid var(--p5-red)' : '2px solid rgba(255,255,255,0.1)',
                                    boxShadow: isUnread ? '4px 4px 0 var(--p5-red)' : '3px 3px 0 #000',
                                    padding: '1.5rem',
                                    transition: 'all 0.2s',
                                }}
                            >
                                {/* Row Top */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '0.8rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                        <span style={{
                                            background: isUnread ? 'var(--p5-red)' : '#333',
                                            color: '#fff',
                                            fontFamily: 'var(--font-p5-menu)',
                                            fontSize: '0.8rem',
                                            padding: '2px 8px',
                                            letterSpacing: '1px',
                                            transform: 'skewX(-4deg)'
                                        }}>
                                            {card.status.toUpperCase()}
                                        </span>

                                        <h3 style={{ fontFamily: 'var(--font-p5-menu)', fontSize: '1.35rem', color: '#fff', letterSpacing: '1px', margin: 0 }}>
                                            {card.name}
                                        </h3>

                                        <span style={{ color: 'var(--p5-yellow)', fontFamily: 'var(--font-p5-sans)', fontSize: '0.9rem', fontWeight: 700 }}>
                                            &lt;{card.email}&gt;
                                        </span>
                                    </div>

                                    <div style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-p5-sans)', fontSize: '0.8rem' }}>
                                        🕒 {new Date(card.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                                    </div>
                                </div>

                                {/* Message preview / body */}
                                <div style={{
                                    background: '#0a0a0a',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    padding: '1rem 1.2rem',
                                    fontFamily: 'var(--font-p5-serif)',
                                    color: '#eee',
                                    fontSize: '1rem',
                                    lineHeight: 1.6,
                                    whiteSpace: 'pre-wrap',
                                    borderLeft: '4px solid var(--p5-red)',
                                }}>
                                    {isExpanded ? card.message : card.message.slice(0, 180) + (card.message.length > 180 ? '...' : '')}
                                </div>

                                {card.message.length > 180 && (
                                    <button
                                        type="button"
                                        onClick={() => setExpandedId(isExpanded ? null : card.id)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: 'var(--p5-yellow)',
                                            fontFamily: 'var(--font-p5-menu)',
                                            fontSize: '0.85rem',
                                            cursor: 'pointer',
                                            padding: '0.4rem 0',
                                            letterSpacing: '1px'
                                        }}
                                    >
                                        {isExpanded ? '▲ SHOW LESS' : '▼ READ FULL DECREE'}
                                    </button>
                                )}

                                {/* Card Actions */}
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem', marginTop: '1rem', alignItems: 'center' }}>
                                    {isUnread && (
                                        <button
                                            type="button"
                                            onClick={() => markAsRead(card.id)}
                                            style={{
                                                background: '#222',
                                                color: '#fff',
                                                border: '1px solid #444',
                                                padding: '0.4rem 0.9rem',
                                                fontFamily: 'var(--font-p5-menu)',
                                                fontSize: '0.85rem',
                                                cursor: 'pointer',
                                                letterSpacing: '1px'
                                            }}
                                        >
                                            ✓ MARK READ
                                        </button>
                                    )}

                                    <a
                                        href={`mailto:${card.email}?subject=RE: Phantom Calling Card Transmission&body=Dear ${encodeURIComponent(card.name)},%0D%0A%0D%0AThank you for reaching out via the Phansite terminal!`}
                                        style={{
                                            background: 'var(--p5-yellow)',
                                            color: '#000',
                                            textDecoration: 'none',
                                            padding: '0.4rem 1rem',
                                            fontFamily: 'var(--font-p5-menu)',
                                            fontSize: '0.85rem',
                                            letterSpacing: '1px',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.3rem',
                                            boxShadow: '2px 2px 0 #000'
                                        }}
                                    >
                                        ✉ REPLY VIA EMAIL
                                    </a>

                                    <button
                                        type="button"
                                        onClick={() => handleDelete(card.id, card.name)}
                                        style={{
                                            background: '#000',
                                            color: 'var(--p5-red)',
                                            border: '1px solid var(--p5-red)',
                                            padding: '0.4rem 0.8rem',
                                            fontFamily: 'var(--font-p5-menu)',
                                            fontSize: '0.85rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        🗑 DELETE
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </AdminLayout>
    );
}
