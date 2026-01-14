# ✅ Render Deployment Checklist

Quick reference for deploying your backend to Render.

---

## 🚀 **Step-by-Step Deployment**

### **1. Push Latest Code** ✅ DONE
```bash
git push
```
Your critical fixes are now in GitHub:
- ✅ Server binds to `0.0.0.0` (not localhost)
- ✅ CORS configured with CLIENT_URL support
- ✅ render.yaml ready for Blueprint deployment

---

### **2. Deploy to Render**

#### **Option A: Blueprint Deploy (Recommended)**

1. **Go to**: [dashboard.render.com](https://dashboard.render.com)
2. **Click**: "New +" → "Blueprint"
3. **Connect**: Your `student-rank` GitHub repository
4. **Render detects**: `render.yaml` automatically
5. **Click**: "Apply"
6. **Wait**: 3-5 minutes for deployment

#### **Option B: Manual Web Service**

1. **Go to**: [dashboard.render.com](https://dashboard.render.com)
2. **Click**: "New +" → "Web Service"
3. **Connect**: Your GitHub repository
4. **Configure**:
   - **Name**: `student-rank-api`
   - **Root Directory**: (leave blank)
   - **Environment**: `Node`
   - **Build Command**: 
     ```
     cd server && npm ci && npx prisma generate && npm run build
     ```
   - **Start Command**: 
     ```
     cd server && npm start
     ```
5. **Click**: "Create Web Service"

---

### **3. Add PostgreSQL Database**

1. **Click**: "+ New" → "PostgreSQL"
2. **Configure**:
   - **Name**: `student-rank-db`
   - **Database**: `studentrank`
   - **Plan**: Free
3. **Click**: "Create Database"
4. **Link to Service**: Render will prompt you to connect

---

### **4. Set Environment Variables**

**Navigate to**: Your Service → Environment → "Add Environment Variable"

**Copy and paste these** (then fill in your values):

```env
DATABASE_URL=<auto-filled by Render when you add PostgreSQL>
JWT_SECRET=<generate-using-command-below>
GITHUB_TOKEN=ghp_yourGitHubPersonalAccessToken
GITHUB_CLIENT_ID=Iv1.yourGitHubOAuthClientId
GITHUB_CLIENT_SECRET=yourGitHubOAuthClientSecret
GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-yourGoogleOAuthSecret
PORT=5000
CLIENT_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

**Generate JWT_SECRET**:
```bash
# Run in Git Bash or terminal:
openssl rand -base64 32

# OR use Node:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

### **5. Wait for Deployment**

**Monitor in Render Dashboard**:
- Dashboard → Your Service → "Logs" tab
- Watch for:
  - ✅ npm ci completed
  - ✅ npx prisma generate completed
  - ✅ npm run build completed
  - ✅ Server running on port 5000

**Common deployment time**: 3-7 minutes

---

### **6. Test Your Backend**

Once deployment succeeds, you'll get a URL like:
```
https://student-rank-api.onrender.com
```

**Test it:**

**Browser Test**:
```
https://student-rank-api.onrender.com/health
```
Should return: `{"status":"ok","timestamp":"..."}`

**cURL Test**:
```bash
curl https://student-rank-api.onrender.com/health
```

**API Endpoints**:
```bash
curl https://student-rank-api.onrender.com/api/users
```

---

### **7. Update Frontend Environment Variable**

**In Vercel Dashboard**:
1. Go to your project → Settings → Environment Variables
2. Update `NEXT_PUBLIC_API_URL`:
   ```
   NEXT_PUBLIC_API_URL=https://student-rank-api.onrender.com
   ```
3. Redeploy frontend

---

### **8. Update Backend CLIENT_URL**

**In Render Dashboard**:
1. Your Service → Environment
2. Update `CLIENT_URL` to your Vercel URL:
   ```
   CLIENT_URL=https://your-app.vercel.app
   ```
3. Service auto-redeploys

---

## 🐛 **Troubleshooting**

### **Build Fails**

**Check Logs For**:
- `npm ERR!` - Check build command syntax
- `Cannot find package.json` - Ensure build command has `cd server &&`
- `Prisma` errors - Verify `DATABASE_URL` is set

**Fix**:
- Verify build command: `cd server && npm ci && npx prisma generate && npm run build`
- Check all dependencies are in `server/package.json`

---

### **Server Crashes After Build**

**Check Application Logs For**:
- Missing environment variables
- Database connection errors
- Port binding errors

**Fix**:
- Add all required environment variables
- Verify PostgreSQL database is created and linked
- Check `DATABASE_URL` is correct

---

### **CORS Errors**

**Symptom**: Frontend can't connect, browser shows CORS error

**Fix**:
1. Update `CLIENT_URL` environment variable
2. Should match your Vercel URL exactly
3. No trailing slash!

---

## 📊 **Final Verification**

After everything is set up:

- [ ] Backend URL accessible
- [ ] `/health` endpoint returns OK
- [ ] No errors in Render logs
- [ ] PostgreSQL database connected
- [ ] All environment variables set
- [ ] Frontend can connect to backend
- [ ] OAuth login works
- [ ] Leaderboard displays data

---

## 🎉 **Success!**

Your backend is live on Render!

**Save These URLs**:
- **Backend**: `https://student-rank-api.onrender.com`
- **Frontend**: `https://your-app.vercel.app`
- **Database**: (In Render → PostgreSQL → Connection Details)

---

## 🔗 **Next Steps**

1. **Update OAuth Redirect URIs**:
   - GitHub: Add `https://your-app.vercel.app/auth/callback/github`
   - Google: Add `https://your-app.vercel.app/auth/callback/google`

2. **Monitor Performance**:
   - Render → Metrics tab
   - Watch CPU, Memory, Requests

3. **Set Up Alerts** (Optional):
   - Render → Settings → Notifications

---

## 💡 **Important Notes**

**Free Tier Limitations**:
- Spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- 750 hours/month free

**To Prevent Spin-Down**:
- Upgrade to paid plan ($7/month)
- OR use a service like UptimeRobot to ping your backend every 10 minutes

---

**Good luck! 🚀**
