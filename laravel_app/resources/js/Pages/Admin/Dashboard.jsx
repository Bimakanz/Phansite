import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function AdminDashboard({ stats, recent_cards = [] }) {
    const cards = [
        { label: 'CALLING CARDS (HR)', value: stats.calling_cards || 0, iconImg: '/assets/img/p5_calling_card_icon.webp', color: 'var(--p5-red)', highlight: stats.unread_cards ? `${stats.unread_cards} UNREAD` : null },
        { label: 'ACTIVE PROJECTS', value: stats.active || 0, icon: '◈', color: '#fff' },
        { label: 'CONFIDANT MILESTONES', value: stats.experiences || 0, icon: '◉', color: 'var(--p5-yellow)' },
        { label: 'COMPETENCY CERTIFICATES', value: stats.certificates || 0, icon: '★', color: 'var(--p5-red)' },
    ];

    return (
        <AdminLayout>
            <Head title="Admin Dashboard — Phantom Aficionado" />

            <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'inline-block', background: 'var(--p5-red)', color: '#fff', padding: '0.2rem 0.8rem', fontFamily: 'var(--font-p5-menu)', fontSize: '0.85rem', letterSpacing: '2px', transform: 'skewX(-8deg)', marginBottom: '0.5rem' }}>
                    OPERATIONAL COMMAND CENTER
                </div>
                <h1 style={{ fontFamily: 'var(--font-p5-menu)', fontSize: '2.8rem', color: '#fff', letterSpacing: '0.06em', margin: 0, textShadow: '3px 3px 0 var(--p5-red)' }}>
                    ★ METAVERSE OPERATOR CMS
                </h1>
                <p style={{ color: '#eee', fontFamily: 'var(--font-p5-menu)', fontSize: '0.85rem', letterSpacing: '0.15em', marginTop: '0.25rem' }}>
                    PHANTOM AFICIONADO — HEART STEALER DASHBOARD
                </p>
            </div>

            {/* Stat Cards */}
            <div className="admin-stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
                {cards.map(c => (
                    <div key={c.label} className="p5-admin-card" style={{ position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p style={{ fontFamily: 'var(--font-p5-heading)', fontWeight: 'bold', fontSize: '0.9rem', letterSpacing: '0.1em', color: '#ddd', marginBottom: '0.4rem', textTransform: 'uppercase' }}>{c.label}</p>
                                <p style={{ fontFamily: 'var(--font-p5-menu)', fontSize: '3rem', color: '#fff', lineHeight: 1, margin: 0 }}>{c.value}</p>
                                {c.highlight && (
                                    <span style={{ display: 'inline-block', marginTop: '0.6rem', background: 'var(--p5-red)', color: '#fff', border: '1px solid #fff', fontFamily: 'var(--font-p5-heading)', fontWeight: 'bold', fontSize: '0.8rem', padding: '2px 8px', letterSpacing: '1px' }}>
                                        {c.highlight}
                                    </span>
                                )}
                            </div>
                            {c.iconImg ? (
                                <img
                                    src={c.iconImg}
                                    alt=""
                                    style={{
                                        width: '42px',
                                        height: '42px',
                                        objectFit: 'contain',
                                        filter: 'drop-shadow(2px 2px 0 #000)'
                                    }}
                                />
                            ) : (
                                <span style={{ fontSize: '2.4rem', color: c.color, textShadow: '2px 2px 0 #000' }}>{c.icon}</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontFamily: 'var(--font-p5-menu)', fontSize: '1.2rem', letterSpacing: '0.12em', color: '#fff', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--p5-red)' }}>★</span> DIRECT META INFILTRATION (QUICK OPS)
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                    {[
                        { href: '/admin/calling-cards', label: 'CALLING CARDS (HR)', iconImg: '/assets/img/p5_calling_card_icon.webp', highlight: true },
                        { href: '/admin/projects/create', label: '+ NEW PROJECT TARGET', icon: '◈' },
                        { href: '/admin/experiences/create', label: '+ NEW CONFIDANT EXP', icon: '◉' },
                        { href: '/admin/certificates/create', label: '+ NEW CERTIFICATE', icon: '★' },
                        { href: '/admin/projects', label: 'PROJECT ARCHIVES', icon: '≡' },
                        { href: '/admin/experiences', label: 'CONFIDANT ARCHIVE', icon: '≡' },
                        { href: '/admin/certificates', label: 'CERTIFICATE ARCHIVE', icon: '★' },
                    ].map(a => (
                        <Link key={a.href} href={a.href}
                            className="p5-admin-card"
                            style={{
                                textDecoration: 'none', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.85rem',
                                fontFamily: 'var(--font-p5-heading)', fontWeight: 'bold', fontSize: '1rem', letterSpacing: '0.08em',
                                background: a.highlight ? '#150002' : '#000',
                                borderColor: a.highlight ? 'var(--p5-red)' : '#fff',
                            }}>
                            {a.iconImg ? (
                                <img
                                    src={a.iconImg}
                                    alt=""
                                    style={{
                                        width: '26px',
                                        height: '26px',
                                        objectFit: 'contain',
                                        filter: 'drop-shadow(1px 1px 0 #000)'
                                    }}
                                />
                            ) : (
                                <span style={{ color: 'var(--p5-red)', fontSize: '1.3rem' }}>{a.icon}</span>
                            )}
                            {a.label}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Calling Cards */}
            {recent_cards && recent_cards.length > 0 && (
                <div>
                    <h2 style={{ fontFamily: 'var(--font-p5-menu)', fontSize: '1.2rem', letterSpacing: '0.12em', color: '#fff', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <img src="/assets/img/p5_calling_card_icon.webp" alt="" style={{ width: '26px', height: '26px', objectFit: 'contain' }} />
                        RECENT TRANSMISSIONS FROM PROSPECTS
                    </h2>
                    <div className="p5-admin-card" style={{ padding: '0', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFamily: 'var(--font-p5-sans)', fontSize: '0.9rem' }}>
                            <thead>
                                <tr style={{ background: '#000', borderBottom: '2px solid #fff', color: 'var(--p5-yellow)', fontFamily: 'var(--font-p5-heading)', fontWeight: 'bold', fontSize: '0.9rem', letterSpacing: '0.1em' }}>
                                    <th style={{ padding: '1rem 1.25rem' }}>SENDER</th>
                                    <th style={{ padding: '1rem 1.25rem' }}>TRANSMISSION LINE</th>
                                    <th style={{ padding: '1rem 1.25rem' }}>DECREE PREVIEW</th>
                                    <th style={{ padding: '1rem 1.25rem' }}>STATUS</th>
                                    <th style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recent_cards.map((rc, idx) => (
                                    <tr key={rc.id} style={{ borderBottom: '1px solid #222', background: idx % 2 === 0 ? '#0a0a0a' : '#040404' }}>
                                        <td style={{ padding: '1rem 1.25rem', fontWeight: 'bold', color: '#fff' }}>{rc.sender_name}</td>
                                        <td style={{ padding: '1rem 1.25rem', color: '#bbb' }}>{rc.sender_contact}</td>
                                        <td style={{ padding: '1rem 1.25rem', color: '#eee', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{rc.message}</td>
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <span style={{ background: rc.status === 'unread' ? 'var(--p5-red)' : '#333', color: '#fff', padding: '2px 8px', fontSize: '0.75rem', fontFamily: 'var(--font-p5-heading)', fontWeight: 'bold', letterSpacing: '1px' }}>
                                                {rc.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                                            <Link href="/admin/calling-cards" style={{ color: 'var(--p5-yellow)', textDecoration: 'none', fontFamily: 'var(--font-p5-heading)', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                                VIEW ↗
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}