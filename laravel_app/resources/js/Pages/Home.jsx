import { Head, Link } from '@inertiajs/react';
import P5RLayout from '@/Layouts/P5RLayout';
import { useState, useEffect, useRef } from 'react';
import { audioEngine, showToast } from '@/audio';
import axios from 'axios';

// ─── Cutout Letter Component ──────────────────────────────────────────────────
function CutoutLetter({ char, style }) {
    return (
        <span className={`cutout-letter ${style || 'style-white'}`}>{char}</span>
    );
}

// ─── Time Ago Helper ──────────────────────────────────────────────────────────
function timeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

// ─── Phantom Loading Screen ────────────────────────────────────────────────────
function PhantomLoader({ onEnter }) {
    const [codename, setCodename] = useState('');
    const [isLeaving, setIsLeaving] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        // Focus input on mount
        setTimeout(() => inputRef.current?.focus(), 300);
    }, []);

    const handleEnter = () => {
        if (isLeaving) return;
        const name = codename.trim().toUpperCase() || 'PHANTOM';
        setIsLeaving(true);
        setTimeout(() => {
            onEnter(name);
        }, 650);
    };

    const handleKey = (e) => {
        if (e.key === 'Enter') handleEnter();
    };

    return (
        <div className={`phantom-loader-overlay ${isLeaving ? 'is-leaving' : ''}`}>
            {/* Diagonal background stripes */}
            <div className="phantom-loader-bg" />

            {/* Center Form */}
            <div className="phantom-loader-center">
                <div className="phantom-loader-card">
                    {/* Title */}
                    <div className="phantom-loader-title-block">
                        <div className="phantom-loader-divider" />
                        <p className="phantom-loader-sub">Enter Your Codename</p>
                    </div>

                    {/* Input */}
                    <div className="phantom-loader-input-wrap">
                        <div className="phantom-loader-input-row">
                            <div className="phantom-loader-input-slant">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    className="phantom-loader-input focus:ring-0 focus:outline-none focus:border-transparent"
                                    placeholder="e.g. JOKER, PANTHER..."
                                    value={codename}
                                    onChange={e => setCodename(e.target.value.toUpperCase().slice(0, 20))}
                                    onKeyDown={handleKey}
                                    maxLength={20}
                                    autoComplete="off"
                                    spellCheck={false}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Enter Button */}
                    <button
                        className="phantom-loader-enter-btn"
                        onClick={handleEnter}
                        disabled={isLeaving}
                    >
                        <span className="phantom-loader-btn-text">Enter </span>
                    </button>
                </div>
            </div>

            {/* Joker spinning image — bottom right */}
            <div className="phantom-loader-joker-wrap">
                <img
                    src="/assets/img/p5_take_your_heart_seal.webp"
                    alt="Phantom Thieves Seal"
                    className="phantom-loader-joker-spin"
                />
                <div className="phantom-loader-joker-label">TAKE YOUR HEART</div>
            </div>
        </div>
    );
}


