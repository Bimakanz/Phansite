import { Head } from '@inertiajs/react';
import P5RLayout from '@/Layouts/P5RLayout';
import { useState, useEffect } from 'react';
import { audioEngine, showToast } from '@/audio';

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

export default function HomePage() {
    const [pollPercent, setPollPercent] = useState(6.7);
    const [comments, setComments] = useState(COMMENTS_STATIC);
    const [commentText, setCommentText] = useState('');
    const [isAnon, setIsAnon] = useState(false);
    const [voted, setVoted] = useState(null);
    const [approvalStat, setApprovalStat] = useState(0);
    const [approvalFill, setApprovalFill] = useState('0%');

    // Animate Approval Rating smoothly on mount
    useEffect(() => {
        let current = 0;
        const target = 98;
        const timer = setInterval(() => {
            current += 2;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            setApprovalStat(current);
        }, 12);

        const fillTimer = setTimeout(() => {
            setApprovalFill('98%');
        }, 150);

        return () => {
            clearInterval(timer);
            clearTimeout(fillTimer);
        };
    }, []);

    const vote = (choice) => {
        if (voted) {
            showToast(`YOU ALREADY VOTED "${voted}"!`, 'info');
            return;
        }

        audioEngine.playSfx(choice === 'YES' ? 'vote-yes' : 'vote-no');
        const newPct = choice === 'YES'
            ? Math.min(99.9, parseFloat((pollPercent + 15).toFixed(1)))
            : Math.max(0.1, parseFloat((pollPercent - 5).toFixed(1)));
        setPollPercent(newPct);
        setVoted(choice);

        if (choice === 'YES') {
            showToast('VOTE SUBMITTED! THE PHANTOM THIEVES HEARD YOU!', 'success');
        } else {
            showToast('VOTE SUBMITTED! SKEPTICISM RECORDED.', 'error');
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
        showToast('STEALING RESUME... DECRYPTING METAVERSE PAYLOAD!', 'success');

        const resumeMarkdown = `# BIMASENA // FULL-STACK SOFTWARE ENGINEER & COGNITIVE CRAFTSMAN
Contact: bimasena@shibuya.io | GitHub: github.com/bimasena | Portfolio: Phansite

## EXECUTIVE SUMMARY
Lead Full-Stack Software Engineer with specialized mastery in React.js, Next.js, Tailwind CSS, Laravel, and resilient cloud architecture. Proven track record of architecting high-performance web systems with striking, uncompromising UI/UX design.

## TECHNICAL ARSENAL
- Frontend: React.js, Next.js, TypeScript, JavaScript (ES6+), Tailwind CSS, Neo-Brutalist Architecture, Web Audio API.
- Backend & Cloud: Laravel, PHP 8+, Node.js, Express, REST APIs, PostgreSQL, MySQL, Redis, Docker, CI/CD pipelines.
- UI/UX & Craftsmanship: Persona 5 Aesthetics, Figma Wireframing, Micro-Interactions, Performance Profiling.

## SELECTED ACHIEVEMENTS
1. Phansite Persona 5 Royal Replica (React, Tailwind, Laravel) - Sub-second load times, authentic audio reactive system.
2. Cognitive CMS Portal - Real-time target tracking and encrypted payload dispatch.
3. Phantom Aficionado Synthesizer (Vanilla ES6, Web Audio API, Canvas)
`;

        const blob = new Blob([resumeMarkdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'BIMASENA_RESUME_COGNITIVE_PAYLOAD.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
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
                                <a href="/projects" className="btn-p5-hero" title="View Targets">
                                    <span>TARGETS (PROJECTS)</span> ➔
                                </a>
                                <button className="btn-p5-hero btn-secondary" onClick={downloadResume} title="Steal Resume">
                                    <span>STEAL RESUME</span> 📄
                                </button>
                                <a href="/contact" className="btn-p5-hero btn-secondary" title="Dispatch Calling Card">
                                    <span>DISPATCH CALLING CARD</span> ✉
                                </a>
                            </div>
                        </div>

                        {/* Approval Widget */}
                        <div className="hero-approval-widget">
                            <div className="approval-widget-header">
                                <span>PHANSITE APPROVAL RATING</span>
                                <span>★ MAX</span>
                            </div>
                            <div className="approval-stat-number" id="hero-approval-number">{approvalStat}%</div>
                            <div className="approval-progress-track">
                                <div className="approval-progress-fill" id="hero-approval-fill" style={{ width: approvalFill }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Poll Banner */}
                <div className="poll-banner-slant-wrapper">
                    <div className="poll-banner-black-strip">
                        <div className="poll-banner-content">
                            <div className="poll-jp-header-tag">怪盗アンケート</div>
                            <div className="poll-q-title-row">
                                <div className="poll-flame-star-badge">
                                    <img src="/assets/img/p5_flame_star.png" alt="Flame Star" className="flame-star-img" />
                                </div>
                                <span className="poll-giant-q">Q</span>
                                <div className="poll-q-text-group">
                                    <div className="poll-question-jp">怪盗団を信じますか、信じませんか？</div>
                                    <h2 className="poll-question-text">
                                        Do you believe in the<br />
                                        Phantom Thieves?
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
                                <span className="poll-label-yes">YES</span>
                                <div className="poll-bar-slanted-track">
                                    <div className="poll-bar-slanted-fill" style={{ width: `${pollPercent}%` }}></div>
                                </div>
                                <span className="poll-label-no">NO</span>
                            </div>

                            <div className="poll-thanks-subtext">
                                投票ありがとうございました。<br />
                                次のアンケートにもご協力下さい。
                            </div>

                            <div className="poll-buttons-boxed-row">
                                <button
                                    className={`btn-p5-3d ${voted === 'YES' ? 'is-selected' : ''}`}
                                    onClick={() => vote('YES')}
                                >
                                    <span className="btn-3d-text">YES</span>
                                    <span className="btn-3d-sub">信じる</span>
                                </button>
                                <button
                                    className={`btn-p5-3d ${voted === 'NO' ? 'is-selected' : ''}`}
                                    onClick={() => vote('NO')}
                                >
                                    <span className="btn-3d-text">NO</span>
                                    <span className="btn-3d-sub">信じない</span>
                                </button>
                            </div>

                            <div className="poll-footer-seal">
                                <img src="/assets/img/joker_mask.png" alt="Phantom Mask" className="poll-seal-mask" />
                                <div className="poll-seal-channel">怪盗チャンネル</div>
                                <div className="poll-seal-id">ID: 怪盗団公式ホームページ</div>
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
                        <img src="/assets/img/joker_mask.png" alt="Avatar" />
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
                                <img src="/assets/img/joker_mask.png" alt="Mask" />
                            </div>
                            <div className="comment-content-wrap">
                                <div className="comment-username-tiles">
                                    {comment.username.split('').map((char, j) => (
                                        <span key={j} className="u-tile">{char}</span>
                                    ))}
                                </div>
                                <div className="comment-bubble-card-white">
                                    <span className="comment-bubble-text">{comment.text}</span>
                                    <button
                                        className="comment-report-flag-btn"
                                        title="Report"
                                        onClick={() => {
                                            audioEngine.playSfx('click');
                                            showToast('FLAGGED FOR MODERATION', 'error');
                                        }}
                                    >
                                        <svg className="flag-icon-svg" viewBox="0 0 24 24" fill="#E60012">
                                            <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6h-5.6z"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="pagination-banner-wrap">
                    <div
                        className="pagination-banner-slanted"
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                            audioEngine.playSfx('click');
                            showToast('PAGE 1 OF 2', 'info');
                        }}
                    >
                        <span>◄</span>
                        <span className="pag-text">1 of 2</span>
                        <span>►</span>
                    </div>
                </div>

            </section>
        </P5RLayout>
    );
}