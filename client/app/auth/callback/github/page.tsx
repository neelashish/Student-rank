'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '../../../../services/api';

export default function GitHubCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState('');
    const [needsRegistration, setNeedsRegistration] = useState(false);
    const [githubData, setGithubData] = useState<any>(null);

    useEffect(() => {
        handleCallback();
    }, []);

    const handleCallback = async () => {
        const code = searchParams.get('code');
        const errorParam = searchParams.get('error');

        if (errorParam) {
            setError('GitHub authorization cancelled');
            setTimeout(() => router.push('/auth/login'), 2000);
            return;
        }

        if (!code) {
            setError('No authorization code received');
            setTimeout(() => router.push('/auth/login'), 2000);
            return;
        }

        try {
            const response = await api.post('/oauth/github', { code });

            if (response.data.requiresRegistration) {
                // New user - need to complete registration
                setNeedsRegistration(true);
                setGithubData(response.data.githubData);
            } else {
                // Existing user - save token and redirect
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                router.push('/dashboard');
            }
        } catch (err: any) {
            console.error('GitHub OAuth error:', err);
            setError(err.response?.data?.error || 'Authentication failed');
            setTimeout(() => router.push('/auth/login'), 3000);
        }
    };

    const completeRegistration = async (collegeId: string, username: string) => {
        try {
            const response = await api.post('/oauth/complete-registration', {
                ...githubData,
                collegeId,
                username,
                provider: 'github',
            });

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    if (error) {
        return (
            <div style={styles.container}>
                <div className="glass-card" style={styles.card}>
                    <h2 style={styles.errorTitle}>❌ Authentication Failed</h2>
                    <p style={styles.errorText}>{error}</p>
                    <p style={styles.redirect}>Redirecting to login...</p>
                </div>
            </div>
        );
    }

    if (needsRegistration && githubData) {
        return <RegistrationCompletion githubData={githubData} onComplete={completeRegistration} />;
    }

    return (
        <div style={styles.container}>
            <div className="glass-card" style={styles.card}>
                <div className="spinner"></div>
                <p style={styles.loadingText}>Authenticating with GitHub...</p>
            </div>
        </div>
    );
}

function RegistrationCompletion({ githubData, onComplete }: any) {
    const [username, setUsername] = useState(githubData.username || '');
    const [collegeId, setCollegeId] = useState('');
    const [colleges, setColleges] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchColleges();
    }, []);

    const fetchColleges = async () => {
        try {
            const response = await api.get('/colleges');
            setColleges(response.data);
        } catch (err) {
            console.error('Failed to fetch colleges:', err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await onComplete(collegeId, username);
        setLoading(false);
    };

    return (
        <div style={styles.container}>
            <div className="glass-card" style={styles.card}>
                <h1 style={styles.title}>Complete Your Registration</h1>
                <p style={styles.subtitle}>Just one more step!</p>

                <div style={styles.githubInfo}>
                    {githubData.avatar && (
                        <img src={githubData.avatar} alt="Avatar" style={styles.avatar} />
                    )}
                    <div>
                        <div style={styles.infoLabel}>Name: {githubData.name}</div>
                        <div style={styles.infoLabel}>Email: {githubData.email}</div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.field}>
                        <label style={styles.label}>Username</label>
                        <input
                            type="text"
                            className="input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Select Your College</label>
                        <select
                            className="input"
                            value={collegeId}
                            onChange={(e) => setCollegeId(e.target.value)}
                            required
                            style={styles.select}
                        >
                            <option value="">Choose a college</option>
                            {colleges.map((college) => (
                                <option key={college.id} value={college.id}>
                                    {college.name} - {college.city}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={styles.submitButton}
                    >
                        {loading ? 'Completing...' : 'Complete Registration'}
                    </button>
                </form>
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
    },
    card: {
        maxWidth: '500px',
        width: '100%',
        padding: '48px',
        textAlign: 'center',
    },
    title: {
        fontSize: '28px',
        fontWeight: '700',
        marginBottom: '8px',
    },
    subtitle: {
        color: 'var(--text-secondary)',
        marginBottom: '32px',
    },
    loadingText: {
        marginTop: '20px',
        color: 'var(--text-secondary)',
    },
    errorTitle: {
        fontSize: '24px',
        fontWeight: '700',
        marginBottom: '16px',
    },
    errorText: {
        color: '#fca5a5',
        marginBottom: '16px',
    },
    redirect: {
        color: 'var(--text-tertiary)',
        fontSize: '14px',
    },
    githubInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '20px',
        background: 'var(--bg-tertiary)',
        borderRadius: 'var(--radius-sm)',
        marginBottom: '32px',
        textAlign: 'left',
    },
    avatar: {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
    },
    infoLabel: {
        color: 'var(--text-secondary)',
        fontSize: '14px',
        marginBottom: '4px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        textAlign: 'left',
    },
    field: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    label: {
        fontSize: '14px',
        fontWeight: '600',
        color: 'var(--text-primary)',
    },
    select: {
        cursor: 'pointer',
    },
    submitButton: {
        width: '100%',
        marginTop: '8px',
    },
};
