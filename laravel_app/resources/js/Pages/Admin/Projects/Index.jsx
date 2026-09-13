import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function ProjectsIndex({ projects }) {
    const destroy = (id) => {
        if (confirm('Delete this project?')) {
            router.delete(`/admin/projects/${id}`);
        }
    };

    return (
        <AdminLayout>
            <Head title="Projects Archive — Admin" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontFamily: 'var(--font-p5-menu)', fontSize: '2.4rem', color: '#fff', letterSpacing: '0.06em', textShadow: '2px 2px 0 var(--p5-red)' }}>
                        ◈ TARGET ARCHIVES (PROJECTS)
                    </h1>
                    <p style={{ color: '#ddd', fontFamily: 'var(--font-p5-menu)', fontSize: '0.85rem', letterSpacing: '0.12em' }}>
                        INFILTRATION TARGETS &amp; CODE PALACES ({projects.length} RECORDS)
                    </p>
                </div>
                <Link href="/admin/projects/create" className="p5-admin-btn-primary">
                    + NEW TARGET (PROJECT)
                </Link>
            </div>

            <div className="p5-admin-card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="p5-admin-table">
                    <thead>
                        <tr>
                            <th style={{ width: '60px' }}>#</th>
                            <th>PROJECT TARGET</th>
                            <th>TECH STACK</th>
                            <th>STATUS</th>
                            <th>LINKS</th>
                            <th style={{ textAlign: 'right' }}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.length === 0 && (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', color: '#888', padding: '3rem', fontFamily: 'var(--font-p5-menu)' }}>
                                    NO PROJECTS RECORDED YET. CREATE YOUR FIRST TARGET!
                                </td>
                            </tr>
                        )}
                        {projects.map((p, idx) => (
                            <tr key={p.id} style={{ background: idx % 2 === 0 ? '#0a0a0a' : '#030303' }}>
                                <td style={{ color: '#888', fontFamily: 'var(--font-p5-menu)' }}>{p.id}</td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                                        {p.image && <img src={p.image} alt="" style={{ width: '48px', height: '36px', objectFit: 'cover', border: '1px solid #fff' }} />}
                                        <div>
                                            <div style={{ color: '#fff', fontFamily: 'var(--font-p5-menu)', fontSize: '1.05rem' }}>{p.title}</div>
                                            <div style={{ color: '#aaa', fontSize: '0.82rem' }}>{p.description?.slice(0, 60)}…</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                                        {(p.tech_stack || []).slice(0, 3).map(t => (
                                            <span key={t} style={{ background: '#000', border: '1px solid #444', color: '#ddd', fontSize: '0.75rem', padding: '2px 6px', fontFamily: 'var(--font-p5-sans)' }}>
                                                {t}
                                            </span>
                                        ))}
                                        {(p.tech_stack || []).length > 3 && <span style={{ color: '#888', fontSize: '0.75rem' }}>+{p.tech_stack.length - 3}</span>}
                                    </div>
                                </td>
                                <td>
                                    <span style={{
                                        background: p.status === 'active' ? 'rgba(0,230,118,0.2)' : 'rgba(0,136,255,0.2)',
                                        border: `1px solid ${p.status === 'active' ? '#00E676' : '#0088FF'}`,
                                        color: p.status === 'active' ? '#00E676' : '#60A5FA',
                                        fontSize: '0.75rem',
                                        fontFamily: 'var(--font-p5-menu)',
                                        padding: '2px 8px',
                                        letterSpacing: '1px'
                                    }}>
                                        {p.status === 'active' ? 'PROGRESS' : 'FINISHED'}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                        {p.live_url && (
                                            <a href={p.live_url} target="_blank" rel="noopener noreferrer" style={{ background: 'var(--p5-red)', color: '#fff', fontSize: '0.7rem', padding: '2px 6px', fontWeight: 'bold', textDecoration: 'none' }}>
                                                LIVE
                                            </a>
                                        )}
                                        {p.repo_url && (
                                            <a href={p.repo_url} target="_blank" rel="noopener noreferrer" style={{ background: '#222', border: '1px solid #666', color: '#fff', fontSize: '0.7rem', padding: '2px 6px', fontWeight: 'bold', textDecoration: 'none' }}>
                                                REPO
                                            </a>
                                        )}
                                        {!p.live_url && !p.repo_url && (
                                            <span style={{ color: '#666', fontSize: '0.75rem' }}>—</span>
                                        )}
                                    </div>
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                                        <Link href={`/admin/projects/${p.id}/edit`} className="p5-admin-btn-outline" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>
                                            EDIT
                                        </Link>
                                        <button onClick={() => destroy(p.id)} className="p5-admin-btn-delete" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>
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