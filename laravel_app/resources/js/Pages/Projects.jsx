import { Head } from '@inertiajs/react';
import P5RLayout from '@/Layouts/P5RLayout';

function ProjectCard({ project }) {
    const techStack = Array.isArray(project.tech_stack) ? project.tech_stack : [];
    return (
        <div className="project-card-item" onClick={() => {}}>
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
                    <span className={`request-status-pill ${project.status === 'active' ? 'badge-status-completed' : 'badge-status-pending'}`}>
                        {project.status?.toUpperCase()}
                    </span>
                </div>
            </div>
            <div className="project-card-body">
                <h3 className="project-card-title">{project.title}</h3>
                <p className="project-card-desc">
                    {project.description?.length > 140 ? project.description.slice(0, 140) + '...' : project.description}
                </p>
                <div className="project-card-actions">
                    {project.live_url && (
                        <a href={project.live_url} target="_blank" rel="noreferrer" className="btn-target-action" onClick={e => e.stopPropagation()}>
                            ↗ LIVE DEMO
                        </a>
                    )}
                    {project.repo_url && (
                        <a href={project.repo_url} target="_blank" rel="noreferrer" className="btn-target-action btn-action-secondary" onClick={e => e.stopPropagation()}>
                            { } CODE REPO
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function Projects({ projects }) {
    return (
        <P5RLayout>
            <Head title="Projects — PHANSITE // Phantom Aficionado" />

            <section id="section-projects" className="app-section">
                <div className="projects-header-bar">
                    <h2 className="section-title-cutout">
                        {'PROJECTS'.split('').map((c, i) => <span key={i} className="c-tile">{c}</span>)}
                    </h2>
                    <div style={{ display: 'flex', gap: '0.8rem' }}>
                        <a href="/admin/projects/create" className="btn-p5-send">
                            + ISSUE TARGET (ADMIN)
                        </a>
                    </div>
                </div>

                {projects.length === 0 ? (
                    <div className="p5-empty-state">
                        <div className="empty-state-icon">☠</div>
                        <h3 className="empty-state-text">NO TARGETS AVAILABLE.</h3>
                        <p className="empty-state-subtext">
                            The Metaverse is quiet... No projects on the Phansite right now. Launch the Admin CMS to dispatch a new target!
                        </p>
                        <a href="/admin" className="btn-p5-hero">OPEN ADMIN CMS</a>
                    </div>
                ) : (
                    <div className="projects-grid-container">
                        {projects.map(p => <ProjectCard key={p.id} project={p} />)}
                    </div>
                )}
            </section>
        </P5RLayout>
    );
}