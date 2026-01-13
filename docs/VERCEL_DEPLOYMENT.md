# Vercel Deployment Guide 🚀

This guide will help you deploy your Student Ranking Platform to Vercel.

## 📋 Before You Start

### Project Structure
Your project is a **monorepo** with two separate applications:
- **Frontend (Client)**: Next.js app in `./client/` directory
- **Backend (Server)**: Express API in `./server/` directory

**Important**: Vercel is optimized for deploying the **frontend only**. You'll need to deploy the backend separately.

---

## 🎯 Deployment Strategy

### Frontend (Next.js) → Vercel ✅
### Backend (Express) → Railway/Render/Heroku ✅

---

## 📦 Step 1: Deploy Frontend to Vercel

### Prerequisites
- GitHub account connected to Vercel
- Code pushed to a GitHub repository

### 1.1 Push Your Code to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit"

# Add your GitHub repository as remote
git remote add origin https://github.com/your-username/student-rank.git
git branch -M main
git push -u origin main
```

### 1.2 Import Project to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. **Configure Build Settings**:
   - **Framework Preset**: Next.js
   - **Root Directory**: Leave as is (we have `vercel.json` configured)
   - **Build Command**: `cd client && npm install && npm run build` (should auto-detect from vercel.json)
   - **Output Directory**: `client/.next` (should auto-detect)
   - **Install Command**: `cd client && npm install` (should auto-detect)

### 1.3 Configure Environment Variables

Add these environment variables in Vercel Dashboard (Settings → Environment Variables):

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
NEXT_PUBLIC_GITHUB_CLIENT_ID=your-github-oauth-client-id
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-oauth-client-id
```

**⚠️ Important**: 
- Replace `https://your-backend-url.com` with your actual backend URL (see Step 2)
- Add these variables for **Production**, **Preview**, and **Development** environments

### 1.4 Deploy!

Click **"Deploy"** and wait for the build to complete.

---

## 🔧 Step 2: Deploy Backend (Express API)

Your Express backend needs to be deployed to a different platform. Here are your options:

### Option A: Railway (Recommended) 🚂

**Why Railway?**
- Easy PostgreSQL setup
- Automatic deployments from GitHub
- Free tier available

