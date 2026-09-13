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
            <Head title="Projects — Admin" />
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem' }}>
                <h1 className="font-p5-display" style={{ fontSize:'2.5rem', color:'var(--p5-white)', letterSpacing:'0.08em' }}>PROJECTS</h1>
                <Link href="/admin/projects/create" className="p5-btn">+ New Project</Link>
            </div>

            <div style={{ background:'var(--p5-dark)', border:'2px solid rgba(232,0,61,0.15)', overflow:'hidden' }}>
                <table className="p5-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Project</th>
                            <th>Tech Stack</th>
                            <th>Status</th>
                            <th>Order</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.length === 0 && (
                            <tr><td colSpan={6} style={{ textAlign:'center', color:'rgba(245,245,240,0.3)', padding:'3rem' }}>No projects yet. Create one!</td></tr>
                        )}
                        {projects.map(p => (
                            <tr key={p.id}>
                                <td style={{ color:'rgba(245,245,240,0.3)', fontFamily:"'Oswald',sans-serif" }}>{p.id}</td>
                                <td>
                                    <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                                        {p.image && <img src={p.image} alt="" style={{ width:'44px', height:'36px', objectFit:'cover', border:'1px solid rgba(232,0,61,0.3)' }} />}
                                        <div>
                                            <div className="font-p5-heading" style={{ color:'var(--p5-white)', fontSize:'0.95rem' }}>{p.title}</div>
                                            <div style={{ color:'rgba(245,245,240,0.35)', fontSize:'0.8rem', fontFamily:"'Rajdhani',sans-serif" }}>{p.description?.slice(0,60)}…</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display:'flex', gap:'0.3rem', flexWrap:'wrap' }}>
                                        {(p.tech_stack||[]).slice(0,3).map(t => <span key={t} className="p5-badge" style={{ fontSize:'0.65rem' }}>{t}</span>)}
                                        {(p.tech_stack||[]).length > 3 && <span style={{ color:'rgba(245,245,240,0.3)', fontSize:'0.75rem' }}>+{p.tech_stack.length-3}</span>}
                                    </div>
                                </td>
                                <td>
                                    <span className={p.status==='active' ? 'p5-badge p5-badge-edu' : 'p5-badge'} style={{ fontSize:'0.65rem' }}>
                                        {p.status}
                                    </span>
                                </td>
                                <td style={{ color:'rgba(245,245,240,0.5)', fontFamily:"'Oswald',sans-serif" }}>{p.order}</td>
                                <td>
                                    <div style={{ display:'flex', gap:'0.5rem' }}>
                                        <Link href={`/admin/projects/${p.id}/edit`} className="p5-btn p5-btn-sm p5-btn-gold">Edit</Link>
                                        <button onClick={() => destroy(p.id)} className="p5-btn p5-btn-sm p5-btn-danger">Del</button>
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