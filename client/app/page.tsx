'use client';

import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div className="container">
          <div style={styles.heroContent}>
            <h1 style={styles.title} className="gradient-text">
              Track Your Coding Journey
            </h1>
            <p style={styles.subtitle}>
              Compete with students across colleges. Connect your GitHub, LeetCode, and HackerRank profiles to climb the leaderboard!
            </p>
            <div style={styles.cta}>
              {user ? (
                <Link href="/leaderboard" className="btn btn-primary" style={styles.button}>
                  View Leaderboard →
                </Link>
              ) : (
                <>
                  <Link href="/auth/register" className="btn btn-primary" style={styles.button}>
                    Get Started
                  </Link>
                  <Link href="/auth/login" className="btn btn-secondary" style={styles.button}>
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={styles.features}>
        <div className="container">
          <h2 style={styles.sectionTitle}>Why StudentRank?</h2>
          <div style={styles.featureGrid}>
            <div className="glass-card" style={styles.featureCard}>
              <div style={styles.featureIcon}>🏆</div>
              <h3 style={styles.featureTitle}>Competitive Leaderboard</h3>
              <p style={styles.featureText}>
                See where you stand among your peers. Compete globally or filter by your college.
              </p>
            </div>
            <div className="glass-card" style={styles.featureCard}>
              <div style={styles.featureIcon}>⚡</div>
              <h3 style={styles.featureTitle}>Multi-Platform Tracking</h3>
              <p style={styles.featureText}>
                Connect GitHub, LeetCode, and HackerRank. All your progress in one place.
              </p>
            </div>
            <div className="glass-card" style={styles.featureCard}>
              <div style={styles.featureIcon}>📊</div>
              <h3 style={styles.featureTitle}>Smart Scoring</h3>
              <p style={styles.featureText}>
                Fair ranking algorithm that values quality over quantity across all platforms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.ctaSection}>
        <div className="container">
          <div className="glass-card" style={styles.ctaCard}>
            <h2 style={styles.ctaTitle}>Ready to start competing?</h2>
            <p style={styles.ctaText}>
              Join thousands of students showcasing their coding skills
            </p>
            {!user && (
              <Link href="/auth/register" className="btn btn-primary" style={styles.button}>
                Create Your Profile
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: 'calc(100vh - 80px)',
  },
  hero: {
    padding: '120px 0 80px',
    textAlign: 'center',
  },
  heroContent: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  title: {
    fontSize: '64px',
    fontWeight: '800',
    marginBottom: '24px',
    lineHeight: '1.1',
  },
  subtitle: {
    fontSize: '20px',
    color: 'var(--text-secondary)',
    marginBottom: '48px',
    lineHeight: '1.6',
  },
  cta: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
  },
  button: {
    padding: '16px 32px',
    fontSize: '16px',
  },
  features: {
    padding: '80px 0',
    background: 'var(--bg-secondary)',
  },
  sectionTitle: {
    fontSize: '40px',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: '64px',
    color: 'var(--text-primary)',
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '32px',
  },
  featureCard: {
    padding: '40px',
    textAlign: 'center',
  },
  featureIcon: {
    fontSize: '48px',
    marginBottom: '24px',
  },
  featureTitle: {
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '16px',
    color: 'var(--text-primary)',
  },
  featureText: {
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
  },
  ctaSection: {
    padding: '80px 0',
  },
  ctaCard: {
    padding: '64px',
    textAlign: 'center',
  },
  ctaTitle: {
    fontSize: '36px',
    fontWeight: '700',
    marginBottom: '16px',
    color: 'var(--text-primary)',
  },
  ctaText: {
    fontSize: '18px',
    color: 'var(--text-secondary)',
    marginBottom: '32px',
  },
};
