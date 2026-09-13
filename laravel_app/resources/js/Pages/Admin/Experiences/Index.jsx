import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const badgeClass = { certificate: 'p5-badge p5-badge-gold', work: 'p5-badge p5-badge-work', education: 'p5-badge p5-badge-edu' };

export default function ExperiencesIndex({ experiences }) {
    const destroy = (id) => {
        if (confirm('Delete this experience?')) router.delete(`/admin/experiences/${id}`);
    };

    return (
        <AdminLayout>
            <Head title="Experiences Archive — Admin" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontFamily: 'var(--font-p5-menu)', fontSize: '2.4rem', color: '#fff', letterSpacing: '0.06em', textShadow: '2px 2px 0 var(--p5-red)' }}>
                        ◉ CONFIDANT ARCHIVE (EXPERIENCES)
                    </h1>
                    <p style={{ color: '#ddd', fontFamily: 'var(--font-p5-menu)', fontSize: '0.85rem', letterSpacing: '0.12em' }}>
                        CAREER MILESTONES, WORK &amp; EDUCATION BONDS ({experiences.length} RECORDS)
                    </p>
                </div>
                <Link href="/admin/experiences/create" className="p5-admin-btn-primary">
                    + NEW CONFIDANT BOND
                </Link>
            </div>

            <div className="p5-admin-card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="p5-admin-table">
                    <thead>
                        <tr>
                            <th style={{ width: '60px' }}>#</th>
                            <th>POSITION / TITLE</th>
                            <th>ORGANIZATION</th>
                            <th>CATEGORY</th>
                            <th>PERIOD</th>
                            <th style={{ textAlign: 'right' }}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {experiences.length === 0 && (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', color: '#888', padding: '3rem', fontFamily: 'var(--font-p5-menu)' }}>
                                    NO CONFIDANTS RECORDED YET. ADD YOUR FIRST CAREER MILESTONE!
                                </td>
                            </tr>
                        )}
                        {experiences.map((e, idx) => (
                            <tr key={e.id} style={{ background: idx % 2 === 0 ? '#0a0a0a' : '#030303' }}>
                                <td style={{ color: '#888', fontFamily: 'var(--font-p5-menu)' }}>{e.id}</td>
                                <td>
                                    <div>
                                        <div style={{ color: '#fff', fontFamily: 'var(--font-p5-menu)', fontSize: '1.05rem' }}>{e.title}</div>
                                        {e.credential_url && (
                                            <a href={e.credential_url} target="_blank" rel="noreferrer" style={{ color: 'var(--p5-yellow)', fontSize: '0.75rem', textDecoration: 'underline' }}>
                                                ↗ Credential
                                            </a>
                                        )}
                                    </div>
                                </td>
                                <td style={{ color: 'var(--p5-yellow)', fontFamily: 'var(--font-p5-menu)', fontSize: '0.9rem' }}>{e.organization}</td>
                                <td>
                                    <span style={{
                                        background: e.type === 'work' ? 'rgba(77,158,255,0.2)' : (e.type === 'education' ? 'rgba(82,196,26,0.2)' : 'rgba(230,0,18,0.2)'),
                                        border: `1px solid ${e.type === 'work' ? '#4D9EFF' : (e.type === 'education' ? '#52C41A' : 'var(--p5-red)')}`,
                                        color: e.type === 'work' ? '#70B5FF' : (e.type === 'education' ? '#73D13D' : '#FF4D4F'),
                                        fontSize: '0.75rem',
                                        fontFamily: 'var(--font-p5-menu)',
                                        padding: '2px 8px',
                                        letterSpacing: '1px'
                                    }}>
                                        {e.type.toUpperCase()}
                                    </span>
                                </td>
                                <td style={{ color: '#ccc', fontSize: '0.85rem' }}>
                                    {e.date_start ? new Date(e.date_start).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '-'}
                                    {e.date_end ? ` — ${new Date(e.date_end).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}` : ' — Present'}
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                                        <Link href={`/admin/experiences/${e.id}/edit`} className="p5-admin-btn-outline" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>
                                            EDIT
                                        </Link>
                                        <button onClick={() => destroy(e.id)} className="p5-admin-btn-delete" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>
                                            PURGE
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}