import { useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

function ProjectForm({ project, onSubmit, processing, errors, submitLabel }) {
    const [techInput, setTechInput] = useState('');
    const { data, setData } = { data: project, setData: (k, v) => onSubmit(k, v) };

    return null;
}

export function ProjectFormLayout({ project, submitRoute, method = 'post', pageTitle }) {
    const isEdit = !!project;
    const { data, setData, post, put, processing, errors } = useForm({
        title: project?.title ?? '',
        description: project?.description ?? '',
        tech_stack: project?.tech_stack ?? [],
        image_url: project?.image_url ?? '',
        image_file: null,
        repo_url: project?.repo_url ?? '',
        live_url: project?.live_url ?? '',
        status: project?.status ?? 'active',
        order: project?.order ?? 0,
    });

    const [techInput, setTechInput] = useState('');

    const [hasLivePreview, setHasLivePreview] = useState(!!(project?.live_url));

    const addTech = () => {
        const t = techInput.trim();
        if (t && !data.tech_stack.includes(t)) {
            setData('tech_stack', [...data.tech_stack, t]);
        }
        setTechInput('');
    };
    const removeTech = (t) => setData('tech_stack', data.tech_stack.filter(x => x !== t));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(submitRoute, { forceFormData: true });
        } else {
            post(submitRoute, { forceFormData: true });
        }
    };

    return (
        <AdminLayout>
            <Head title={`${pageTitle} — Admin`} />
            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link href="/admin/projects" className="p5-btn p5-btn-sm p5-btn-outline">← Back</Link>
                <h1 className="font-p5-display" style={{ fontSize: '2rem', color: 'var(--p5-white)', letterSpacing: '0.08em' }}>{pageTitle}</h1>
            </div>

            <div style={{ maxWidth: '800px' }}>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div style={{ background: 'var(--p5-dark)', border: '2px solid rgba(232,0,61,0.2)', padding: '2rem', display: 'grid', gap: '1.5rem' }}>
                        {/* Title */}
                        <div>
                            <label className="p5-label">Project Title *</label>
                            <input className="p5-input" value={data.title} onChange={e => setData('title', e.target.value)} placeholder="e.g. Phantom Portfolio" />
                            {errors.title && <p style={{ color:'var(--p5-red)', fontFamily:"'Rajdhani',sans-serif", fontSize:'0.85rem', marginTop:'0.25rem' }}>{errors.title}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="p5-label">Description *</label>
                            <textarea className="p5-input" rows={4} value={data.description} onChange={e => setData('description', e.target.value)} placeholder="Describe the project..." style={{ resize:'vertical' }} />
                            {errors.description && <p style={{ color:'var(--p5-red)', fontFamily:"'Rajdhani',sans-serif", fontSize:'0.85rem', marginTop:'0.25rem' }}>{errors.description}</p>}
                        </div>

                        {/* Tech Stack */}
                        <div>
                            <label className="p5-label">Tech Stack</label>
                            <div style={{ display:'flex', gap:'0.5rem' }}>
                                <input className="p5-input" style={{ flex:1 }} value={techInput} onChange={e => setTechInput(e.target.value)}
                                    onKeyDown={e => { if (e.key==='Enter') { e.preventDefault(); addTech(); } }}
                                    placeholder="e.g. Laravel, React..." />
                                <button type="button" onClick={addTech} className="p5-btn p5-btn-sm">+ Add</button>
                            </div>
                            <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap', marginTop:'0.75rem' }}>
                                {data.tech_stack.map(t => (
                                    <span key={t} className="p5-badge" style={{ cursor:'pointer', paddingRight:'0.4rem' }} onClick={() => removeTech(t)}>
                                        {t} ×
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Image URL */}
                        <div>
                            <label className="p5-label">Image URL</label>
                            <input className="p5-input" value={data.image_url} onChange={e => setData('image_url', e.target.value)} placeholder="https://..." />
                        </div>

                        {/* Image File */}
                        <div>
                            <label className="p5-label">Or Upload Image</label>
                            <input type="file" accept="image/*" className="p5-input" style={{ padding:'0.4rem', cursor:'pointer' }}
                                onChange={e => setData('image_file', e.target.files[0])} />
                        </div>

                        {/* Live Preview Checkbox Toggle & URL */}
                        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.15)', padding: '1.2rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', fontFamily: 'var(--font-p5-menu)', fontSize: '1.05rem', color: '#fff' }}>
                                <input
                                    type="checkbox"
                                    checked={hasLivePreview}
                                    onChange={e => {
                                        const val = e.target.checked;
                                        setHasLivePreview(val);
                                        if (!val) setData('live_url', '');
                                    }}
                                    style={{ width: '20px', height: '20px', accentColor: 'var(--p5-red)', cursor: 'pointer' }}
                                />
                                <span>ENABLE LIVE PREVIEW // ADA LIVE DEMO (TAMPILKAN TOMBOL LIVE PREVIEW)</span>
                            </label>

                            {hasLivePreview && (
                                <div style={{ marginTop: '1rem', paddingLeft: '1.8rem' }}>
                                    <label className="p5-label">Live Preview URL *</label>
                                    <input
                                        className="p5-input"
                                        value={data.live_url}
                                        onChange={e => setData('live_url', e.target.value)}
                                        placeholder="https://my-live-project.com"
                                        required={hasLivePreview}
                                    />
                                    <p style={{ color: '#aaa', fontSize: '0.8rem', marginTop: '0.3rem' }}>
                                        Pengunjung akan melihat tombol <strong>"LIVE PREVIEW ↗"</strong> yang langsung membuka link aplikasi ini.
                                    </p>
                                    {errors.live_url && <p style={{ color:'var(--p5-red)', fontSize:'0.85rem', marginTop:'0.25rem' }}>{errors.live_url}</p>}
                                </div>
                            )}
                        </div>

                        {/* GitHub / Repo URL */}
                        <div>
                            <label className="p5-label">GitHub / Repository URL</label>
                            <input
                                className="p5-input"
                                value={data.repo_url}
                                onChange={e => setData('repo_url', e.target.value)}
                                placeholder="https://github.com/username/project-repo"
                            />
                            <p style={{ color: '#aaa', fontSize: '0.8rem', marginTop: '0.3rem' }}>
                                Tautan ke repositori source code (akan menampilkan tombol <strong>"GITHUB / REPO ↗"</strong> ke pengunjung).
                            </p>
                            {errors.repo_url && <p style={{ color:'var(--p5-red)', fontSize:'0.85rem', marginTop:'0.25rem' }}>{errors.repo_url}</p>}
                        </div>

                        {/* Status + Order */}
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                            <div>
                                <label className="p5-label">Status</label>
                                <select className="p5-input" value={data.status} onChange={e => setData('status', e.target.value)}>
                                    <option value="active">In Progress </option>
                                    <option value="archived">Finished</option>
                                </select>
                            </div>
                            <div>
                                <label className="p5-label">Display Order</label>
                                <input className="p5-input" type="number" value={data.order} onChange={e => setData('order', parseInt(e.target.value))} min="0" />
                            </div>
                        </div>

                        <div style={{ display:'flex', gap:'1rem', paddingTop:'0.5rem' }}>
                            <button type="submit" disabled={processing} className="p5-btn">
                                {processing ? 'Saving...' : `◈ ${isEdit ? 'Update' : 'Create'} Project`}
                            </button>
                            <Link href="/admin/projects" className="p5-btn p5-btn-outline">Cancel</Link>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}