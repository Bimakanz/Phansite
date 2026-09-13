import { Head } from '@inertiajs/react';
import P5RLayout from '@/Layouts/P5RLayout';
import { useState } from 'react';

function ExperienceCard({ exp }) {
    const dateStart = exp.date_start ? new Date(exp.date_start).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : null;
    const dateEnd = exp.date_end ? new Date(exp.date_end).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present';
    return (
        <div className="experience-timeline-item">
            <div className="exp-item-dot"></div>
            <div className="exp-item-content">
                <div className="exp-item-header">
                    <h3 className="exp-item-title">{exp.title}</h3>
                    {dateStart && (
                        <span className="exp-item-date">{dateStart} — {dateEnd}</span>
                    )}
                </div>
                <div className="exp-item-org">{exp.organization}</div>
                {exp.description && <p className="exp-item-desc">{exp.description}</p>}
                {exp.credential_url && (
                    <a href={exp.credential_url} target="_blank" rel="noreferrer" className="btn-target-action" style={{ marginTop: '0.6rem', display: 'inline-block' }}>
                        ↗ VIEW CREDENTIAL
                    </a>
                )}
            </div>
        </div>
    );
}

function CertCard({ cert }) {
    return (
        <div className="cert-tarot-card">
            {cert.image && (
                <div className="cert-card-image-wrap">
                    <img src={cert.image} alt={cert.title} className="cert-card-img" />
                </div>
            )}
            <div className="cert-card-body">
                <h3 className="cert-card-title">{cert.title}</h3>
                <p className="cert-card-org">{cert.organization}</p>
                {cert.credential_url && (
                    <a href={cert.credential_url} target="_blank" rel="noreferrer" className="btn-target-action" style={{ marginTop: '0.5rem', display: 'inline-block', fontSize: '0.85rem' }}>
                        ↗ VERIFY
                    </a>
                )}
            </div>
        </div>
    );
}

export default function Experience({ experiences }) {
    const workExp = experiences.filter(e => e.type === 'work' || e.type === 'education');
    const certs   = experiences.filter(e => e.type === 'certificate');

    return (
        <P5RLayout>
            <Head title="Experience — PHANSITE // Phantom Aficionado" />

            <section id="section-experience" className="app-section">
                <div className="section-header-row">
                    <h2 className="section-title-cutout">
                        {'EXPERIENCE'.split('').map((c, i) => <span key={i} className="c-tile">{c}</span>)}
                    </h2>
                    <a href="/admin/experiences/create" className="btn-p5-send">+ MANAGE CONFIDANTS</a>
                </div>

                <h3 style={{ fontFamily: 'var(--font-p5-menu)', fontSize: '2rem', color: '#fff', margin: '1.5rem 0 0.5rem' }}>
                    CAREER CONFIDANT ARCHIVE
                </h3>

                <div className="experience-timeline">
                    {workExp.length === 0 ? (
                        <div className="p5-empty-state" style={{ padding: '3rem 0' }}>
                            <div className="empty-state-icon">◉</div>
                            <h3 className="empty-state-text">NO CONFIDANTS YET.</h3>
                            <p className="empty-state-subtext">Add work/education experience via admin.</p>
                        </div>
                    ) : (
                        workExp.map(e => <ExperienceCard key={e.id} exp={e} />)
                    )}
                </div>

                <h3 style={{ fontFamily: 'var(--font-p5-menu)', fontSize: '2rem', color: '#fff', margin: '2.5rem 0 0.5rem' }}>
                    COMPETENCY &amp; CERTIFICATIONS
                </h3>

                <div className="certifications-grid">
                    {certs.length === 0 ? (
                        <div className="p5-empty-state" style={{ gridColumn: '1/-1', padding: '2rem 0' }}>
                            <div className="empty-state-icon">◈</div>
                            <h3 className="empty-state-text">NO CERTIFICATES YET.</h3>
                            <p className="empty-state-subtext">Add certifications via admin.</p>
                        </div>
                    ) : (
                        certs.map(c => <CertCard key={c.id} cert={c} />)
                    )}
                </div>
            </section>
        </P5RLayout>
    );
}