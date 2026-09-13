import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

export default function ProjectEdit({ project }) {
    const { data, setData, put, processing, errors } = useForm({
        title: project.title ?? '', description: project.description ?? '',
        tech_stack: project.tech_stack ?? [], image_url: project.image_url ?? '',
        image_file: null, repo_url: project.repo_url ?? '', live_url: project.live_url ?? '',
        status: project.status ?? 'active', order: project.order ?? 0,
    });
    const [techInput, setTechInput] = useState('');

    const addTech = () => {
        const t = techInput.trim();
        if (t && !data.tech_stack.includes(t)) setData('tech_stack', [...data.tech_stack, t]);
        setTechInput('');
    };
    const removeTech = (t) => setData('tech_stack', data.tech_stack.filter(x => x !== t));

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/admin/projects/${project.id}`, { forceFormData: true });
    };

    return (
        <AdminLayout>
            <Head title={`Edit: ${project.title} — Admin`} />
            <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1.5rem' }}>
                <Link href="/admin/projects" className="p5-btn p5-btn-sm p5-btn-outline">← Back</Link>
                <h1 className="font-p5-display" style={{ fontSize:'2rem', color:'var(--p5-white)', letterSpacing:'0.08em' }}>EDIT PROJECT</h1>
            </div>
            <div style={{ maxWidth:'800px' }}>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div style={{ background:'var(--p5-dark)', border:'2px solid rgba(232,0,61,0.2)', padding:'2rem', display:'grid', gap:'1.5rem' }}>
                        <div><label className="p5-label">Title *</label><input className="p5-input" value={data.title} onChange={e=>setData('title',e.target.value)} />{errors.title&&<p style={{color:'var(--p5-red)',fontSize:'0.85rem',marginTop:'0.25rem'}}>{errors.title}</p>}</div>
                        <div><label className="p5-label">Description *</label><textarea className="p5-input" rows={4} value={data.description} onChange={e=>setData('description',e.target.value)} style={{resize:'vertical'}} />{errors.description&&<p style={{color:'var(--p5-red)',fontSize:'0.85rem',marginTop:'0.25rem'}}>{errors.description}</p>}</div>
                        <div>
                            <label className="p5-label">Tech Stack</label>
                            <div style={{display:'flex',gap:'0.5rem'}}>
                                <input className="p5-input" style={{flex:1}} value={techInput} onChange={e=>setTechInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();addTech();}}} placeholder="Add tech..." />
                                <button type="button" onClick={addTech} className="p5-btn p5-btn-sm">+ Add</button>
                            </div>
                            <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap',marginTop:'0.75rem'}}>
                                {data.tech_stack.map(t=><span key={t} className="p5-badge" style={{cursor:'pointer'}} onClick={()=>removeTech(t)}>{t} ×</span>)}
                            </div>
                        </div>
                        {project.image && <div><p className="p5-label">Current Image</p><img src={project.image} alt="" style={{maxHeight:'80px',border:'2px solid rgba(232,0,61,0.3)'}} /></div>}
                        <div><label className="p5-label">Image URL</label><input className="p5-input" value={data.image_url} onChange={e=>setData('image_url',e.target.value)} placeholder="https://..." /></div>
                        <div><label className="p5-label">Or Replace with New Image</label><input type="file" accept="image/*" className="p5-input" style={{padding:'0.4rem',cursor:'pointer'}} onChange={e=>setData('image_file',e.target.files[0])} /></div>
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                            <div><label className="p5-label">Repository URL</label><input className="p5-input" value={data.repo_url} onChange={e=>setData('repo_url',e.target.value)} /></div>
                            <div><label className="p5-label">Live URL</label><input className="p5-input" value={data.live_url} onChange={e=>setData('live_url',e.target.value)} /></div>
                        </div>
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                            <div><label className="p5-label">Status</label><select className="p5-input" value={data.status} onChange={e=>setData('status',e.target.value)}><option value="active">Active</option><option value="archived">Archived</option></select></div>
                            <div><label className="p5-label">Display Order</label><input className="p5-input" type="number" value={data.order} onChange={e=>setData('order',parseInt(e.target.value)||0)} min="0" /></div>
                        </div>
                        <div style={{display:'flex',gap:'1rem'}}>
                            <button type="submit" disabled={processing} className="p5-btn">{processing?'Saving...':'◈ Update Project'}</button>
                            <Link href="/admin/projects" className="p5-btn p5-btn-outline">Cancel</Link>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}