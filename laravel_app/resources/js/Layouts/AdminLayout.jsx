import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { audioEngine } from '@/audio';

export default function AdminLayout({ children }) {
    const { url, props } = usePage();
    const flash = props.flash || {};
    const [mobileOpen, setMobileOpen] = useState(false);

    const sidebarLinks = [
        { href: '/admin', label: 'DASHBOARD', icon: '⊞' },
        { href: '/admin/calling-cards', label: 'CALLING CARDS', iconImg: '/assets/img/p5_calling_card_icon.webp' },
        { href: '/admin/projects', label: 'PROJECTS', icon: '◈' },
        { href: '/admin/experiences', label: 'EXPERIENCES', icon: '◉' },
        { href: '/admin/certificates', label: 'CERTIFICATES', icon: '★' },
    ];

    const isActive = (href) => {
        if (href === '/admin') return url === '/admin';
        return url.startsWith(href);
    };

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    const toggleMobileMenu = () => {
        audioEngine.playSfx('click');
        setMobileOpen(prev => !prev);
    };

    const closeMobileMenu = () => {
        setMobileOpen(false);
    };

    return (
        <div className="admin-root-container">
            {/* Mobile Top Navigation Bar (Visible only on < 1024px) */}
            <div className="admin-mobile-topbar">
                <button
                    type="button"
                    className="admin-mobile-menu-btn"
                    onClick={toggleMobileMenu}
                    aria-label="Toggle Navigation Menu"
                >
                    <span className="admin-menu-icon">{mobileOpen ? '✕' : '☰'}</span>
                    <span>MENU</span>
                </button>

                <div className="admin-mobile-brand">
                    <span className="brand-title">COGNITIVE CMS</span>
                    <span className="brand-badge">OPERATOR</span>
                </div>

                <div className="admin-mobile-actions">
                    <Link href="/" className="admin-mobile-quick-link" title="View Public Site">
                        ↗ SITE
                    </Link>
                </div>
            </div>

            {/* Mobile Backdrop Overlay */}
            {mobileOpen && (
                <div
                    className="admin-mobile-backdrop"
                    onClick={closeMobileMenu}
                />
            )}

            {/* Sidebar (Pinned on Desktop, Slide-in Drawer on Mobile) */}
            <aside className={`admin-sidebar ${mobileOpen ? 'is-mobile-open' : ''}`}>
                {/* Brand Header */}
                <div style={{ padding: '1.5rem', borderBottom: '2px solid rgba(230,0,18,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link href="/" onClick={closeMobileMenu} style={{ textDecoration: 'none' }}>
                        <p style={{ fontFamily: 'var(--font-p5-menu)', fontSize: '1.1rem', color: '#fff', letterSpacing: '0.1em', lineHeight: 1.2 }}>
                            COGNITIVE CMS
                        </p>
                        <p style={{ color: 'var(--p5-yellow)', fontFamily: 'var(--font-p5-menu)', fontSize: '0.65rem', letterSpacing: '0.2em', marginTop: '2px' }}>
                            METAVERSE OPERATOR
                        </p>
                    </Link>
                    <button
                        type="button"
                        className="admin-drawer-close-btn"
                        onClick={closeMobileMenu}
                        aria-label="Close Menu"
                    >
                        ✕
                    </button>
                </div>

                <nav style={{ padding: '1rem 0' }}>
                    {sidebarLinks.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => {
                                audioEngine.playSfx('select');
                                closeMobileMenu();
                            }}
                            className={`admin-sidebar-link ${isActive(link.href) ? 'active' : ''}`}
                            style={{ fontFamily: 'var(--font-p5-heading)', fontWeight: 'bold', fontSize: '1rem', letterSpacing: '0.12em' }}
                        >
                            {link.iconImg ? (
                                <img
                                    src={link.iconImg}
                                    alt=""
                                    style={{
                                        width: '22px',
                                        height: '22px',
                                        objectFit: 'contain',
                                        filter: 'drop-shadow(1px 1px 0 #000)',
                                        display: 'inline-block'
                                    }}
                                />
                            ) : (
                                <span style={{ fontSize: '1.2rem' }}>{link.icon}</span>
                            )}
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="admin-sidebar-footer">
                    <Link href="/" onClick={closeMobileMenu} className="admin-sidebar-link" style={{ fontSize: '0.85rem' }}>
                        <span>↗</span> VIEW SITE
                    </Link>
                    <button onClick={handleLogout} className="admin-sidebar-link"
                        style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                        <span>⏏</span> LOGOUT
                    </button>
                </div>
            </aside>

            {/* Content Area */}
            <div className="admin-content">
                {flash.success && <div className="p5-flash p5-flash-success">{flash.success}</div>}
                {flash.error   && <div className="p5-flash">{flash.error}</div>}
                {children}
            </div>
        </div>
    );
}