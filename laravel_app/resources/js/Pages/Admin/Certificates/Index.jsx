import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function CertificateIndex({ certificates = [] }) {
    const handleDelete = (id, title) => {
        if (confirm(`PURGE CERTIFICATE RECORD?\n"${title}" will be permanently removed.`)) {
            router.delete(`/admin/certificates/${id}`);
        }
    };

    return (
        <AdminLayout>
            <Head title="Certificates Archive — Admin" />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontFamily: 'var(--font-p5-menu)', fontSize: '2.4rem', color: '#fff', letterSpacing: '0.06em', textShadow: '2px 2px 0 var(--p5-red)' }}>
                        ★ COMPETENCY CERTIFICATES
                    </h1>
                    <p style={{ color: '#ddd', fontFamily: 'var(--font-p5-menu)', fontSize: '0.85rem', letterSpacing: '0.12em' }}>
                        TAROT CONFIDANT & COMPETENCY ARCHIVE ({certificates.length} RECORDS)
                    </p>
                </div>
                <Link href="/admin/certificates/create" className="p5-admin-btn-primary">
                    + NEW CERTIFICATE
                </Link>
            </div>

            {certificates.length === 0 ? (
                <div className="p5-admin-card p5-empty-state">
                    <div className="empty-state-icon" style={{ color: 'var(--p5-red)' }}>◈</div>
                    <h3 className="empty-state-text" style={{ color: '#fff' }}>NO CERTIFICATES RECORDED</h3>
                    <p className="empty-state-subtext" style={{ color: '#bbb' }}>Add your professional credentials and competency tarot cards.</p>
                    <Link href="/admin/certificates/create" className="p5-admin-btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
                        + CREATE FIRST CERTIFICATE
                    </Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    {certificates.map(cert => (
                        <div key={cert.id} className="p5-admin-card" style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', gap: '0.75rem' }}>
                                    <h3 style={{ fontFamily: 'var(--font-p5-menu)', fontSize: '1.35rem', color: '#fff', margin: 0, lineHeight: 1.25, letterSpacing: '0.04em' }}>
                                        {cert.title}
                                    </h3>
                                    {cert.year && (
                                        <span style={{ color: 'var(--p5-yellow)', fontFamily: 'var(--font-p5-menu)', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                                            {cert.year}
                                        </span>
                                    )}
                                </div>
                                <p style={{ color: '#eee', fontFamily: 'var(--font-p5-sans)', fontSize: '0.9rem', marginBottom: '0.75rem', fontWeight: 600 }}>
                                    {cert.issuer}
                                </p>

                                {cert.description && (
                                    <p style={{ color: '#aaa', fontSize: '0.82rem', lineHeight: 1.4, marginBottom: '1rem' }}>
                                        {cert.description}
                                    </p>
                                )}

                                {cert.credential_url && (
                                    <a href={cert.credential_url} target="_blank" rel="noreferrer" style={{ color: 'var(--p5-yellow)', fontSize: '0.82rem', textDecoration: 'underline', wordBreak: 'break-all', display: 'inline-block', marginBottom: '1rem' }}>
                                        ↗ Credential Link
                                    </a>
                                )}
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #333' }}>
                                <Link href={`/admin/certificates/${cert.id}/edit`} className="p5-admin-btn-outline" style={{ flex: 1, textAlign: 'center' }}>
                                    EDIT
                                </Link>
                                <button onClick={() => handleDelete(cert.id, cert.title)} className="p5-admin-btn-delete" style={{ flex: 1 }}>
                                    PURGE
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