// ─── Main Home Page ────────────────────────────────────────────────────────────
export default function HomePage({ latestProjects = [], pollData = {}, initialComments = [], totalComments = 0 }) {
    // Loading screen state
    const [phantomEntered, setPhantomEntered] = useState(() => {
        if (typeof window === 'undefined') return true;
        return !!sessionStorage.getItem('phantom_codename');
    });
    const [codename, setCodename] = useState(() => {
        if (typeof window === 'undefined') return '';
        return sessionStorage.getItem('phantom_codename') || '';
    });

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

    // Comments state — backed by real DB
    const [comments, setComments] = useState(initialComments || []);
    const [commentText, setCommentText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasMore, setHasMore] = useState((initialComments?.length ?? 0) < totalComments);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // Selected project for modal detail preview
    const [selectedProject, setSelectedProject] = useState(null);

    // Handle loading screen completion
    const handlePhantomEnter = (name) => {
        sessionStorage.setItem('phantom_codename', name);
        setCodename(name);
        setPhantomEntered(true);
    };

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

    // Submit comment to real DB
    const submitComment = async () => {
        if (!commentText.trim()) {
            showToast('TYPE YOUR MESSAGE FIRST!', 'error');
            return;
        }
        if (isSubmitting) return;
        setIsSubmitting(true);

        const username = codename || 'ANONYMOUS';

        try {
            audioEngine.playSfx('message');
            const response = await axios.post('/comments', {
                username,
                text: commentText.trim(),
            });

            if (response.data.success) {
                setComments(prev => [response.data.comment, ...prev]);
                setCommentText('');
                showToast('COMMENT TRANSMITTED TO THE METAVERSE!', 'success');
            }
        } catch (error) {
            if (error.response?.status === 429) {
                showToast(error.response.data.message || 'RATE LIMIT REACHED!', 'error');
            } else {
                showToast('TRANSMISSION FAILED — TRY AGAIN!', 'error');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Load more comments
    const loadMoreComments = async () => {
        if (isLoadingMore || !hasMore) return;
        setIsLoadingMore(true);
        const nextPage = currentPage + 1;
        try {
            const res = await axios.get(`/comments?page=${nextPage}`);
            setComments(prev => [...prev, ...res.data.comments]);
            setHasMore(res.data.has_more);
            setCurrentPage(nextPage);
        } catch {
            showToast('FAILED TO LOAD MORE COMMENTS', 'error');
        } finally {
            setIsLoadingMore(false);
        }
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
        <>
            {/* Loading Screen */}
            {!phantomEntered && (
                <PhantomLoader onEnter={handlePhantomEnter} />
            )}

            <P5RLayout>
                <Head>
                    <title>PHANSITE — Persona 5 Portfolio | Bimasena Full-Stack Developer</title>
                    <meta name="description" content="PHANSITE: An interactive Persona 5 Royal inspired developer portfolio and metaverse platform by Bimasena. Featuring full-stack web applications, reactive architecture, and Neo-Brutalist UI/UX." />
                    <meta name="keywords" content="Persona 5 Portfolio, Persona 5 Portofolio, Persona 5 Website, Phansite, Phantom Aficionado, Bimasena, Persona 5 Web, Full Stack Developer" />
                    <meta property="og:title" content="PHANSITE — Persona 5 Portfolio | Bimasena" />
                    <meta property="og:description" content="Stealing hearts through high-performance web applications and bespoke Persona 5 Neo-Brutalist design." />
                </Head>

                <section id="section-home" className="app-section">
                    {/* Hero Banner */}
                    <div className="portfolio-hero-banner">
                        <div className="hero-banner-inner">
                            <div className="hero-text-block">
                                <span className="hero-role-tag">★ COGNITIVE INFILTRATOR &amp; CREATIVE DEVELOPER</span>
                                {codename && (
                                    <div className="phantom-welcome-tag">
                                        ★ WELCOME, <span className="phantom-welcome-name">{codename}</span>
                                    </div>
                                )}
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
                                        <h2 className="poll-question-text">
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

                    {/* ====================================================================
                        COMMENT SECTION — REAL DATABASE BACKED
                        ==================================================================== */}

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

                    {/* Comment Input */}
                    <div className="comment-input-strip-wrapper">
                        <div className="comment-author-avatar-box">
                            <img src="/assets/img/joker_mask.webp" alt="Avatar" />
                            {codename && (
                                <div className="comment-avatar-name">{codename}</div>
                            )}
                        </div>
                        <div className="comment-slanted-input-card">
                            <input
                                type="text"
                                className="comment-input-field focus:ring-0 focus:outline-none focus:border-transparent"
                                placeholder={codename ? `Post as ${codename}...` : 'Enter your comment here...'}
                                value={commentText}
                                onChange={e => setCommentText(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && submitComment()}
                                maxLength={200}
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="comment-submit-col">
                            <button
                                className="btn-p5-send"
                                onClick={submitComment}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? '...' : 'SEND'}
                            </button>
                        </div>
                    </div>

                    {/* Comments List */}
                    <div className="comments-cards-list">
                        {comments.length === 0 && (
                            <div className="comments-empty-state">
                                <span className="comments-empty-icon">💬</span>
                                <p>BE THE FIRST TO LEAVE A VERDICT IN THE METAVERSE!</p>
                            </div>
                        )}
                        {comments.map((comment, i) => (
                            <div key={comment.id ?? i} className="comment-row-item">
                                <div className="comment-row-avatar">
                                    <img src="/assets/img/joker_mask.webp" alt="Mask" />
                                </div>
                                <div className="comment-content-wrap">
                                    <div className="comment-username-tiles">
                                        {comment.username.split('').map((char, j) => (
                                            <span key={j} className="u-tile">{char}</span>
                                        ))}
                                    </div>
                                    <div className="comment-bubble-card-white">
                                        <span className="comment-bubble-text">{comment.text}</span>
                                        {comment.created_at && (
                                            <span className="comment-timestamp" style={{ position: 'absolute', bottom: '4px', right: '10px', transform: 'skewX(8deg)' }}>
                                                {timeAgo(comment.created_at)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}


                        {/* Load More Button */}
                        {hasMore && (
                            <div className="comments-load-more-wrap">
                                <button
                                    className="btn-comments-load-more"
                                    onClick={loadMoreComments}
                                    disabled={isLoadingMore}
                                >
                                    {isLoadingMore ? '⌛ LOADING...' : '↓ LOAD MORE VERDICTS'}
                                </button>
                            </div>
                        )}
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
        </>
    );
}