**Steps**:
1. Go to [railway.app](https://railway.app)
2. Create a new project from GitHub repo
3. Select the `server` directory as root
4. Add PostgreSQL database (Railway will auto-provide `DATABASE_URL`)
5. Add environment variables:
   ```env
   DATABASE_URL=(auto-provided by Railway)
   JWT_SECRET=your-secret-key
   GITHUB_TOKEN=your-github-token
   GITHUB_CLIENT_ID=your-github-oauth-client-id
   GITHUB_CLIENT_SECRET=your-github-oauth-secret
   GOOGLE_CLIENT_ID=your-google-oauth-client-id
   GOOGLE_CLIENT_SECRET=your-google-oauth-secret
   PORT=5000
   CLIENT_URL=https://your-vercel-app.vercel.app
   ```
6. Deploy!

### Option B: Render 🎨

1. Go to [render.com](https://render.com)
2. Create **New Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Root Directory**: `server`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm start`
5. Add environment variables (same as Railway above)
6. Create a PostgreSQL database in Render
7. Deploy!

### Option C: Heroku 🟣

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Add PostgreSQL: `heroku addons:create heroku-postgresql:mini`
5. Set environment variables:
   ```bash
   heroku config:set JWT_SECRET=your-secret
   heroku config:set GITHUB_TOKEN=your-token
   # ... etc
   ```
6. Deploy:
   ```bash
   git subtree push --prefix server heroku main
   ```

---

## 🔗 Step 3: Connect Frontend and Backend

Once your backend is deployed:

1. **Copy your backend URL** (e.g., `https://your-app.railway.app`)
2. **Update Vercel Environment Variables**:
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Update `NEXT_PUBLIC_API_URL` to your backend URL
3. **Redeploy** your Vercel app (Settings → Deployments → Redeploy)

---

## 🔐 Step 4: Update OAuth Redirect URIs

### GitHub OAuth
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Edit your OAuth App
3. **Update Authorization callback URL**:
   ```
   https://your-vercel-app.vercel.app/auth/callback/github
   ```

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project → APIs & Services → Credentials
3. Edit your OAuth 2.0 Client ID
4. **Update Authorized redirect URIs**:
   ```
   https://your-vercel-app.vercel.app/auth/callback/google
   ```
5. **Update Authorized JavaScript origins**:
   ```
   https://your-vercel-app.vercel.app
   ```

---

## ✅ Verify Deployment

### Frontend Checklist
- [ ] Frontend loads at Vercel URL
- [ ] No 404 errors on page navigation
- [ ] Login page displays correctly
- [ ] No console errors related to environment variables

### Backend Checklist
- [ ] Backend responds at `/` endpoint
- [ ] Database connection working
- [ ] OAuth endpoints working (`/api/auth/github`, `/api/auth/google`)
- [ ] Prisma schema is pushed and client generated

### Integration Checklist
- [ ] Login with email/password works
- [ ] OAuth login (GitHub) works
- [ ] OAuth login (Google) works
- [ ] Leaderboard loads data from backend
- [ ] User profile updates work

---

## 🐛 Common Issues & Solutions

### Issue 1: "Application Error" on Vercel

**Problem**: Build fails or app crashes
**Solution**:
1. Check Vercel build logs (Deployments → Click on deployment → View Function Logs)
2. Ensure `vercel.json` is properly configured
3. Check that all environment variables are set

### Issue 2: "Cannot connect to API"

**Problem**: Frontend can't reach backend
**Solution**:
1. Verify `NEXT_PUBLIC_API_URL` is set correctly in Vercel
2. Check backend is deployed and running
3. Verify CORS settings in backend allow your Vercel domain:
   ```typescript
   // server/src/index.ts
   app.use(cors({
     origin: process.env.CLIENT_URL || 'http://localhost:3000',
     credentials: true
   }));
   ```

### Issue 3: OAuth Callback Fails

**Problem**: OAuth redirects to wrong URL or fails
**Solution**:
1. Update OAuth app redirect URIs to match your Vercel URL
2. Verify `CLIENT_URL` in backend env matches your Vercel URL
3. Check that OAuth client IDs match between backend and frontend

### Issue 4: Database Connection Error

**Problem**: Backend can't connect to database
**Solution**:
1. Ensure `DATABASE_URL` is set in backend environment
2. Run `npx prisma generate` during build
3. Check PostgreSQL is accessible from your hosting platform
4. Add build command: `npm install && npx prisma generate && npm run build`

### Issue 5: "Module not found" Errors

**Problem**: Build fails with missing modules
**Solution**:
1. Ensure `package.json` has all dependencies listed
2. Clear Vercel cache and redeploy
3. Check that install command runs in correct directory

---

## 🔄 Continuous Deployment

Once set up, deployments are automatic:

### Vercel (Frontend)
- Pushes to `main` branch → Production deployment
- Pull requests → Preview deployments
- Automatic rollback on errors

### Railway/Render (Backend)
- Pushes to `main` branch → Automatic deployment
- Environment variables persist across deploys
- Database migrations run automatically (if configured)

---

## 📊 Monitoring

### Vercel Analytics
- Enable in Vercel Dashboard → Analytics
- Monitor page views, performance, and errors

### Backend Monitoring
- **Railway**: Built-in metrics dashboard
- **Render**: View logs and metrics in dashboard
- **Heroku**: Use Heroku Metrics or add-ons

---

## 🎓 Best Practices

1. **Environment Variables**: Never commit `.env` files
2. **Secrets**: Use different values for production vs development
3. **Database**: Always use production database for production environment
4. **Backups**: Enable automatic database backups
5. **Monitoring**: Set up error tracking (Sentry, LogRocket)
6. **SSL**: Ensure HTTPS is enabled (automatic on Vercel/Railway/Render)

---

## 🆘 Need Help?

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Render Docs**: [render.com/docs](https://render.com/docs)
- **GitHub Issues**: Check existing issues or create a new one

---

## 📝 Quick Reference

### Vercel CLI Commands
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from terminal
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs
```

### Railway CLI Commands
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# View logs
railway logs
```

---

**🎉 That's it! Your Student Ranking Platform should now be live!**

If you encounter any issues not covered here, please create an issue on GitHub.
