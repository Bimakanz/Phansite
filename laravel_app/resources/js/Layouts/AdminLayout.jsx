import { Link, usePage, router } from '@inertiajs/react';

export default function AdminLayout({ children }) {
    const { url, props } = usePage();
    const flash = props.flash || {};

    const sidebarLinks = [
        { href: '/admin', label: 'DASHBOARD', icon: '⊞' },
        { href: '/admin/projects', label: 'PROJECTS', icon: '◈' },
        { href: '/admin/experiences', label: 'EXPERIENCES', icon: '◉' },
    ];

    const isActive = (href) => {
        if (href === '/admin') return url === '/admin';
        return url.startsWith(href);
    };

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#0b0b0b' }}>
            {/* Sidebar */}
            <aside className="admin-sidebar" style={{ position: 'relative' }}>
                {/* Brand */}
                <div style={{ padding: '1.5rem', borderBottom: '2px solid rgba(230,0,18,0.3)' }}>
                    <Link href="/" style={{ textDecoration: 'none' }}>
                        <p style={{ fontFamily: 'var(--font-p5-menu)', fontSize: '1.1rem', color: '#fff', letterSpacing: '0.1em', lineHeight: 1.2 }}>
                            ★ COGNITIVE CMS
                        </p>
                        <p style={{ color: 'var(--p5-yellow)', fontFamily: 'var(--font-p5-menu)', fontSize: '0.65rem', letterSpacing: '0.2em', marginTop: '2px' }}>
                            METAVERSE OPERATOR
                        </p>
                    </Link>
                </div>

                <nav style={{ padding: '1rem 0' }}>
                    {sidebarLinks.map(link => (
                        <Link key={link.href} href={link.href}
                            className={`admin-sidebar-link ${isActive(link.href) ? 'active' : ''}`}>
                            <span style={{ fontSize: '1.1rem' }}>{link.icon}</span>
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div style={{ position: 'absolute', bottom: 0, width: '100%', borderTop: '1px solid rgba(230,0,18,0.2)', padding: '1rem' }}>
                    <Link href="/" className="admin-sidebar-link" style={{ fontSize: '0.85rem' }}>
                        <span>↗</span> VIEW SITE
                    </Link>
                    <button onClick={handleLogout} className="admin-sidebar-link"
                        style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                        <span>⏏</span> LOGOUT
                    </button>
                </div>
            </aside>

            {/* Content */}
            <div className="admin-content">
                {flash.success && <div className="p5-flash p5-flash-success">{flash.success}</div>}
                {flash.error   && <div className="p5-flash">{flash.error}</div>}
                {children}
            </div>
        </div>
    );
}