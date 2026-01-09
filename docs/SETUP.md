# StudentRank - Setup Guide

## 📋 Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ installed and running
- Git installed

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Create .env file
copy .env.example .env  # Windows
# cp .env.example .env    # Mac/Linux

# Edit .env and update these values:
# DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/studentrank"
# JWT_SECRET="your-super-secret-key-here"
# GITHUB_TOKEN="your-github-token-here" (optional, for higher rate limits)

# Generate Prisma client and push schema to database
npx prisma generate
npx prisma db push

# Seed some colleges (optional)
# You can add colleges manually using Prisma Studio or via API
npx prisma studio

# Start the development server
npm run dev
```

Backend should now be running on http://localhost:5000

### 2. Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local

# Start the development server
npm run dev
```

Frontend should now be running on http://localhost:3000

##  ✅ Testing the Application

### 1. Add Sample Colleges

Open Prisma Studio:
```bash
cd server
npx prisma studio
```

Go to the `College` table and add a few colleges:
- Name: "Massachusetts Institute of Technology", City: "Cambridge"
- Name: "Stanford University", City: "Stanford"
- Name: "Harvard University", City: "Cambridge"

### 2. Register a User

1. Go to http://localhost:3000
2. Click "Get Started"
3. Fill in your details and select a college
4. Register

### 3. Connect Platforms

1. After registration, go to your profile
2. Click "Connect Platforms"
3. Enter your:
   - GitHub username
   - LeetCode username
   - HackerRank username
4. Click "Save & Sync"

The system will automatically fetch your stats and calculate your score!

### 4. View Leaderboard

- Go to "Leaderboard" to see all students
- Use the college filter to see rankings by college
- Click on any student to view their profile

## 🔑 Getting a GitHub Token (Optional but Recommended)

1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name (e.g., "StudentRank API")
4. Select scopes: `public_repo` (or just leave all unchecked for read-only public access)
5. Click "Generate token"
6. Copy the token and add it to your server `.env` file:
   ```
   GITHUB_TOKEN=ghp_yourTokenHere
   ```

This increases the GitHub API rate limit from 60 to 5000 requests per hour.

## 🐛 Troubleshooting

### Database Connection Error

**Error**: `Can't reach database server`

**Solution**:
1. Make sure PostgreSQL is running
2. Check your `DATABASE_URL` in `.env`
3. Create the database if it doesn't exist:
   ```sql
   CREATE DATABASE studentrank;
   ```

### CORS Error

**Error**: `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution**:
The server already has CORS enabled for all origins in development. If you're still seeing this, make sure:
1. Backend is running on port 5000
2. Frontend .env.local has the correct API URL

### LeetCode API Not Working

LeetCode's unofficial API can be unreliable. If stats aren't syncing:
1. Verify the username is correct
2. Try again later (API might be rate-limited)
3. Check server console for error messages

## 📦 Production Deployment

### Backend (Railway/Render/Heroku)

1. Create a PostgreSQL database
2. Set environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `GITHUB_TOKEN`
   - `PORT=5000`
   - `NODE_ENV=production`
3. Build command: `npm run build`
4. Start command: `npm start`

### Frontend (Vercel)

1. Connect your GitHub repo to Vercel
2. Set environment variable:
   - `NEXT_PUBLIC_API_URL=https://your-backend-url.com`
3. Deploy!

## 📊 Understanding the Scoring System

**Total Score** (0-100):
- GitHub: 40% weight
  - Based on: repositories, stars, commits, followers
- LeetCode: 40% weight
  - Based on: problems solved (with difficulty weights), contest rating
- HackerRank: 20% weight
  - Based on: stars and badges earned

## 🎯 Next Steps

### Phase 2 Features (Planned):
- OAuth login (GitHub, Google)
- Progress charts with Recharts
- Badges system
- Automated daily sync

### Phase 3 Features (Planned):
- Email notifications for rank changes
- Resume export as PDF
- Public profile sharing links
- Custom college/organization pages

## 💡 Tips

1. **Manual Sync**: Click "Sync Stats" on your profile to update your scores immediately
2. **Automatic Sync**: Stats sync automatically every day at 2 AM
3. **Rankings Update**: Rankings recalculate every hour
4. **Privacy**: Email addresses are never shown publicly

##  🤝 Contributing

This is a student project! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📞 Support

If you encounter issues:
1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Make sure both frontend and backend are running
4. Check that PostgreSQL is accessible

Happy coding! 🚀
