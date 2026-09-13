import { Link, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import { audioEngine } from '@/audio';

function CutoutWord({ word }) {
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
            {word.split('').map((char, i) => (
                <span key={i} className="c-tile">{char}</span>
            ))}
        </span>
    );
}

const TRACKS = [
    { title: 'Beneath the Mask', src: '/assets/audio/beneath_the_mask.mp3' },
    { title: 'Last Surprise', src: '/assets/audio/last_surprise.mp3' },
    { title: 'Phantom', src: '/assets/audio/phantom.mp3' },
];

const NOW_PLAYING_CHARS = [
    { char: 'N', idx: 0 },
    { char: 'O', idx: 1 },
    { char: 'W', idx: 2 },
    { isSpace: true },
    { char: 'P', idx: 3 },
    { char: 'L', idx: 4 },
    { char: 'A', idx: 5 },
    { char: 'Y', idx: 6 },
    { char: 'I', idx: 7 },
    { char: 'N', idx: 8 },
    { char: 'G', idx: 9 },
];

export default function P5RLayout({ children }) {
    const { url } = usePage();
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [trackIndex, setTrackIndex] = useState(0);
    const [isWaving, setIsWaving] = useState(false);
    const [isSpinning, setIsSpinning] = useState(false);
    const [isGlitching, setIsGlitching] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isTuning, setIsTuning] = useState(false);
    const audioRef = useRef(null);

    const navLinks = [
        { href: '/', word: 'HOME', name: 'home' },
        { href: '/about', word: 'ABOUT', name: 'about' },
        { href: '/projects', word: 'PROJECTS', name: 'projects' },
        { href: '/experience', word: 'EXPERIENCE', name: 'experience' },
        { href: '/contact', word: 'CONTACT', name: 'contact' },
    ];

    const isActive = (href) => {
        if (href === '/') return url === '/';
        return url.startsWith(href);
    };

    const triggerWave = () => {
        setIsWaving(false);
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setIsWaving(true);
            });
        });
    };

    const triggerSongChangeAnimations = () => {
        setIsWaving(false);
        setIsSpinning(false);
        setIsGlitching(false);
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setIsWaving(true);
                setIsSpinning(true);
                setIsGlitching(true);
            });
        });
    };

    // Initial bounce
    useEffect(() => {
        triggerWave();
    }, []);

    // Periodic bounce while song is playing
    useEffect(() => {
        if (!isPlaying) return;
        const timer = setInterval(() => {
            triggerWave();
        }, 3600);
        return () => clearInterval(timer);
    }, [isPlaying]);

    const togglePlay = () => {
        if (!audioRef.current) return;
        audioEngine.playSfx('click');
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
            triggerWave();
        } else {
            audioRef.current.play().catch(() => {});
            setIsPlaying(true);
            triggerWave();
        }
    };

    const changeTrack = (direction) => {
        if (isTuning) return;
        setIsTuning(true);
        audioEngine.playRadioStatic();

        if (audioRef.current) {
            audioRef.current.pause();
        }
        setIsPlaying(false);

        // Trigger album 3D card flip immediately
        setIsSpinning(false);
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setIsSpinning(true);
            });
        });

        const nextIdx = direction === 'next'
            ? (trackIndex + 1) % TRACKS.length
            : (trackIndex - 1 + TRACKS.length) % TRACKS.length;

        // Jeda suara radio ganti saluran (~380ms)
        setTimeout(() => {
            setTrackIndex(nextIdx);
            setIsTuning(false);

            // Glitch punch animation on new song title
            setIsGlitching(false);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsGlitching(true);
                });
            });

            triggerWave();

            setTimeout(() => {
                if (audioRef.current) {
                    audioRef.current.load();
                    audioRef.current.play().catch(() => {});
                    setIsPlaying(true);
                }
            }, 60);
        }, 380);
    };

    const prevTrack = () => changeTrack('prev');
    const nextTrack = () => changeTrack('next');

    const toggleMute = () => {
        if (!audioRef.current) return;
        audioEngine.playSfx('select');
        audioRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    const toggleMiniPlayer = () => {
        audioEngine.playSfx('click');
        setIsMinimized(prev => !prev);
    };

    return (
        <div style={{ minHeight: '100vh' }}>
            <audio ref={audioRef} loop style={{ display: 'none' }}>
                <source src={TRACKS[trackIndex].src} type="audio/mpeg" />
            </audio>

            {/* ── HEADER ───────────────────────────────────────────────── */}
            <header className="p5-header">
                <div className="header-inner">
                    <nav className="main-nav" aria-label="Main Navigation">
                        {navLinks.map(link => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`nav-tab-btn ${isActive(link.href) ? 'is-active' : ''}`}
                                title={link.word}
                                onClick={() => audioEngine.playSfx('tab')}
                                style={{ textDecoration: 'none' }}
                            >
                                <CutoutWord word={link.word} />
                            </Link>
                        ))}
                    </nav>
                </div>
            </header>

            {/* ── MAIN ─────────────────────────────────────────────────── */}
            <main className="app-container">
                {children}
            </main>

            {/* ── FLOATING MUSIC BOX ───────────────────────────────────── */}
            <aside className={`figma-p5-music-box ${isPlaying ? 'is-playing' : ''} ${isMinimized ? 'is-minimized' : ''}`} id="floating-music-player">
                <div className="music-box-frame">
                    <img src="/assets/img/p5_music_banner_only.png" alt="Persona 5 OST Music Player" className="music-box-bg" />

                    <div className={`music-box-album-wrap ${isSpinning ? 'is-spinning' : ''}`} id="music-box-album-wrap" onAnimationEnd={() => setIsSpinning(false)}>
                        <img src="/assets/img/p5_music_album_art.png" alt="Album Art" className="music-box-album-art" />
                    </div>

                    <button className="music-box-mini-toggle" id="music-box-mini-toggle" onClick={toggleMiniPlayer} title="Minimize / Expand Player">
                        <span id="mini-toggle-icon">{isMinimized ? '▲' : '▼'}</span>
                    </button>

                    <div className="music-box-content">
                        <div className={`music-box-now-playing ${isWaving ? 'is-waving' : ''}`} id="np-wave-text" onAnimationEnd={() => setIsWaving(false)}>
                            {NOW_PLAYING_CHARS.map((item, idx) =>
                                item.isSpace ? (
                                    <span key={idx} className="char-space">&nbsp;</span>
                                ) : (
                                    <span key={idx} className="char" style={{ '--char-index': item.idx }}>
                                        {item.char}
                                    </span>
                                )
                            )}
                        </div>
                        <div className={`music-box-title ${isGlitching ? 'is-glitching' : ''}`} id="np-track-title" onAnimationEnd={() => setIsGlitching(false)}>
                            {TRACKS[trackIndex].title}
                        </div>

                        <div className="music-box-controls">
                            <button className="m-btn btn-prev" onClick={prevTrack} title="Previous Track">
                                <svg viewBox="0 0 24 24" className="m-icon">
                                    <path d="M6 5h3v14H6zm3.5 7l10 7V5z"/>
                                </svg>
                            </button>

                            <button className="m-btn btn-play" id="btn-music-play-toggle" onClick={togglePlay} title="Play / Pause">
                                <svg viewBox="0 0 24 24" className="m-icon icon-play">
                                    <polygon points="6,4 20,12 6,20"/>
                                </svg>
                                <svg viewBox="0 0 24 24" className="m-icon icon-pause">
                                    <rect x="6" y="4" width="4" height="16"/>
                                    <rect x="14" y="4" width="4" height="16"/>
                                </svg>
                            </button>

                            <button className="m-btn btn-next" onClick={nextTrack} title="Next Track">
                                <svg viewBox="0 0 24 24" className="m-icon">
                                    <path d="M5 19l10-7-10-7v14zM16 5h3v14h-3z"/>
                                </svg>
                            </button>

                            <button className={`m-btn btn-volume ${isMuted ? 'is-muted' : ''}`} onClick={toggleMute} title="Mute / Unmute">
                                <svg viewBox="0 0 24 24" className="m-icon icon-vol">
                                    {isMuted ? (
                                        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                                    ) : (
                                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* ── TOAST NOTIFICATIONS ──────────────────────────────────── */}
            <div id="p5-toast-container"></div>
        </div>
    );
}