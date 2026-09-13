import { Head, Link } from '@inertiajs/react';
import P5RLayout from '@/Layouts/P5RLayout';
import { useState, useEffect } from 'react';
import { audioEngine, showToast } from '@/audio';
import axios from 'axios';

function CutoutLetter({ char, style }) {
    return (
        <span className={`cutout-letter ${style || 'style-white'}`}>{char}</span>
    );
}

const COMMENTS_STATIC = [
    { username: 'USERNAME', text: 'Lorem ipsum lorem ipsum lorem ipsum...' },
    { username: 'MISHIMA', text: 'The Phantom Thieves really changed Kamoshida\'s heart! He confessed at assembly!' },
    { username: 'SKEPTIC', text: 'It\'s probably just mass hysteria or a PR stunt. Changing someone\'s heart is impossible!' },
    { username: 'TOKYO_FAN', text: 'Please take down the corrupt plagiarist Madarame next! Save his pupils!' },
];

export default function HomePage({ latestProjects = [], pollData = {} }) {
    // Poll state connected to real database
    const initialPercent = pollData?.percent ?? 88.9;
    const [pollPercent, setPollPercent] = useState(initialPercent);
    const [pollStats, setPollStats] = useState({
        yes: pollData?.yes ?? 48,
        no: pollData?.no ?? 6,
        total: pollData?.total ?? 54,
    });
    const [voted, setVoted] = useState(null);
    const [isVoting, setIsVoting] = useState(false);

    // Comments state
    const [comments, setComments] = useState(COMMENTS_STATIC);
    const [commentText, setCommentText] = useState('');
    const [isAnon, setIsAnon] = useState(false);

    // Selected project for modal detail preview
    const [selectedProject, setSelectedProject] = useState(null);

    // Check previous vote from localStorage or server
    useEffect(() => {
        const localVote = localStorage.getItem('phansite_poll_vote');
        if (localVote) {
            setVoted(localVote);
        } else if (pollData?.userVote) {
            setVoted(pollData.userVote);
        }
    }, [pollData]);



    // Project modal ESC key & scroll locking
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && selectedProject) {
                audioEngine.playSfx('click');
                setSelectedProject(null);
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

    // Functional Vote Handler sending real data to database
    const vote = async (choice) => {
        if (voted) {
            showToast(`YOU ALREADY VOTED "${voted}"! VERDICT LOCKED.`, 'info');
            return;
        }

        if (isVoting) return;
        setIsVoting(true);

        audioEngine.playSfx(choice === 'YES' ? 'vote-yes' : 'vote-no');

        try {
            const response = await axios.post('/poll/vote', { choice });
            if (response.data.success) {
                setPollPercent(response.data.percent);
                setPollStats({
                    yes: response.data.yes,
                    no: response.data.no,
                    total: response.data.total,
                });
                setVoted(choice);
                localStorage.setItem('phansite_poll_vote', choice);
                showToast(response.data.message, choice === 'YES' ? 'success' : 'info');
            }
        } catch (error) {
            console.error('Vote transmission error:', error);
            // Fallback calculation
            const fallbackPct = choice === 'YES'
                ? Math.min(99.9, parseFloat((pollPercent + 1.5).toFixed(1)))
                : Math.max(0.1, parseFloat((pollPercent - 1.5).toFixed(1)));
            setPollPercent(fallbackPct);
            setVoted(choice);
            localStorage.setItem('phansite_poll_vote', choice);
            showToast('VOTE TRANSMITTED TO COGNITION ARCHIVE!', 'success');
        } finally {
            setIsVoting(false);
        }
    };

    const submitComment = () => {
        if (!commentText.trim()) {
            showToast('PLEASE FILL OUT ALL COMMENT FIELDS!', 'error');
            return;
        }

        audioEngine.playSfx('message');
        const newUsername = isAnon ? 'ANONYMOUS' : 'AFICIONADO';
        setComments(prev => [{
            username: newUsername,
            text: commentText.trim()
        }, ...prev]);
        setCommentText('');
        showToast('COMMENT POSTED!', 'success');
    };

    const downloadResume = () => {
        audioEngine.playSfx('select');
        showToast('STEALING CV... ACQUIRING METAVERSE PAYLOAD!', 'success');

        const a = document.createElement('a');
        a.href = '/CV_BIMASENA.pdf';
        a.download = 'CV_BIMASENA.pdf';
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <P5RLayout>
            <Head title="PHANSITE // Phantom Aficionado Website - Persona 5" />

            <section id="section-home" className="app-section">

                {/* Hero Banner */}
                <div className="portfolio-hero-banner">
                    <div className="hero-banner-inner">
                        <div className="hero-text-block">
                            <span className="hero-role-tag">★ COGNITIVE INFILTRATOR &amp; CREATIVE DEVELOPER</span>
                            <h1 className="hero-dev-title">BIMASENA // FULL-STACK DEVELOPER</h1>
                            <p className="hero-dev-tagline">
                                Stealing hearts through high-performance web applications, bespoke reactive architecture, and stunning Persona 5 Neo-Brutalist UI/UX. Transforming distorted bugs into pure digital craftsmanship.
                            </p>
                            <div className="hero-actions-row">
                                <Link href="/projects" className="btn-p5-hero" title="View Targets">
                                    <span>PROJECTS</span> ➔
                                </Link>
                                <button className="btn-p5-hero btn-secondary" onClick={downloadResume} title="Steal Resume">
                                    <span>STEAL CV</span> 
                                </button>
                                <Link href="/contact" className="btn-p5-hero btn-secondary" title="Dispatch Calling Card">
                                    <span>DISPATCH CALLING CARD</span> ✉
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>

                {/* ====================================================================
                    FEATURED MISSIONS: WIDE PROJECT CARDS (TOP 3 LATEST)
                    ==================================================================== */}
                {latestProjects.length > 0 && (
                    <div className="home-projects-showcase">
                        <div className="home-projects-header">
                            <div>
                                <div className="section-title-cutout" style={{ marginBottom: '0.4rem' }}>
                                    <span className="c-tile">P</span>
                                    <span className="c-tile">R</span>
                                    <span className="c-tile">O</span>
                                    <span className="c-tile">J</span>
                                    <span className="c-tile">E</span>
                                    <span className="c-tile">C</span>
                                    <span className="c-tile">T</span>
                                    <span className="c-tile">S</span>
                                </div>
                                <div className="home-projects-sub">
                                    ★ TOP {latestProjects.length} RECENT TARGET OPERATIONS // METAVERSE ARCHIVE
                                </div>
                            </div>
                            <Link href="/projects" className="p5-admin-btn-outline" style={{ padding: '0.5rem 1.2rem', textDecoration: 'none' }}>
                                VIEW ALL TARGETS ➔
                            </Link>
                        </div>

                        <div className="home-wide-projects-list">
                            {latestProjects.map((project) => {
                                const techStack = Array.isArray(project.tech_stack)
                                    ? project.tech_stack
                                    : (project.tech_stack ? String(project.tech_stack).split(',').map(s => s.trim()).filter(Boolean) : []);

                                return (
                                    <div
                                        key={project.id}
                                        className="home-wide-project-card"
                                        onClick={() => {
                                            audioEngine.playSfx('select');
                                            setSelectedProject(project);
                                        }}
                                        onMouseEnter={() => audioEngine.playSfx('hover')}
                                        title="Click to view classified target details"
                                    >
                                        {/* Left: Thumbnail Preview */}
                                        <div className="home-wide-project-thumb">
                                            {project.image ? (
                                                <img src={project.image} alt={project.title} />
                                            ) : (
                                                <div className="home-wide-project-thumb-placeholder">
                                                    <span style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>🃏</span>
                                                    <span>CLASSIFIED TARGET</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Right: Info & Actions */}
                                        <div className="home-wide-project-body">
                                            <div>
                                                <div className="home-wide-project-meta">
                                                    <span className={`home-wide-status-badge ${project.status === 'active' ? 'badge-active' : 'badge-finished'}`}>
                                                        {project.status === 'active' ? '★ IN PROGRESS' : '★ FINISHED'}
                                                    </span>
                                                    <span style={{ color: '#888', fontFamily: 'var(--font-p5-menu)', fontSize: '0.8rem', letterSpacing: '1px' }}>
                                                        TARGET #{project.id}
                                                    </span>
                                                </div>

                                                <h3 className="home-wide-project-title">
                                                    {project.title}
                                                </h3>

                                                {techStack.length > 0 && (
                                                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.8rem' }}>
                                                        {techStack.map(t => (
                                                            <span key={t} className="tech-badge">
                                                                {t}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                <p className="home-wide-project-desc">
                                                    {project.description}
                                                </p>
                                            </div>

                                            <div className="home-wide-project-actions">
                                                <button
                                                    type="button"
                                                    className="btn-home-wide-action btn-details"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        audioEngine.playSfx('select');
                                                        setSelectedProject(project);
                                                    }}
                                                >
                                                    <span>TARGET DETAILS 👁</span>
                                                </button>

                                                {project.live_url && (
                                                    <a
                                                        href={project.live_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn-home-wide-action btn-live"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <span>LIVE PREVIEW ↗</span>
                                                    </a>
                                                )}

                                                {project.repo_url && (
                                                    <a
                                                        href={project.repo_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn-home-wide-action btn-repo"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <span>GITHUB / REPO ↗</span>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="home-projects-all-btn-wrap">
                            <Link href="/projects" className="btn-home-all-projects">
                                <span>DISPATCH TO ALL OPERATIONS (PROJECTS ➔)</span>
                            </Link>
                        </div>
                    </div>
                )}

                {/* ====================================================================
                    POLL BANNER (DO YOU AMAZED BY THIS WEBSITE?)
                    ==================================================================== */}
                <div className="poll-banner-slant-wrapper">
                    <div className="poll-banner-black-strip">
                        <div className="poll-banner-content">
                            <div className="poll-jp-header-tag" style={{ letterSpacing: '2px' }}>
                                ★ PHANSITE COMMUNITY SURVEY
                            </div>

                            <div className="poll-q-title-row">
                                <span className="poll-giant-q">Q</span>
                                <div className="poll-q-text-group">
                                    <h2 className="poll-question-text" style={{ fontSize: '2.4rem', letterSpacing: '0.04em' }}>
                                        DO YOU AMAZED BY<br />
                                        THIS WEBSITE?
                                    </h2>
                                </div>
                            </div>

                            <div className="poll-percentage-wrapper">
                                <div className="poll-percentage-header">
                                    <span className="txt-a-red">A</span>
                                    <span className="txt-yes-orange">YES</span>
                                    <span className="num-percent-orange">{pollPercent}%</span>
                                </div>
                                <div className="poll-underline-red"></div>
                            </div>

                            <div className="poll-progress-outer-wrap">
                                <span className="poll-label-yes">YES ({pollStats.yes})</span>
                                <div className="poll-bar-slanted-track">
                                    <div className="poll-bar-slanted-fill" style={{ width: `${pollPercent}%` }}></div>
                                </div>
                                <span className="poll-label-no">NO ({pollStats.no})</span>
                            </div>

                            <div className="poll-thanks-subtext">
                                {voted ? (
                                    <span>
                                        TOTAL VERDICTS LOGGED IN METAVERSE ARCHIVE: <strong>{pollStats.total}</strong>
                                    </span>
                                ) : (
                                    <span>
                                        CAST YOUR VERDICT TO REGISTER YOUR COGNITION.<br />
                                        TOTAL VERDICTS LOGGED: <strong>{pollStats.total}</strong>
                                    </span>
                                )}
                            </div>

                            <div className="poll-buttons-boxed-row">
                                <button
                                    className={`btn-p5-3d ${voted === 'YES' ? 'is-selected' : ''}`}
                                    onClick={() => vote('YES')}
                                    disabled={isVoting}
                                    title="Vote YES"
                                >
                                    <span className="btn-3d-text">YES</span>
                                    <span className="btn-3d-sub">AMAZED!</span>
                                </button>
                                <button
                                    className={`btn-p5-3d ${voted === 'NO' ? 'is-selected' : ''}`}
                                    onClick={() => vote('NO')}
                                    disabled={isVoting}
                                    title="Vote NO"
                                >
                                    <span className="btn-3d-text">NO</span>
                                    <span className="btn-3d-sub">NOT QUITE</span>
                                </button>
                            </div>

                            <div className="poll-footer-seal">
                                <img src="/assets/img/joker_mask.webp" alt="Phantom Mask" className="poll-seal-mask" />
                                <div className="poll-seal-channel">PHANSITE OPINION VERDICT</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Down Arrow */}
                <div className="poll-down-arrow-wrap">
                    <svg className="p5-down-chevron" viewBox="0 0 24 24" fill="none">
                        <path d="M4 8L12 16L20 8" stroke="#E60012" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>

                {/* Comment Input */}
                <div className="comment-input-strip-wrapper">
                    <div className="comment-author-avatar-box">
                        <img src="/assets/img/joker_mask.webp" alt="Avatar" />
                    </div>
                    <div className="comment-slanted-input-card">
                        <input
                            type="text"
                            className="comment-input-field"
                            placeholder="Enter your comment here..."
                            value={commentText}
                            onChange={e => setCommentText(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && submitComment()}
                            maxLength={200}
                        />
                    </div>
                    <div className="comment-submit-col">
                        <label className="anonymous-checkbox-wrap">
                            <input type="checkbox" checked={isAnon} onChange={e => setIsAnon(e.target.checked)} />
                            <span className="chk-label">Anonymous</span>
                        </label>
                        <button className="btn-p5-send" onClick={submitComment}>SEND</button>
                    </div>
                </div>

                {/* Comments Title */}
                <div className="comments-section-title-wrap">
                    <div className="p5-cutout-title">
                        <CutoutLetter char="C" style="style-white" />
                        <CutoutLetter char="o" style="style-black" />
                        <CutoutLetter char="m" style="style-white" />
                        <CutoutLetter char="m" style="style-black" />
                        <CutoutLetter char="e" style="style-white" />
                        <CutoutLetter char="n" style="style-black" />
                        <CutoutLetter char="t" style="style-white" />
                        <CutoutLetter char="s" style="style-black" />
                    </div>
                </div>

                {/* Comments List */}
                <div className="comments-cards-list">
                    {comments.map((comment, i) => (
                        <div key={i} className="comment-row-item">
                            <div className="comment-row-avatar">
                                <img src="/assets/img/joker_mask.webp" alt="Mask" />
                            </div>
                            <div className="comment-bubble-box">
                                <div className="comment-user-badge">{comment.username}</div>
                                <div className="comment-text-content">{comment.text}</div>
                            </div>
                        </div>
                    ))}
                </div>

            </section>

            {/* ====================================================================
                MODAL: DETAILED PROJECT VIEW
                ==================================================================== */}
            {selectedProject && (
                <div
                    className="p5-project-modal-backdrop"
                    onClick={() => {
                        audioEngine.playSfx('click');
                        setSelectedProject(null);
                    }}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.85)',
                        backdropFilter: 'blur(6px)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1rem',
                        animation: 'fadeIn 0.2s ease-out',
                    }}
                >
                    <div
                        className="p5-project-modal-box"
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
                                onClick={() => {
                                    audioEngine.playSfx('click');
                                    setSelectedProject(null);
                                }}
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
                            </div>

                            {/* Full Description */}
                            <div
                                style={{
                                    backgroundColor: '#121216',
                                    padding: '1.2rem',
                                    borderLeft: '4px solid var(--p5-red)',
                                    fontSize: '0.98rem',
                                    lineHeight: 1.7,
                                    color: '#dddddd',
                                    whiteSpace: 'pre-line',
                                }}
                            >
                                <p style={{ margin: 0 }}>
                                    {selectedProject.description || 'No classified mission briefing provided.'}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
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
                                            padding: '0.6rem 1.2rem',
                                            fontSize: '0.9rem',
                                            border: '2px solid #ffffff',
                                            boxShadow: '4px 4px 0 #000000',
                                        }}
                                    >
                                        <span>LIVE PREVIEW ↗</span>
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
                                            padding: '0.6rem 1.2rem',
                                            fontSize: '0.9rem',
                                            border: '2px solid #ffffff',
                                            boxShadow: '4px 4px 0 #000000',
                                        }}
                                    >
                                        <span>GITHUB / REPOSITORY ↗</span>
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