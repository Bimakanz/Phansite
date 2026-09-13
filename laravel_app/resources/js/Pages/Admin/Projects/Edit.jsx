import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';
import P5Select from '@/Components/P5Select';
import P5ImageUpload from '@/Components/P5ImageUpload';

export default function ProjectEdit({ project }) {
    const [hasLivePreview, setHasLivePreview] = useState(!!(project.live_url));
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        title: project.title ?? '',
        description: project.description ?? '',
        tech_stack: project.tech_stack ?? [],
        image_url: project.image_url ?? '',
        image_file: null,
        repo_url: project.repo_url ?? '',
        live_url: project.live_url ?? '',
        status: project.status ?? 'active',
        order: project.order ?? 0,
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
        post(`/admin/projects/${project.id}`, { forceFormData: true });
    };

    return (
        <AdminLayout>
            <Head title={`Edit: ${project.title} — Admin`} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <Link href="/admin/projects" className="p5-admin-btn-outline" style={{ padding: '0.4rem 1rem' }}>
                    ← BACK
                </Link>
                <div>
                    <h1 style={{ fontFamily: 'var(--font-p5-menu)', fontSize: '2.2rem', color: '#fff', letterSpacing: '0.06em', textShadow: '2px 2px 0 var(--p5-red)' }}>
                        ◈ EDIT TARGET: {project.title}
                    </h1>
                    <p style={{ color: '#bbb', fontFamily: 'var(--font-p5-menu)', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
                        MODIFY TARGET SPECS IN THE PALACE ARCHIVE
                    </p>
                </div>
            </div>

            <div style={{ width: '100%', maxWidth: '1200px' }}>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="p5-admin-card" style={{ display: 'grid', gap: '1.5rem' }}>
                        {/* Title & Status */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '1.5rem' }}>
                            <div>
                                <label className="p5-admin-label">PROJECT TITLE *</label>
                                <input
                                    className="p5-admin-input"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    required
                                />
                                {errors.title && <p style={{ color: 'var(--p5-red)', fontSize: '0.85rem', marginTop: '0.3rem', fontWeight: 'bold' }}>{errors.title}</p>}
                            </div>

                            <div>
                                <P5Select
                                    label="TARGET STATUS"
                                    value={data.status}
                                    onChange={e => setData('status', e.target.value)}
                                    options={[
                                        { value: 'active', label: 'In Progress' },
                                        { value: 'archived', label: 'Finished' },
                                    ]}
                                    error={errors.status}
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="p5-admin-label">DESCRIPTION *</label>
                            <textarea
                                className="p5-admin-input"
                                rows={4}
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                style={{ resize: 'vertical' }}
                                required
                            />
                            {errors.description && <p style={{ color: 'var(--p5-red)', fontSize: '0.85rem', marginTop: '0.3rem', fontWeight: 'bold' }}>{errors.description}</p>}
                        </div>

                        {/* Tech Stack */}
                        <div>
                            <label className="p5-admin-label">TECH STACK</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    className="p5-admin-input"
                                    style={{ flex: 1 }}
                                    value={techInput}
                                    onChange={e => setTechInput(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }}
                                    placeholder="Add tech... (Press Enter or + Add)"
                                />
                                <button type="button" onClick={addTech} className="p5-admin-btn-primary" style={{ padding: '0.4rem 1.2rem', fontSize: '0.9rem' }}>
                                    + ADD
                                </button>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                                {data.tech_stack.map(t => (
                                    <span
                                        key={t}
                                        style={{ background: '#000', border: '1px solid #fff', color: '#fff', padding: '3px 10px', fontSize: '0.8rem', fontFamily: 'var(--font-p5-menu)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                        onClick={() => removeTech(t)}
                                    >
                                        {t} <span style={{ color: 'var(--p5-red)', fontWeight: 'bold' }}>×</span>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Current Visual Target Banner if exists */}
                        {project.image && (
                            <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.2)', padding: '1rem' }}>
                                <p className="p5-admin-label" style={{ marginBottom: '0.5rem' }}>CURRENT VISUAL TARGET</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <img
                                        src={project.image}
                                        alt=""
                                        style={{ maxHeight: '110px', border: '2px solid #fff', boxShadow: '4px 4px 0 var(--p5-red)' }}
                                    />
                                    <div style={{ color: '#aaa', fontSize: '0.85rem' }}>
                                        Visual saat ini aktif. Unggah file baru di bawah atau ubah Image URL jika ingin menggantinya.
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Visual Asset (URL & Custom File Upload) */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)', gap: '1.5rem', alignItems: 'start' }}>
                            <div>
                                <label className="p5-admin-label">IMAGE URL</label>
                                <input
                                    className="p5-admin-input"
                                    value={data.image_url}
                                    onChange={e => setData('image_url', e.target.value)}
                                    placeholder="https://..."
                                />
                                <p style={{ color: '#888', fontSize: '0.8rem', marginTop: '0.4rem' }}>
                                    Gunakan URL gambar eksternal jika ada.
                                </p>
                            </div>
                            <div>
                                <P5ImageUpload
                                    label="OR REPLACE WITH NEW IMAGE FILE"
                                    file={data.image_file}
                                    onFileChange={file => setData('image_file', file)}
                                    currentImageUrl={project.image}
                                    error={errors.image_file}
                                />
                            </div>
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
                                    <label className="p5-admin-label">LIVE PREVIEW URL *</label>
                                    <input
                                        className="p5-admin-input"
                                        value={data.live_url}
                                        onChange={e => setData('live_url', e.target.value)}
                                        placeholder="https://my-live-project.com"
                                        required={hasLivePreview}
                                    />
                                    <p style={{ color: '#aaa', fontSize: '0.8rem', marginTop: '0.3rem' }}>
                                        Pengunjung akan melihat tombol <strong>"LIVE PREVIEW ↗"</strong> yang langsung membuka link aplikasi ini.
                                    </p>
                                    {errors.live_url && <p style={{ color: 'var(--p5-red)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.live_url}</p>}
                                </div>
                            )}
                        </div>

                        {/* GitHub / Repo URL */}
                        <div>
                            <label className="p5-admin-label">GITHUB / REPOSITORY URL</label>
                            <input
                                className="p5-admin-input"
                                value={data.repo_url}
                                onChange={e => setData('repo_url', e.target.value)}
                                placeholder="https://github.com/username/project-repo"
                            />
                            <p style={{ color: '#aaa', fontSize: '0.8rem', marginTop: '0.3rem' }}>
                                Tautan ke repositori source code (akan menampilkan tombol <strong>"GITHUB / REPO ↗"</strong> ke pengunjung).
                            </p>
                            {errors.repo_url && <p style={{ color: 'var(--p5-red)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.repo_url}</p>}
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', borderTop: '2px solid #222', paddingTop: '1.5rem' }}>
                            <button type="submit" disabled={processing} className="p5-admin-btn-primary">
                                {processing ? 'SAVING CHANGES...' : '◈ UPDATE PROJECT'}
                            </button>
                            <Link href="/admin/projects" className="p5-admin-btn-outline">
                                CANCEL
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}