import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const badgeClass = { certificate: 'p5-badge p5-badge-gold', work: 'p5-badge p5-badge-work', education: 'p5-badge p5-badge-edu' };

export default function ExperiencesIndex({ experiences }) {
    const destroy = (id) => {
        if (confirm('Delete this experience?')) router.delete(`/admin/experiences/${id}`);
    };

    return (
        <AdminLayout>
            <Head title="Experiences — Admin" />
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem' }}>
                <h1 className="font-p5-display" style={{ fontSize:'2.5rem', color:'var(--p5-white)', letterSpacing:'0.08em' }}>EXPERIENCES</h1>
                <Link href="/admin/experiences/create" className="p5-btn">+ New Experience</Link>
            </div>
            <div style={{ background:'var(--p5-dark)', border:'2px solid rgba(232,0,61,0.15)', overflow:'hidden' }}>
                <table className="p5-table">
                    <thead><tr><th>#</th><th>Title</th><th>Organization</th><th>Type</th><th>Date</th><th>Actions</th></tr></thead>
                    <tbody>
                        {experiences.length === 0 && (
                            <tr><td colSpan={6} style={{ textAlign:'center', color:'rgba(245,245,240,0.3)', padding:'3rem' }}>No experiences yet.</td></tr>
                        )}
                        {experiences.map(e => (
                            <tr key={e.id}>
                                <td style={{ color:'rgba(245,245,240,0.3)', fontFamily:"'Oswald',sans-serif" }}>{e.id}</td>
                                <td>
                                    <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                                        {e.image && <img src={e.image} alt="" style={{ width:'44px', height:'36px', objectFit:'contain', background:'rgba(255,255,255,0.05)', padding:'2px' }} />}
                                        <span className="font-p5-heading" style={{ color:'var(--p5-white)', fontSize:'0.95rem' }}>{e.title}</span>
                                    </div>
                                </td>
                                <td style={{ color:'var(--p5-gold)', fontFamily:"'Oswald',sans-serif", fontSize:'0.85rem' }}>{e.organization}</td>
                                <td><span className={badgeClass[e.type]} style={{ fontSize:'0.65rem' }}>{e.type}</span></td>
                                <td style={{ color:'rgba(245,245,240,0.4)', fontSize:'0.85rem' }}>
                                    {e.date_start ? new Date(e.date_start).toLocaleDateString('en-US', { month:'short', year:'numeric' }) : '-'}
                                </td>
                                <td>
                                    <div style={{ display:'flex', gap:'0.5rem' }}>
                                        <Link href={`/admin/experiences/${e.id}/edit`} className="p5-btn p5-btn-sm p5-btn-gold">Edit</Link>
                                        <button onClick={() => destroy(e.id)} className="p5-btn p5-btn-sm p5-btn-danger">Del</button>
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