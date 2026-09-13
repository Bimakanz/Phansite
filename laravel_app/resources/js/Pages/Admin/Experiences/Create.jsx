import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import P5Select from '@/Components/P5Select';

export default function ExperienceCreate() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        organization: '',
        type: 'work',
        description: '',
        date_start: '',
        date_end: '',
        credential_url: '',
        order: 0,
    });

    const typeOptions = [
        { value: 'work', label: 'Work Experience' },
        { value: 'education', label: 'Education' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/experiences');
    };

    return (
        <AdminLayout>
            <Head title="Create Experience — Admin" />
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <Link href="/admin/experiences" className="p5-admin-btn-outline" style={{ padding: '0.4rem 1rem' }}>
                    ← BACK
                </Link>
                <div>
                    <h1 style={{ fontFamily: 'var(--font-p5-menu)', fontSize: '2.2rem', color: '#fff', letterSpacing: '0.06em', textShadow: '2px 2px 0 var(--p5-red)' }}>
                        ◉ NEW CONFIDANT BOND (EXPERIENCE)
                    </h1>
                    <p style={{ color: '#bbb', fontFamily: 'var(--font-p5-menu)', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
                        CHRONICLE A NEW WORK, EDUCATION, OR MILESTONE EVENT
                    </p>
                </div>
            </div>

            <div style={{ width: '100%', maxWidth: '1200px' }}>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="p5-admin-card" style={{ display: 'grid', gap: '1.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '1.5rem' }}>
                            <div>
                                <label className="p5-admin-label">POSITION / ROLE TITLE *</label>
                                <input
                                    className="p5-admin-input"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    placeholder="e.g. Senior Full-Stack Architect"
                                    required
                                />
                                {errors.title && <p style={{ color: 'var(--p5-red)', fontSize: '0.85rem', marginTop: '0.3rem', fontWeight: 'bold' }}>{errors.title}</p>}
                            </div>
                            <div>
                                <P5Select
                                    label="CATEGORY / TYPE *"
                                    value={data.type}
                                    onChange={e => setData('type', e.target.value)}
                                    options={typeOptions}
                                    error={errors.type}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="p5-admin-label">ORGANIZATION / COMPANY / INSTITUTION *</label>
                            <input
                                className="p5-admin-input"
                                value={data.organization}
                                onChange={e => setData('organization', e.target.value)}
                                placeholder="e.g. Shujin Academy, Google, Metaverse Core"
                                required
                            />
                            {errors.organization && <p style={{ color: 'var(--p5-red)', fontSize: '0.85rem', marginTop: '0.3rem', fontWeight: 'bold' }}>{errors.organization}</p>}
                        </div>

                        <div>
                            <label className="p5-admin-label">KEY ACHIEVEMENTS &amp; RESPONSIBILITIES</label>
                            <textarea
                                className="p5-admin-input"
                                rows={3}
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                placeholder="Key impact, accomplishments, and tech domains involved..."
                                style={{ resize: 'vertical' }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label className="p5-admin-label">START DATE</label>
                                <input
                                    type="date"
                                    className="p5-admin-input"
                                    value={data.date_start}
                                    onChange={e => setData('date_start', e.target.value)}
                                    style={{ colorScheme: 'dark' }}
                                />
                            </div>
                            <div>
                                <label className="p5-admin-label">END DATE (BLANK = PRESENT)</label>
                                <input
                                    type="date"
                                    className="p5-admin-input"
                                    value={data.date_end}
                                    onChange={e => setData('date_end', e.target.value)}
                                    style={{ colorScheme: 'dark' }}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="p5-admin-label">CREDENTIAL / REFERENCE URL (OPTIONAL)</label>
                            <input
                                className="p5-admin-input"
                                value={data.credential_url}
                                onChange={e => setData('credential_url', e.target.value)}
                                placeholder="https://..."
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', borderTop: '2px solid #222', paddingTop: '1.5rem' }}>
                            <button type="submit" disabled={processing} className="p5-admin-btn-primary">
                                {processing ? 'CHRONICLING...' : '◉ CHRONICLE EXPERIENCE'}
                            </button>
                            <Link href="/admin/experiences" className="p5-admin-btn-outline">
                                CANCEL
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}