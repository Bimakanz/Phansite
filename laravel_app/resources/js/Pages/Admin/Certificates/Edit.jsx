import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import P5Select from '@/Components/P5Select';
import P5ImageUpload from '@/Components/P5ImageUpload';

export default function CertificateEdit({ certificate }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        title: certificate.title || '',
        issuer: certificate.issuer || '',
        year: certificate.year || '',
        arcana: certificate.arcana || 'STAR',
        credential_url: certificate.credential_url || '',
        description: certificate.description || '',
        image_url: certificate.image_url || '',
        image_file: null,
        order: certificate.order ?? 0,
    });

    const arcanaOptions = [
        'FOOL', 'MAGICIAN', 'PRIESTESS', 'EMPRESS', 'EMPEROR', 'HIEROPHANT',
        'LOVERS', 'CHARIOT', 'JUSTICE', 'HERMIT', 'FORTUNE', 'STRENGTH',
        'HANGED MAN', 'DEATH', 'TEMPERANCE', 'DEVIL', 'TOWER', 'STAR',
        'MOON', 'SUN', 'JUDGEMENT', 'WORLD', 'FAITH', 'COUNCILLOR'
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/admin/certificates/${certificate.id}`, { forceFormData: true });
    };

    return (
        <AdminLayout>
            <Head title={`Edit Certificate: ${certificate.title} — Admin`} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <Link href="/admin/certificates" className="p5-admin-btn-outline" style={{ padding: '0.4rem 1rem' }}>
                    ← BACK
                </Link>
                <div>
                    <h1 style={{ fontFamily: 'var(--font-p5-menu)', fontSize: '2.2rem', color: '#fff', letterSpacing: '0.06em', textShadow: '2px 2px 0 var(--p5-red)' }}>
                        ★ EDIT CERTIFICATE
                    </h1>
                    <p style={{ color: '#bbb', fontFamily: 'var(--font-p5-menu)', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
                        MODIFY TAROT RECORD #{certificate.id}
                    </p>
                </div>
            </div>

            <div style={{ width: '100%', maxWidth: '1200px' }}>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="p5-admin-card" style={{ display: 'grid', gap: '1.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '1.5rem' }}>
                            <div>
                                <label className="p5-admin-label">CERTIFICATE TITLE *</label>
                                <input
                                    className="p5-admin-input"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    placeholder="e.g. Metaverse Full-Stack Engineer"
                                    required
                                />
                                {errors.title && <p style={{ color: 'var(--p5-red)', fontSize: '0.85rem', marginTop: '0.3rem', fontWeight: 'bold' }}>{errors.title}</p>}
                            </div>
                            <div>
                                <P5Select
                                    label="TAROT ARCANA"
                                    value={data.arcana}
                                    onChange={e => setData('arcana', e.target.value)}
                                    options={arcanaOptions}
                                    error={errors.arcana}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '1.5rem' }}>
                            <div>
                                <label className="p5-admin-label">ISSUING ORGANIZATION / ACADEMY *</label>
                                <input
                                    className="p5-admin-input"
                                    value={data.issuer}
                                    onChange={e => setData('issuer', e.target.value)}
                                    placeholder="e.g. Cognitive Computing Institute, Google, Coursera"
                                    required
                                />
                                {errors.issuer && <p style={{ color: 'var(--p5-red)', fontSize: '0.85rem', marginTop: '0.3rem', fontWeight: 'bold' }}>{errors.issuer}</p>}
                            </div>
                            <div>
                                <label className="p5-admin-label">YEAR / DATE</label>
                                <input
                                    className="p5-admin-input"
                                    value={data.year}
                                    onChange={e => setData('year', e.target.value)}
                                    placeholder="e.g. 2025"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="p5-admin-label">CREDENTIAL / VERIFICATION URL</label>
                            <input
                                className="p5-admin-input"
                                value={data.credential_url}
                                onChange={e => setData('credential_url', e.target.value)}
                                placeholder="https://coursera.org/verify/... or certificate URL"
                            />
                            {errors.credential_url && <p style={{ color: 'var(--p5-red)', fontSize: '0.85rem', marginTop: '0.3rem', fontWeight: 'bold' }}>{errors.credential_url}</p>}
                        </div>

                        <div>
                            <label className="p5-admin-label">DESCRIPTION / COMPETENCY HIGHLIGHTS</label>
                            <textarea
                                className="p5-admin-input"
                                rows={3}
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                placeholder="Brief summary of skills, competencies or honors mastered..."
                                style={{ resize: 'vertical' }}
                            />
                        </div>

                        {/* Current Image Banner if exists */}
                        {certificate.image && (
                            <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.2)', padding: '1rem' }}>
                                <p className="p5-admin-label" style={{ marginBottom: '0.5rem' }}>CURRENT BADGE / VISUAL</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <img
                                        src={certificate.image}
                                        alt=""
                                        style={{ maxHeight: '90px', border: '2px solid #fff', boxShadow: '4px 4px 0 var(--p5-red)' }}
                                    />
                                    <div style={{ color: '#aaa', fontSize: '0.85rem' }}>
                                        Badge sertifikat saat ini aktif. Unggah file baru di bawah jika ingin menggantinya.
                                    </div>
                                </div>
                            </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)', gap: '1.5rem', alignItems: 'start' }}>
                            <div>
                                <label className="p5-admin-label">BADGE / IMAGE URL</label>
                                <input
                                    className="p5-admin-input"
                                    value={data.image_url}
                                    onChange={e => setData('image_url', e.target.value)}
                                    placeholder="https://..."
                                />
                                <p style={{ color: '#888', fontSize: '0.8rem', marginTop: '0.4rem' }}>
                                    Gunakan URL gambar eksternal jika badge tersimpan online.
                                </p>
                            </div>
                            <div>
                                <P5ImageUpload
                                    label="OR UPLOAD REPLACEMENT BADGE"
                                    file={data.image_file}
                                    onFileChange={file => setData('image_file', file)}
                                    currentImageUrl={certificate.image}
                                    error={errors.image_file}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', borderTop: '2px solid #222', paddingTop: '1.5rem' }}>
                            <button type="submit" disabled={processing} className="p5-admin-btn-primary">
                                {processing ? 'SAVING CHANGES...' : '★ UPDATE CERTIFICATE'}
                            </button>
                            <Link href="/admin/certificates" className="p5-admin-btn-outline">
                                CANCEL
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
