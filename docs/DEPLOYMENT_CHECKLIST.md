# Quick Deployment Checklist 🚀

Follow this checklist in order for a smooth deployment.

## ✅ Phase 1: Backend Deployment (Do This First!)

### [ ] 1. Choose Backend Platform
- [ ] Railway (Recommended - easy PostgreSQL setup)
- [ ] Render
- [ ] Heroku

### [ ] 2. Deploy Backend
- [ ] Create account on chosen platform
- [ ] Connect GitHub repository
- [ ] Set root directory to `server`
- [ ] Add PostgreSQL database
- [ ] Configure build command: `npm install && npx prisma generate && npm run build`
- [ ] Configure start command: `npm start`

### [ ] 3. Set Backend Environment Variables
```
DATABASE_URL=<auto-provided by platform>
JWT_SECRET=<generate a random secret>
GITHUB_TOKEN=<your-github-personal-access-token>
GITHUB_CLIENT_ID=<your-github-oauth-client-id>
GITHUB_CLIENT_SECRET=<your-github-oauth-secret>
GOOGLE_CLIENT_ID=<your-google-oauth-client-id>
GOOGLE_CLIENT_SECRET=<your-google-oauth-secret>
PORT=5000
CLIENT_URL=<will update this later with Vercel URL>
```

### [ ] 4. Verify Backend Deployment
- [ ] Backend URL is accessible (e.g., `https://your-app.railway.app`)
- [ ] Health check endpoint responds
- [ ] Database connection working
- [ ] **Save your backend URL** - you'll need it for frontend!

---

## ✅ Phase 2: Frontend Deployment (Do This Second!)

### [ ] 5. Push Code to GitHub
```bash
cd c:\Users\HP\PRO\student-rank
git add .
git commit -m "Add Vercel deployment configuration"
git push
```

### [ ] 6. Deploy to Vercel
- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Click "Add New Project"
- [ ] Import your GitHub repository
- [ ] Vercel auto-detects Next.js settings from `vercel.json`
- [ ] Don't change framework preset or build settings

### [ ] 7. Set Frontend Environment Variables in Vercel
```
NEXT_PUBLIC_API_URL=<your-backend-url-from-step-4>
NEXT_PUBLIC_GITHUB_CLIENT_ID=<your-github-oauth-client-id>
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<your-google-oauth-client-id>
```
- [ ] Add to Production environment
- [ ] Add to Preview environment
- [ ] Add to Development environment

### [ ] 8. Deploy Frontend
- [ ] Click "Deploy" button
- [ ] Wait for build to complete
- [ ] **Save your Vercel URL** (e.g., `https://student-rank.vercel.app`)

---

## ✅ Phase 3: Connect & Configure (Do This Last!)

### [ ] 9. Update Backend with Frontend URL
- [ ] Go to your backend platform (Railway/Render/Heroku)
- [ ] Update environment variable: `CLIENT_URL=<your-vercel-url>`
- [ ] Redeploy backend (if needed)

### [ ] 10. Update OAuth Redirect URIs

#### GitHub OAuth App
- [ ] Go to [GitHub Developer Settings](https://github.com/settings/developers)
- [ ] Edit your OAuth App
- [ ] Update "Authorization callback URL" to:
  ```
  https://<your-vercel-url>/auth/callback/github
  ```

#### Google OAuth App
- [ ] Go to [Google Cloud Console](https://console.cloud.google.com)
- [ ] Navigate to: APIs & Services → Credentials
- [ ] Edit OAuth 2.0 Client ID
- [ ] Update "Authorized redirect URIs":
  ```
  https://<your-vercel-url>/auth/callback/google
  ```
- [ ] Update "Authorized JavaScript origins":
  ```
  https://<your-vercel-url>
  ```

### [ ] 11. Verify Everything Works

#### Frontend Checks
- [ ] Visit your Vercel URL
- [ ] Login page loads correctly
- [ ] No console errors
- [ ] Navigation works

#### Backend Checks
- [ ] Backend API responds
- [ ] Database connection working
- [ ] No errors in backend logs

#### Integration Checks
- [ ] Email/password login works
- [ ] "Continue with GitHub" button works
- [ ] "Continue with Google" button works
- [ ] Leaderboard displays data
- [ ] User profile loads
- [ ] Stats update correctly

### [ ] 12. Final Polish
- [ ] Test all features thoroughly
- [ ] Check error handling
- [ ] Verify responsive design on mobile
- [ ] Test OAuth flow end-to-end
- [ ] Check database has data

---

## 🎉 Deployment Complete!

Your Student Ranking Platform is now live!

### URLs to Save:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.railway.app`

### Next Steps:
- Share your live URL
- Monitor logs for any errors
- Set up error tracking (optional)
- Enable analytics (optional)

---

## 🆘 If Something Goes Wrong

See **Troubleshooting** section in `VERCEL_DEPLOYMENT.md` for common issues and solutions.

### Quick Fixes:
- **Build fails**: Check Vercel build logs
- **API not connecting**: Verify `NEXT_PUBLIC_API_URL` 
- **OAuth fails**: Check redirect URIs match exactly
- **Database error**: Ensure Prisma client is generated during build

---

**Good luck! 🚀**
