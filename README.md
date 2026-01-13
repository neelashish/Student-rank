# Student Ranking Platform 🏆

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)

**A competitive coding platform for students to track progress, compete globally, and showcase achievements**

[Features](#features) • [Tech Stack](#tech-stack) • [Setup](#setup-instructions) • [Documentation](#documentation)

</div>

---

## 📋 Features

### ✅ Phase 1 - Complete
- 🔐 **Email/Password Authentication** - Secure user registration and login
- 🔗 **GitHub Integration** - Automatic stats fetching from GitHub profiles
- 📝 **Multi-Platform Support** - Manual LeetCode and HackerRank username input
- 🏅 **Global Leaderboard** - Competitive ranking system with real-time updates
- 🎓 **College Filtering** - Filter and compete with students from your institution
- 📊 **Smart Scoring** - Weighted algorithm combining multiple platforms

### ✅ Phase 2 - Complete
- 🔑 **OAuth 2.0 Login** - Sign in with GitHub or Google
- � **Enhanced Security** - Modern authentication flow with JWT tokens
- 👤 **Profile Management** - Automatic profile creation from OAuth providers

### 🚧 Phase 3 (Planned)
- 📈 **Progress Visualizations** - Interactive charts and analytics
- 🏆 **Achievement Badges** - Earn badges for milestones
- 🔔 **Smart Notifications** - Stay updated on rank changes
- 🔗 **Public Profiles** - Share your coding journey

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Modern CSS with glassmorphism and animations
- **State Management**: React Context + Hooks
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens
- **Validation**: Zod

## 📁 Project Structure

```
student-rank/
├── client/              # Next.js 14 frontend application
│   ├── app/            # App router pages
│   ├── components/     # Reusable React components
│   ├── hooks/          # Custom React hooks (useAuth, etc.)
│   └── lib/            # Utility functions and API clients
├── server/              # Express.js backend API
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Auth, validation middleware
│   │   ├── routes/        # API routes
│   │   └── utils/         # Helper functions
│   └── prisma/            # Database schema and migrations
├── docs/                # Project documentation
│   ├── OAUTH_SETUP.md    # OAuth configuration guide
│   └── PHASE2_SETUP.md   # Phase 2 implementation details
└── README.md
```

---

## 🚀 Setup Instructions

### Prerequisites
Ensure you have these installed:
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/download/))
- **npm** or **yarn** (comes with Node.js)
- **Git** (for cloning the repository)

### 1️⃣ Clone the Repository

```bash
git clone <your-repository-url>
cd student-rank
```

### 2️⃣ Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE studentrank;
```

Or use your PostgreSQL GUI tool (pgAdmin, DBeaver, etc.)

### 3️⃣ Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your credentials (see Environment Variables section below)

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Start development server
npm run dev
```

The backend should now be running on `http://localhost:5000`

### 4️⃣ Frontend Setup

Open a new terminal:

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Edit .env.local with your configuration

# Start development server
npm run dev
```

The frontend should now be running on `http://localhost:3000`

### 5️⃣ OAuth Setup (Optional but Recommended)

To enable **"Continue with GitHub"** and **"Continue with Google"** features:

1. **Create OAuth Apps** - Follow the detailed guide in [docs/OAUTH_SETUP.md](docs/OAUTH_SETUP.md)
2. **Update Environment Variables** - Add OAuth credentials to both server and client `.env` files
3. **Restart Servers** - Restart both frontend and backend servers

> **💡 Tip**: You can skip OAuth setup initially and use email/password authentication to test the platform.

### ✅ Verify Installation

Visit `http://localhost:3000` and you should see the login page. Try:
- Creating a new account with email/password
- Logging in with OAuth (if configured)
- Viewing the leaderboard

## 🔧 Environment Variables

### Server (.env)
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/studentrank"

# Authentication
JWT_SECRET="your-secret-key-here"

# GitHub Integration
GITHUB_TOKEN="your-github-personal-access-token"

# OAuth - GitHub
GITHUB_CLIENT_ID="your-github-oauth-client-id"
GITHUB_CLIENT_SECRET="your-github-oauth-client-secret"

# OAuth - Google
GOOGLE_CLIENT_ID="your-google-oauth-client-id"
GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"

# Server Configuration
PORT=5000
CLIENT_URL=http://localhost:3000
```

### Client (.env.local)
```env
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:5000

