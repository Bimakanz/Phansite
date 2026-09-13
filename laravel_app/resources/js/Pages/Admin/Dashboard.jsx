import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function AdminDashboard({ stats }) {
    const cards = [
        { label: 'Active Targets', value: stats.projects, icon: '◈', color: 'var(--p5-red)' },
        { label: 'Active Projects', value: stats.active, icon: '◆', color: 'var(--p5-yellow)' },
        { label: 'Confidant Milestones', value: stats.experiences, icon: '◉', color: '#4D9EFF' },
    ];

    return (
        <AdminLayout>
            <Head title="Admin Dashboard — Phantom Aficionado" />

            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontFamily: 'var(--font-p5-menu)', fontSize: '2.5rem', color: '#fff', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>
                    ★ COGNITIVE CMS // METAVERSE OPERATOR
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-p5-menu)', fontSize: '0.8rem', letterSpacing: '0.15em' }}>
                    PHANTOM AFICIONADO — ADMIN PANEL
                </p>
            </div>

            {/* Stat Cards */}
            <div className="admin-stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                {cards.map(c => (
                    <div key={c.label} className="p5-stat-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <p style={{ fontFamily: 'var(--font-p5-menu)', fontSize: '0.7rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>{c.label}</p>
                                <p style={{ fontFamily: 'var(--font-p5-menu)', fontSize: '3rem', color: '#fff', lineHeight: 1 }}>{c.value}</p>
                            </div>
                            <span style={{ fontSize: '2rem', color: c.color, opacity: 0.7 }}>{c.icon}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div>
                <h2 style={{ fontFamily: 'var(--font-p5-menu)', fontSize: '1rem', letterSpacing: '0.15em', color: 'var(--p5-yellow)', marginBottom: '1.25rem' }}>
                    QUICK OPERATIONS
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1rem' }}>
                    {[
                        { href: '/admin/projects/create', label: '+ NEW TARGET', icon: '◈' },
                        { href: '/admin/experiences/create', label: '+ NEW CONFIDANT', icon: '◉' },
                        { href: '/admin/projects', label: 'TARGET ARCHIVES', icon: '≡' },
                        { href: '/admin/experiences', label: 'CONFIDANT JOURNEY', icon: '≡' },
                    ].map(a => (
                        <Link key={a.href} href={a.href}
                            style={{
                                background: '#141414', border: '2px solid rgba(230,0,18,0.2)', padding: '1.25rem 1.5rem',
                                textDecoration: 'none', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.75rem',
                                fontFamily: 'var(--font-p5-menu)', fontSize: '0.9rem', letterSpacing: '0.08em',
                                transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor='var(--p5-red)'; e.currentTarget.style.background='rgba(230,0,18,0.08)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(230,0,18,0.2)'; e.currentTarget.style.background='#141414'; }}>
                            <span style={{ color: 'var(--p5-red)' }}>{a.icon}</span>
                            {a.label}
                        </Link>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}