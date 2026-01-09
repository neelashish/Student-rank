'use client';

import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <nav style={styles.nav}>
            <div className="container" style={styles.container}>
                <Link href="/" style={styles.logo}>
                    <span className="gradient-text" style={styles.logoText}>
                        🏆 StudentRank
                    </span>
                </Link>

                <div style={styles.menu}>
                    <Link
                        href="/leaderboard"
                        style={{
                            ...styles.link,
                            ...(isActive('/leaderboard') ? styles.linkActive : {}),
                        }}
                    >
                        Leaderboard
                    </Link>

                    {user ? (
                        <>
                            <Link
                                href="/dashboard"
                                style={{
                                    ...styles.link,
                                    ...(isActive('/dashboard') ? styles.linkActive : {}),
                                }}
                            >
                                Dashboard
                            </Link>
                            <Link
                                href={`/profile/${user.username}`}
                                style={{
                                    ...styles.link,
                                    ...(isActive(`/profile/${user.username}`) ? styles.linkActive : {}),
                                }}
                            >
                                My Profile
                            </Link>
                            <button onClick={logout} className="btn btn-ghost" style={styles.button}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/auth/login" className="btn btn-ghost" style={styles.button}>
                                Login
                            </Link>
                            <Link href="/auth/register" className="btn btn-primary" style={styles.button}>
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

const styles: Record<string, React.CSSProperties> = {
    nav: {
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(15, 15, 35, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-color)',
        padding: '16px 0',
    },
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logo: {
        textDecoration: 'none',
    },
    logoText: {
        fontSize: '24px',
        fontWeight: '800',
    },
    menu: {
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
    },
    link: {
        color: 'var(--text-secondary)',
        textDecoration: 'none',
        fontWeight: '500',
        transition: 'color 0.2s ease',
        padding: '8px 0',
        position: 'relative',
    },
    linkActive: {
        color: 'var(--text-primary)',
    },
    button: {
        marginLeft: '8px',
    },
};
