import { Head } from '@inertiajs/react';
import P5RLayout from '@/Layouts/P5RLayout';

export default function About() {
    const parameters = [
        {
            title: 'KNOWLEDGE', stars: '★★★★★', sub: 'FRONTEND ARCHITECTURE',
            items: ['React.js / Next.js Frameworks', 'Modern JavaScript (ES6+) & TypeScript', 'Tailwind CSS & Neo-Brutalist Styling', 'Responsive UI & Animation Orchestration', 'Web Audio API & State Management']
        },
        {
            title: 'GUTS', stars: '★★★★★', sub: 'BACKEND & SERVERS',
            items: ['Laravel & PHP Ecosystem', 'Node.js / Express.js REST APIs', 'PostgreSQL, MySQL & Redis Caching', 'Authentication & Role Security', 'WebSocket Real-Time Systems']
        },
        {
            title: 'PROFICIENCY', stars: '★★★★☆', sub: 'ENGINEERING & DEVOPS',
            items: ['Git / GitHub Workflow & CI/CD', 'Vite, Webpack & Build Tools', 'Docker Containerization', 'API Design & Integration Testing', 'Web Performance & SEO Optimization']
        },
        {
            title: 'CHARM', stars: '★★★★★', sub: 'UI/UX & COLLABORATION',
            items: ['Persona 5 & Neo-Brutalist Visual Direction', 'Figma Wireframing & Prototyping', 'Agile Methodology & Pair Programming', 'Design System Creation', 'User Empathy & Creative Problem Solving']
        },
    ];

    return (
        <P5RLayout>
            <Head title="About — PHANSITE // Phantom Aficionado" />

            <section id="section-about" className="app-section">
                <div className="section-header-row">
                    <h2 className="section-title-cutout">
                        {'ABOUT'.split('').map((c, i) => <span key={i} className="c-tile">{c}</span>)}
                    </h2>
                    <span className="chat-live-badge">★ PHANTOM PARAMETERS</span>
                </div>

                <div className="portfolio-hero-banner" style={{ marginTop: '1rem' }}>
                    <div className="hero-banner-inner">
                        <div className="hero-text-block">
                            <h3 style={{ fontFamily: 'var(--font-p5-menu)', fontSize: '2.2rem', color: '#fff', marginBottom: '0.5rem' }}>
                                COGNITIVE PROFILE // BIMASENA
                            </h3>
                            <p style={{ fontFamily: 'var(--font-p5-sans)', color: '#ccc', lineHeight: 1.6, fontSize: '1.05rem' }}>
                                A passionate Full-Stack Software Engineer operating from the Metaverse shadows. Armed with an eye for uncompromising visual aesthetics and deep architectural discipline, I build reactive web applications, craft fluid micro-interactions, and design resilient backends.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="about-parameters-grid">
                    {parameters.map(p => (
                        <div key={p.title} className="parameter-card">
                            <div className="parameter-header">
                                <h3 className="parameter-title">{p.title}</h3>
                                <span className="parameter-stars">{p.stars}</span>
                            </div>
                            <p style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '0.8rem', fontWeight: 700 }}>{p.sub}</p>
                            <ul className="parameter-items-list">
                                {p.items.map((item, i) => <li key={i}>{item}</li>)}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>
        </P5RLayout>
    );
}