import { Head } from '@inertiajs/react';
import P5RLayout from '@/Layouts/P5RLayout';
import { useState, useEffect } from 'react';
import { audioEngine } from '@/audio';

function ProjectCard({ project, onSelect }) {
    const techStack = Array.isArray(project.tech_stack) ? project.tech_stack : [];
    return (
        <div
            className="project-card-item"
            onClick={() => onSelect(project)}
            onMouseEnter={() => audioEngine.playSfx('hover')}
            style={{ cursor: 'pointer', position: 'relative' }}
            title="Click to view target details"
        >
            {/* Top-Right Corner Status Ribbon (Persona 5 Target Notice Tape) */}
            <div
                className={`p5-card-corner-ribbon ${project.status === 'active' ? 'ribbon-active' : 'ribbon-finished'}`}
                title={`Status: ${project.status === 'active' ? 'IN PROGRESS' : 'FINISHED'}`}
            >
                {project.status === 'active' ? '★ IN PROGRESS' : '★ FINISHED'}
            </div>

            <div className="project-card-header">
                {project.image && (
                    <div className="project-card-image-wrap">
                        <img src={project.image} alt={project.title} className="project-card-image" />
                    </div>
                )}
                <div className="project-card-badges">
                    {techStack.slice(0, 3).map(t => (
                        <span key={t} className="tech-badge">{t}</span>
                    ))}
                </div>
            </div>
            <div className="project-card-body">
                <h3 className="project-card-title">{project.title}</h3>
                <p
                    className="project-card-desc"
                    style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        wordBreak: 'break-word',
                        lineHeight: 1.5,
                        maxHeight: '3em',
                        marginBottom: '1rem',
                    }}
                    title={project.description}
                >
                    {project.description}
                </p>
                <div className="project-card-actions" style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                    {project.live_url && (
                        <a
                            href={project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-target-action"
                            onClick={e => e.stopPropagation()}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                background: 'var(--p5-red)',
                                color: '#ffffff',
                                fontWeight: 'bold',
                                padding: '0.45rem 0.9rem',
                                fontSize: '0.85rem',
                                border: '2px solid #ffffff',
                                boxShadow: '3px 3px 0 #000000',
                            }}
                        >
                            <span>LIVE PREVIEW ↗</span>
                        </a>
                    )}
                    {project.repo_url && (
                        <a
                            href={project.repo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-target-action"
                            onClick={e => e.stopPropagation()}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                background: '#000000',
                                color: '#ffffff',
                                fontWeight: 'bold',
                                padding: '0.45rem 0.9rem',
                                fontSize: '0.85rem',
                                border: '2px solid #ffffff',
                                boxShadow: '3px 3px 0 #000000',
                            }}
                        >
                            <span>GITHUB / REPO ↗</span>
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function Projects({ projects = [] }) {
    const [selectedProject, setSelectedProject] = useState(null);

    const handleSelectProject = (proj) => {
        audioEngine.playSfx('select');
        setSelectedProject(proj);
    };

    const handleCloseModal = () => {
        audioEngine.playSfx('click');
        setSelectedProject(null);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && selectedProject) {
                handleCloseModal();
            }
        };
        if (selectedProject) {
            document.body.style.overflow = 'hidden';
            document.body.classList.add('modal-open');
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.body.style.overflow = '';
            document.body.classList.remove('modal-open');
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedProject]);

    return (
        <P5RLayout>
            <Head>
                <title>Projects (Palaces) — Persona 5 Portfolio // PHANSITE</title>
                <meta name="description" content="Explore web applications, architectures, and creative coding missions crafted by Bimasena with Persona 5 Neo-Brutalist UI." />
            </Head>

            <section id="section-projects" className="app-section">
                <div className="projects-header-bar">
                    <h2 className="section-title-cutout">
                        {'PROJECTS'.split('').map((c, i) => <span key={i} className="c-tile">{c}</span>)}
                    </h2>
                </div>

                <div className="portfolio-hero-banner" style={{ marginTop: '1rem', marginBottom: '2rem' }}>
                    <div className="hero-banner-inner">
                        <div className="hero-text-block">
                            <h3 style={{ fontFamily: 'var(--font-p5-menu)', fontSize: '2.2rem', color: '#fff', marginBottom: '0.5rem' }}>
                                INFILTRATION TARGETS // PALACE ARCHIVES
                            </h3>
                            <p style={{ fontFamily: 'var(--font-p5-sans)', color: '#ccc', lineHeight: 1.6, fontSize: '1.05rem' }}>
                                An operational showcase of deployed applications, interactive systems, and engineering exploits. Each target represents a conquered technical challenge crafted with uncompromising performance and Persona-grade aesthetic fidelity.
                            </p>
                        </div>
                    </div>
                </div>

                {projects.length === 0 ? (
                    <div className="p5-empty-state">
                        <div className="empty-state-icon">☠</div>
                        <h3 className="empty-state-text">NO TARGETS AVAILABLE.</h3>
                        <p className="empty-state-subtext">
                            The Metaverse is quiet... No projects published on the Phansite right now.
                        </p>
                    </div>
                ) : (
                    <div className="projects-grid-container">
                        {projects.map(p => (
                            <ProjectCard key={p.id} project={p} onSelect={handleSelectProject} />
                        ))}
                    </div>
                )}
            </section>

            {/* Project Detail Lightbox Modal */}
            {selectedProject && (
                <div
                    className="p5-project-modal-backdrop"
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
                        className="p5-project-modal-dialog"
                        onClick={e => e.stopPropagation()}
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
                                <span style={{
                                    backgroundColor: selectedProject.status === 'active' ? '#00E676' : '#0088FF',
                                    color: selectedProject.status === 'active' ? '#000000' : '#ffffff',
                                    padding: '0.2rem 0.6rem',
                                    fontSize: '0.85rem',
                                    fontWeight: 'bold',
                                    border: '1px solid #ffffff'
                                }}>
                                    PROJECTS // {selectedProject.status === 'active' ? 'IN PROGRESS' : 'FINISHED'}
                                </span>
                                <span style={{ fontSize: '1.1rem', color: '#fff' }}>
                                    {selectedProject.title}
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
                            {/* Project Image Frame */}
                            {selectedProject.image && (
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
                                        src={selectedProject.image}
                                        alt={selectedProject.title}
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '52vh',
                                            objectFit: 'contain',
                                            display: 'block',
                                        }}
                                    />
                                </div>
                            )}

                            {/* Project Header Info */}
                            <div>
                                <h3
                                    style={{
                                        fontFamily: 'var(--font-p5-menu)',
                                        fontSize: '1.7rem',
                                        color: '#ffffff',
                                        margin: '0 0 0.5rem',
                                        letterSpacing: '0.5px',
                                    }}
                                >
                                    {selectedProject.title}
                                </h3>

                                {/* Tech Stack Badges */}
                                {(() => {
                                    const modalTechStack = Array.isArray(selectedProject.tech_stack)
                                        ? selectedProject.tech_stack
                                        : (selectedProject.tech_stack ? String(selectedProject.tech_stack).split(',').map(s => s.trim()).filter(Boolean) : []);

                                    if (modalTechStack.length === 0) return null;

                                    return (
                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.8rem', marginTop: '0.4rem' }}>
                                            {modalTechStack.map(t => (
                                                <span key={t} className="tech-badge">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    );
                                })()}

                                {/* Persona 5 Dialogue Chatbox for Description */}
                                {selectedProject.description && (
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
                                                fontSize: '0.85rem',
                                                letterSpacing: '1px',
                                                transform: 'skewX(-3deg)',
                                                border: '1.5px solid var(--p5-red)',
                                                userSelect: 'none',
                                            }}
                                        >
                                            TARGET MISSION // 記録
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
                                            {selectedProject.description}
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

                            {/* Action Buttons in Modal Footer */}
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
                                {selectedProject.live_url && (
                                    <a
                                        href={selectedProject.live_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-target-action"
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            background: 'var(--p5-red)',
                                            color: '#ffffff',
                                            fontWeight: 'bold',
                                            padding: '0.6rem 1.4rem',
                                            fontSize: '1rem',
                                            border: '2px solid #ffffff',
                                            boxShadow: '4px 4px 0 #000000',
                                        }}
                                    >
                                        <span>🌐 LIVE PREVIEW ↗</span>
                                    </a>
                                )}
                                {selectedProject.repo_url && (
                                    <a
                                        href={selectedProject.repo_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-target-action"
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            background: '#000000',
                                            color: '#ffffff',
                                            fontWeight: 'bold',
                                            padding: '0.6rem 1.4rem',
                                            fontSize: '1rem',
                                            border: '2px solid #ffffff',
                                            boxShadow: '4px 4px 0 #000000',
                                        }}
                                    >
                                        <span>GITHUB / REPO ↗</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </P5RLayout>
    );
}