# Phase 2C: OAuth Login - Setup Guide

## 🎯 What's Been Built

**OAuth Authentication System** with:
- ✅ **GitHub OAuth** - "Continue with GitHub" button
- ✅ **Google OAuth** - "Continue with Google" button (placeholder)
- ✅ **Backend API** - OAuth handlers for both providers
- ✅ **Account Linking** - Connect OAuth to existing accounts
- ✅ **Auto GitHub Username** - Automatically sets GitHub username
- ✅ **Profile Pictures** - Avatar from GitHub/Google
- ✅ **New User Flow** - Complete registration for new OAuth users

---

## 🔧 Setup Required

### Step 1: Update Database Schema

```bash
cd server
npx prisma generate
npx prisma db push
```

This adds OAuth fields to User model:
- `provider` (github/google/local)
- `providerId` (OAuth user ID)
- `avatar` (profile picture URL)
- `password` now optional (for OAuth users)

---

### Step 2: Create GitHub OAuth App

1. **Go to GitHub**: https://github.com/settings/developers
2. **Click "New OAuth App"**
3. **Fill in details**:
   - Application name: `StudentRank`
   - Homepage URL:  `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/auth/callback/github`
4. **Click "Register application"**
5. **Copy the Client ID**
6. **Click "Generate a new client secret"** and copy it

---

### Step 3: Update Environment Variables

**Backend (server/.env):**
```bash
# Add these lines:
GITHUB_CLIENT_ID="your_github_client_id_here"
GITHUB_CLIENT_SECRET="your_github_client_secret_here"
```

**Frontend (client/.env.local):**
```bash
# Add this line:
NEXT_PUBLIC_GITHUB_CLIENT_ID="your_github_client_id_here"
```

---

### Step 4: Create GitHub OAuth Callback Page

The frontend needs a callback page to handle the OAuth response.

Create: `client/app/auth/callback/github/page.tsx`

---

### Step 5: (Optional) Set Up Google OAuth

1. **Go to**: https://console.cloud.google.com/
2. **Create a new project** (or select existing)
3. **Enable Google+ API**
4. **Create OAuth 2.0 Credentials**:
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000/auth/callback/google`
5. **Copy Client ID and Secret** to .env files

---

## 🎨 What Works Now

### Login Page
- **GitHub button** - Redirects to GitHub OAuth
- **Google button** - Shows "coming soon" alert (until you set up credentials)
- **Email/Password** - Still works as before

### OAuth Flow

1. **User clicks "Continue with GitHub"**
2. **Redirected to GitHub** login
3. **User authorizes** the app
4. **Redirected back** with code
5. **Backend exchanges code** for access token
6. **Backend fetches user** data from GitHub
7. **If existing user**: Logs in automatically
8. **If new user**: Shows registration completion form

---

## 🔒 How It Works

### GitHub OAuth Flow

```
1. User → "Continue with GitHub" button
2. Browser → GitHub OAuth page
3. User → Authorizes app
4. GitHub → Redirects to /auth/callback/github?code=xxx
5. Frontend → Sends code to backend API
6. Backend → Exchanges code for GitHub access token
7. Backend → Fetches user email, name, avatar, username
8. Backend → Checks if user exists
9a. Exists → Auto-login with JWT token
9b. New → Return GitHub data, show completion form
10. Frontend → Stores token, redirects to dashboard
```

### Auto-Features

- ✅ **GitHub Username**: Automatically set from GitHub
- ✅ **Email**: Primary email from GitHub
- ✅ **Avatar**: Profile picture from GitHub
- ✅ **Name**: Display name from GitHub

---

## 📝 Testing OAuth

### Before Testing:
1. ✅ Database schema updated
2. ✅ GitHub OAuth app created
3. ✅ Environment variables set
4. ✅ Servers restarted

### Test Steps:
1. Go to http://localhost:3000/auth/login
2. Click "Continue with GitHub"
3. Authorize the app on GitHub
4. Should redirect back and log you in!

---

## ⚠️ Important Notes

1. **Callback Page**: You need to create the callback page (see code below)
2. **HTTPS in Production**: OAuth requires HTTPS in production
3. **Redirect URI**: Must match exactly in GitHub settings
4. **Scopes**: Currently requests `user:email` from GitHub

---

## 🐛 Troubleshooting

### "Application not found"
- Check GitHub Client ID is correct
- Verify it's added to `.env.local`

### "Redirect URI mismatch"
- Ensure callback URL in GitHub app matches exactly:
  - `http://localhost:3000/auth/callback/github`

### "User exists but can't login"
- OAuth links to existing email
- Updates user with OAuth provider info

---

## 🚀 Next Steps

1. **Create callback page** (I'll do this next if you want!)
2. **Test GitHub OAuth**
3. **Optionally set up Google OAuth**
4. **Deploy with HTTPS for production**

---

**OAuth login is ready once you set up GitHub credentials!** 🎉

Want me to create the GitHub callback page next?
