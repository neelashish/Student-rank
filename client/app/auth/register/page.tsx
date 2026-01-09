'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../hooks/useAuth';
import api from '../../../services/api';

interface College {
    id: string;
    name: string;
    city: string;
}

export default function RegisterPage() {
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        username: '',
        collegeId: '',
    });
    const [colleges, setColleges] = useState<College[]>([]);
    const [error, setError] = useState('');
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
        setError('');
        setLoading(true);

        try {
            await register(formData);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div style={styles.container}>
            <div className="glass-card" style={styles.card}>
                <h1 style={styles.title}>Create Account</h1>
                <p style={styles.subtitle}>Join the leaderboard and start competing</p>

                <form onSubmit={handleSubmit} style={styles.form}>
                    {error && <div style={styles.error}>{error}</div>}

                    <div style={styles.field}>
                        <label style={styles.label}>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            className="input"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Username</label>
                        <input
                            type="text"
                            name="username"
                            className="input"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="johndoe"
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            name="email"
                            className="input"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your@email.com"
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            name="password"
                            className="input"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>College</label>
                        <select
                            name="collegeId"
                            className="input"
                            value={formData.collegeId}
                            onChange={handleChange}
                            required
                            style={styles.select}
                        >
                            <option value="">Select your college</option>
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
                        style={styles.submitButton}
                        disabled={loading}
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <p style={styles.footer}>
                    Already have an account?{' '}
                    <Link href="/auth/login" style={styles.link}>
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    container: {
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
    },
    card: {
        maxWidth: '440px',
        width: '100%',
        padding: '48px',
    },
    title: {
        fontSize: '32px',
        fontWeight: '700',
        marginBottom: '8px',
        textAlign: 'center',
    },
    subtitle: {
        color: 'var(--text-secondary)',
        textAlign: 'center',
        marginBottom: '32px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
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
    error: {
        padding: '12px',
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgb(239, 68, 68)',
        borderRadius: 'var(--radius-sm)',
        color: '#fca5a5',
        fontSize: '14px',
    },
    submitButton: {
        width: '100%',
        marginTop: '8px',
    },
    footer: {
        marginTop: '24px',
        textAlign: 'center',
        color: 'var(--text-secondary)',
        fontSize: '14px',
    },
    link: {
        color: 'var(--primary-light)',
        textDecoration: 'none',
        fontWeight: '600',
    },
};