# OAuth Client IDs (Public)
NEXT_PUBLIC_GITHUB_CLIENT_ID="your-github-oauth-client-id"
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-google-oauth-client-id"
```

> **📚 OAuth Setup Guide**: For detailed instructions on setting up GitHub and Google OAuth, see [docs/OAUTH_SETUP.md](docs/OAUTH_SETUP.md)

---

## 📚 Documentation

- **[OAuth Setup Guide](docs/OAUTH_SETUP.md)** - Complete guide for GitHub and Google OAuth configuration
- **[Phase 2 Setup](docs/PHASE2_SETUP.md)** - Detailed Phase 2 implementation guide
- **[Vercel Deployment Guide](docs/VERCEL_DEPLOYMENT.md)** - Step-by-step guide to deploy to Vercel
- **[API Reference](docs/API.md)** - Complete API documentation (if available)
- **[Database Schema](docs/SCHEMA.md)** - Database structure and relationships (if available)

---

## 🎯 Ranking Algorithm

The ranking system combines scores from multiple platforms:

- **GitHub Score** (40%): Based on repositories, stars, and commits
- **LeetCode Score** (40%): Based on problems solved and contest rating
- **HackerRank Score** (20%): Based on stars and badges

Total score is normalized to a 0-1000 scale for fair comparison across all students.

---

## 🛠️ Troubleshooting

### Common Issues

#### **Database Connection Error**
```
Error: Can't reach database server at `localhost:5432`
```
**Solution**: 
- Ensure PostgreSQL is running
- Verify database credentials in `server/.env`
- Check if the database `studentrank` exists

#### **OAuth Login Not Working**
**Solution**:
- Verify OAuth credentials are set in both `server/.env` and `client/.env.local`
- Check that redirect URIs match in OAuth app settings
- See [docs/OAUTH_SETUP.md](docs/OAUTH_SETUP.md) for detailed setup

#### **Port Already in Use**
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**:
- Kill the process using the port: `npx kill-port 5000` (or `3000` for frontend)
- Or change the port in your environment variables

#### **Prisma Client Not Generated**
```
Error: @prisma/client did not initialize yet
```
**Solution**:
```bash
cd server
npx prisma generate
```

### Need More Help?

- Check existing [Issues](../../issues) on GitHub
- Review [docs/OAUTH_SETUP.md](docs/OAUTH_SETUP.md) for OAuth problems
- Check [docs/PHASE2_SETUP.md](docs/PHASE2_SETUP.md) for Phase 2 features

---

## 💻 Useful Commands

### Backend (Server)
```bash
# Development
npm run dev                    # Start dev server with hot reload

# Database
npx prisma studio             # Open Prisma Studio (GUI for database)
npx prisma generate           # Generate Prisma client
npx prisma db push            # Push schema changes to database
npx prisma migrate dev        # Create and apply migrations

# Utilities
npm run build                 # Build for production
npm start                     # Run production server
```

### Frontend (Client)
```bash
# Development
npm run dev                   # Start Next.js dev server

# Production
npm run build                 # Build for production
npm start                     # Start production server
npm run lint                  # Run ESLint
```

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Ways to Contribute
- 🐛 **Report Bugs** - Found a bug? Open an issue with details
- 💡 **Suggest Features** - Have an idea? We'd love to hear it
- 📝 **Improve Documentation** - Help make our docs better
- 💻 **Submit Pull Requests** - Fix bugs or add features

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to your branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Style
- Follow existing code patterns
- Use TypeScript for type safety
- Write meaningful commit messages
- Add comments for complex logic

---

## 📸 Screenshots

> **Coming Soon**: Live demo and screenshots showcasing the platform's features

---

## 🎓 About

This is a student project created to help students:
- Track their coding progress across multiple platforms
- Compete with peers in a healthy, motivating environment
- Showcase their achievements to potential employers
- Build a comprehensive coding portfolio

---

## 📞 Support & Contact

- **Issues**: Report bugs via [GitHub Issues](../../issues)
- **Discussions**: Join conversations in [GitHub Discussions](../../discussions)
- **Documentation**: Check the `docs/` folder for detailed guides

---

## 📄 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- Built with ❤️ by students, for students
- Powered by [Next.js](https://nextjs.org/), [Express](https://expressjs.com/), and [PostgreSQL](https://www.postgresql.org/)
- OAuth integration made easy with GitHub and Google APIs
- Special thanks to all contributors!

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with 💻 and ☕

</div>
