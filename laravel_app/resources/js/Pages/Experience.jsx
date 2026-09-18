import { Head } from '@inertiajs/react';
import P5RLayout from '@/Layouts/P5RLayout';
import { useState, useEffect } from 'react';
import { audioEngine } from '@/audio';

function ExperienceCard({ exp }) {
    const dateStart = exp.date_start ? new Date(exp.date_start).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : null;
    const dateEnd = exp.date_end ? new Date(exp.date_end).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present';
    return (
        <div className="experience-timeline-item">
            <div className="exp-item-dot"></div>
            <div className="exp-item-content" onMouseEnter={() => audioEngine.playSfx('hover')}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span style={{
                        background: exp.type === 'education' ? 'rgba(82,196,26,0.15)' : 'rgba(77,158,255,0.15)',
                        border: `1px solid ${exp.type === 'education' ? '#52C41A' : '#4D9EFF'}`,
                        color: exp.type === 'education' ? '#73D13D' : '#70B5FF',
                        fontSize: '0.72rem',
                        fontFamily: 'var(--font-p5-menu)',
                        padding: '2px 8px',
                        letterSpacing: '1px',
                        display: 'inline-block',
                    }}>
                        {exp.type === 'education' ? 'EDUCATION' : 'WORK EXPERIENCE'}
                    </span>
                    {dateStart && (
                        <span className="exp-item-date">{dateStart} — {dateEnd}</span>
                    )}
                </div>

                <div className="exp-item-header">
                    <h3 className="exp-item-title">{exp.title}</h3>
                </div>
                <div className="exp-item-org">{exp.organization}</div>

                {exp.description && <p className="exp-item-desc">{exp.description}</p>}
                {exp.credential_url && (
                    <a
                        href={exp.credential_url}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-target-action"
                        style={{ marginTop: '0.8rem', display: 'inline-block' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        ↗ VIEW CREDENTIAL
                    </a>
                )}
            </div>
        </div>
    );
}

function CertCard({ cert, onSelect }) {
    const arcana = cert.arcana || 'STAR';
    const issuer = cert.issuer || cert.organization || 'Phantom Academy';
    const year = cert.year || (cert.date_start ? new Date(cert.date_start).getFullYear() : '2025');
    const imageSrc = cert.image || cert.image_url || '/assets/img/p5_certificate_sample.webp';

    return (
        <div
            className="tarot-cert-card tarot-cert-interactive"
            onClick={() => onSelect(cert)}
            onMouseEnter={() => audioEngine.playSfx('hover')}
            style={{
                position: 'relative',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '2rem',
                minHeight: '440px',
            }}
            title="Click to view certificate specimen"
        >
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', gap: '0.8rem' }}>
                    <h4
                        className="tarot-title"
                        style={{
                            fontFamily: 'var(--font-p5-menu)',
                            fontSize: '1.6rem',
                            color: '#fff',
                            margin: 0,
                            textAlign: 'left',
                            lineHeight: 1.25,
                            letterSpacing: '0.04em',
                            textShadow: '2px 2px 0 var(--p5-red)',
                        }}
                    >
                        {cert.title}
                    </h4>
                    {year && (
                        <span style={{ color: 'var(--p5-yellow)', fontFamily: 'var(--font-p5-menu)', fontSize: '2rem', whiteSpace: 'nowrap' }}>
                            {year}
                        </span>
                    )}
                </div>

                {/* Certificate Thumbnail Preview (Large & Clear) */}
                <div
                    className="cert-card-thumb-wrap"
                    style={{
                        position: 'relative',
                        width: '100%',
                        height: '260px',
                        overflow: 'hidden',
                        marginBottom: '1.2rem',
                        border: '3px solid #2a2a2a',
                        backgroundColor: '#0c0c0e',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <img
                        src={imageSrc}
                        alt={cert.title}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            transition: 'transform 0.35s ease',
                            backgroundColor: '#000',
                        }}
                        className="cert-thumb-img"
                    />
                </div>

                <div
                    className="tarot-issuer"
                    style={{
                        color: 'var(--p5-yellow)',
                        fontFamily: 'var(--font-p5-sans)',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        textAlign: 'left',
                        marginBottom: '0.6rem',
                    }}
                >
                    {issuer}
                </div>
                {cert.description && (
                    <div
                        className="p5-dialog-chatbox"
                        style={{
                            position: 'relative',
                            backgroundColor: '#ffffff',
                            border: '3px solid #000000',
                            boxShadow: '5px 5px 0 var(--p5-red)',
                            transform: 'skewX(-3deg)',
                            padding: '1rem 1.2rem 0.9rem',
                            marginTop: '1.2rem',
                            color: '#000000',
                        }}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                top: '-11px',
                                left: '10px',
                                backgroundColor: '#000000',
                                color: '#ffffff',
                                padding: '0.1rem 0.55rem',
                                fontFamily: 'var(--font-p5-menu)',
                                fontSize: '0.8rem',
                                letterSpacing: '1px',
                                transform: 'skewX(-3deg)',
                                border: '1px solid var(--p5-red)',
                                userSelect: 'none',
                            }}
                        >
                            DESCRIPTION
                        </div>
                        <p
                            style={{
                                fontFamily: 'var(--font-p5-sans)',
                                fontSize: '0.95rem',
                                fontWeight: 700,
                                color: '#000000',
                                lineHeight: 1.45,
                                margin: 0,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                wordBreak: 'break-word',
                            }}
                        >
                            {cert.description}
                        </p>
                        <span
                            style={{
                                position: 'absolute',
                                bottom: '4px',
                                right: '8px',
                                color: 'var(--p5-red)',
                                fontSize: '0.8rem',
                                animation: 'pulse 1s infinite alternate',
                                userSelect: 'none',
                                fontWeight: 'bold',
                            }}
                        >
                            ▼
                        </span>
                    </div>
                )}
            </div>

            {cert.credential_url && (
                <div style={{ marginTop: '1.2rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <a
                        href={cert.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-target-action"
                        onClick={(e) => e.stopPropagation()}
                        style={{ fontSize: '0.85rem', padding: '0.4rem 1rem' }}
                    >
                        VERIFY CREDENTIAL ↗
                    </a>
                </div>
            )}
        </div>
    );
}

export default function Experience({ experiences = [], certificates = [] }) {
    const [selectedCert, setSelectedCert] = useState(null);

    const workExp = experiences.filter(e => e.type === 'work' || e.type === 'education');
    const certs = certificates.length > 0 ? certificates : experiences.filter(e => e.type === 'certificate');

    const handleSelectCert = (cert) => {
        audioEngine.playSfx('select');
        setSelectedCert(cert);
    };

    const handleCloseModal = () => {
        audioEngine.playSfx('click');
        setSelectedCert(null);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && selectedCert) {
                handleCloseModal();
            }
        };
        if (selectedCert) {
            document.body.style.overflow = 'hidden';
            document.body.classList.add('modal-open');
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.body.style.overflow = '';
            document.body.classList.remove('modal-open');
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedCert]);

    return (
        <P5RLayout>
            <Head>
                <title>Experience (Confidants) — Persona 5 Portfolio // PHANSITE</title>
                <meta name="description" content="Professional journey, technical experience, and achievements of Bimasena — Full-Stack Developer." />
            </Head>

            <section id="section-experience" className="app-section">
                <div className="section-header-row">
                    <h2 className="section-title-cutout">
                        {'EXPERIENCE'.split('').map((c, i) => <span key={i} className="c-tile">{c}</span>)}
                    </h2>
                </div>

                <div className="portfolio-hero-banner" style={{ marginTop: '1rem', marginBottom: '2rem' }}>
                    <div className="hero-banner-inner">
                        <div className="hero-text-block">
                            <h3 style={{ fontFamily: 'var(--font-p5-menu)', fontSize: '2.2rem', color: '#fff', marginBottom: '0.5rem' }}>
                                CONFIDANT BONDS // CHRONICLES &amp; MASTERY
                            </h3>
                            <p style={{ fontFamily: 'var(--font-p5-sans)', color: '#ccc', lineHeight: 1.6, fontSize: '1.05rem' }}>
                                A documented journey of professional milestones, academic rigor, and certified industry competencies. Forged through collaborative missions, technical leadership, and relentless dedication to software craftsmanship.
                            </p>
                        </div>
                    </div>
                </div>

                <h3 style={{ fontFamily: 'var(--font-p5-menu)', fontSize: '2rem', color: '#fff', margin: '1.5rem 0 0.5rem' }}>
                    CAREER CONFIDANT ARCHIVE
                </h3>

                <div className="experience-timeline">
                    {workExp.length === 0 ? (
                        <div className="p5-empty-state" style={{ padding: '3rem 0' }}>
                            <div className="empty-state-icon">◉</div>
                            <h3 className="empty-state-text">NO CONFIDANTS YET.</h3>
                            <p className="empty-state-subtext">No work/education experience recorded yet.</p>
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
                            <p className="empty-state-subtext">No certifications archived yet.</p>
                        </div>
                    ) : (
                        certs.map(c => <CertCard key={c.id} cert={c} onSelect={handleSelectCert} />)
                    )}
                </div>
            </section>

            {/* Certificate Lightbox Modal */}
            {selectedCert && (
                <div
                    className="p5-cert-modal-backdrop"
                    onClick={handleCloseModal}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 99999,
                        backgroundColor: 'rgba(0, 0, 0, 0.88)',
                        backdropFilter: 'blur(6px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1.2rem',
                    }}
                >
                    <div
                        className="p5-cert-modal-dialog"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            position: 'relative',
                            width: '100%',
                            maxWidth: '850px',
                            maxHeight: '90vh',
                            backgroundColor: '#0a0a0c',
                            border: '4px solid #ffffff',
                            boxShadow: '12px 12px 0 var(--p5-red)',
                            transform: 'skewX(-2deg)',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                        }}
                    >
                        {/* Modal Header */}
                        <div
                            style={{
                                backgroundColor: 'var(--p5-red)',
                                color: '#000',
                                padding: '0.8rem 1.2rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                fontWeight: 'bold',
                                fontFamily: 'var(--font-p5-menu)',
                                letterSpacing: '1px',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                <span style={{ backgroundColor: '#000', color: '#fff', padding: '0.2rem 0.5rem', fontSize: '0.85rem' }}>
                                    CERTIFICATE SPECIMEN
                                </span>
                                <span style={{ fontSize: '1.1rem', color: '#fff' }}>
                                    {selectedCert.title}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                onMouseEnter={() => audioEngine.playSfx('hover')}
                                className="p5-modal-close-btn"
                            >
                                ✕ CLOSE (ESC)
                            </button>
                        </div>

                        {/* Modal Scrollable Body */}
                        <div
                            style={{
                                padding: '1.5rem',
                                overflowY: 'auto',
                                color: '#fff',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1.2rem',
                            }}
                        >
                            {/* Certificate Image Frame */}
                            <div
                                style={{
                                    position: 'relative',
                                    backgroundColor: '#000',
                                    border: '3px solid #ffffff',
                                    boxShadow: '6px 6px 0 var(--p5-red)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    overflow: 'hidden',
                                    borderRadius: '2px',
                                }}
                            >
                                <img
                                    src={selectedCert.image || selectedCert.image_url || '/assets/img/p5_certificate_sample.webp'}
                                    alt={selectedCert.title}
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '56vh',
                                        objectFit: 'contain',
                                        display: 'block',
                                    }}
                                />
                            </div>

                            {/* Certificate Info */}
                            <div>
                                <h3
                                    style={{
                                        fontFamily: 'var(--font-p5-menu)',
                                        fontSize: '1.6rem',
                                        color: '#ffffff',
                                        margin: '0 0 0.4rem',
                                        letterSpacing: '0.5px',
                                    }}
                                >
                                    {selectedCert.title}
                                </h3>
                                <div
                                    style={{
                                        color: 'var(--p5-yellow)',
                                        fontFamily: 'var(--font-p5-sans)',
                                        fontSize: '0.95rem',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        gap: '0.6rem',
                                        alignItems: 'center',
                                        flexWrap: 'wrap',
                                    }}
                                >
                                    <span> {selectedCert.issuer || selectedCert.organization || 'Phantom Academy'}</span>
                                    <span>&bull;</span>
                                    <span> {selectedCert.year || (selectedCert.date_start ? new Date(selectedCert.date_start).getFullYear() : '2025')}</span>
                                </div>

                                {selectedCert.description && (
                                    <div
                                        className="p5-dialog-chatbox"
                                        style={{
                                            position: 'relative',
                                            backgroundColor: '#ffffff',
                                            border: '3px solid #000000',
                                            boxShadow: '6px 6px 0 var(--p5-red)',
                                            transform: 'skewX(-3deg)',
                                            padding: '1.2rem 1.4rem 1rem',
                                            marginTop: '1.2rem',
                                            color: '#000000',
                                        }}
                                    >
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: '-12px',
                                                left: '12px',
                                                backgroundColor: '#000000',
                                                color: '#ffffff',
                                                padding: '0.15rem 0.65rem',
                                                fontFamily: 'var(--font-p5-menu)',
                                                fontSize: '0.95rem',
                                                letterSpacing: '1px',
                                                transform: 'skewX(-3deg)',
                                                border: '1.5px solid var(--p5-red)',
                                                userSelect: 'none',
                                            }}
                                        >
                                            DESCRIPTION
                                        </div>
                                        <p
                                            style={{
                                                fontFamily: 'var(--font-p5-sans)',
                                                fontSize: '1rem',
                                                fontWeight: 700,
                                                color: '#000000',
                                                lineHeight: 1.6,
                                                margin: 0,
                                            }}
                                        >
                                            {selectedCert.description}
                                        </p>
                                        <span
                                            style={{
                                                position: 'absolute',
                                                bottom: '6px',
                                                right: '10px',
                                                color: 'var(--p5-red)',
                                                fontSize: '0.9rem',
                                                animation: 'pulse 1s infinite alternate',
                                                userSelect: 'none',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            ▼
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Footer Buttons */}
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    flexWrap: 'wrap',
                                    gap: '1rem',
                                    paddingTop: '0.8rem',
                                    borderTop: '1px solid #333',
                                }}
                            >
                                <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                                    {selectedCert.credential_url && (
                                        <a
                                            href={selectedCert.credential_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn-target-action"
                                            style={{ fontSize: '0.9rem', padding: '0.5rem 1.2rem' }}
                                        >
                                            VERIFY CREDENTIAL ↗
                                        </a>
                                    )}
                                    <a
                                        href={selectedCert.image || selectedCert.image_url || '/assets/img/p5_certificate_sample.webp'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-p5-cancel"
                                        style={{ fontSize: '0.9rem', padding: '0.5rem 1.2rem', textDecoration: 'none' }}
                                    >
                                        OPEN FULL IMAGE ↗
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </P5RLayout>
    );
}