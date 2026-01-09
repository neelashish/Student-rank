import type { Metadata } from 'next';
import { AuthProvider } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'StudentRank - Track Your Coding Progress',
  description: 'Competitive leaderboard platform for students to showcase their coding journey across GitHub, LeetCode, and HackerRank',
  keywords: ['coding', 'leaderboard', 'github', 'leetcode', 'hackerrank', 'students', 'ranking'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <AuthProvider>
          <Navbar />
          <main style={{ minHeight: 'calc(100vh - 80px)' }}>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
