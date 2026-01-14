# Render Backend Deployment Guide 🎨

Complete guide to deploy your Express.js backend to Render.

---

## 🚀 **Quick Deploy (Recommended)**

Since your repo now has `render.yaml`, Render can auto-configure everything!

### **Step 1: Deploy Using Blueprint**

1. **Go to Render Dashboard**: [dashboard.render.com](https://dashboard.render.com)

2. **Click "New +" → "Blueprint"**

3. **Connect GitHub Repository**:
   - Select: `student-rank` repository
   - Render will detect `render.yaml` automatically

4. **Review Configuration**:
   - **Service Name**: `student-rank-api`
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm ci && npx prisma generate && npm run build`
   - **Start Command**: `cd server && npm start`
   - **Database**: PostgreSQL (auto-created)

5. **Click "Apply"**

6. **Wait for deployment** (usually 3-5 minutes)

---

## ⚙️ **Step 2: Set Environment Variables**

After blueprint deployment, you MUST add these environment variables:

### **Navigate to Environment Variables:**
Dashboard → Your Service → Environment → "Add Environment Variable"

### **Required Variables:**

```env
# ✅ Database (Auto-set by Render if you added PostgreSQL)
DATABASE_URL=<already set by Render>

# ⚠️ YOU MUST ADD THESE:
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-long
GITHUB_TOKEN=ghp_yourGitHubPersonalAccessToken
GITHUB_CLIENT_ID=Iv1.yourGitHubOAuthClientId
GITHUB_CLIENT_SECRET=yourGitHubOAuthClientSecret
GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-yourGoogleOAuthSecret
PORT=5000
CLIENT_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

### **How to Generate JWT_SECRET:**

**Option 1: Using OpenSSL (Git Bash on Windows)**
```bash
openssl rand -base64 32
```

**Option 2: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Option 3: Online Generator**
- Visit: https://generate-secret.vercel.app/32
- Copy the generated string

### **Important Notes:**

- **DATABASE_URL**: Created automatically when you add PostgreSQL
- **CLIENT_URL**: Update this with your Vercel frontend URL
- **PORT**: Must be `5000` or leave it for Render to auto-assign
- **NODE_ENV**: Set to `production`

---

## 🗄️ **Step 3: Verify PostgreSQL Database**

### **Check Database Connection:**

1. **Dashboard → Your Service → "PostgreSQL" tab**
2. Verify database is created and linked
3. Internal connection string should be auto-set as `DATABASE_URL`

### **Test Database Connection:**

**Use Render Shell:**
1. Dashboard → Service → "Shell" tab
2. Run:
```bash
cd server
npx prisma db push
```

This will sync your Prisma schema to the database.

---

## 🔍 **Step 4: Check Deployment Status**

### **Monitor Build Logs:**

1. **Dashboard → Your Service → "Logs" tab**
2. Filter by: **"Deploy"** or **"Build"**
3. Look for:
   - ✅ `npm ci` completed
   - ✅ `npx prisma generate` completed
   - ✅ `npm run build` completed
   - ✅ TypeScript compilation successful

### **Monitor Runtime Logs:**

1. Filter by: **"Application"**
2. Look for:
   - ✅ `Server running on port 5000`
   - ✅ No error messages
   - ❌ Database connection errors
   - ❌ Missing environment variable errors

---

## ✅ **Step 5: Test Your Backend**

### **Get Your Backend URL:**
After deployment succeeds, Render gives you a URL like:
```
https://student-rank-api.onrender.com
```

### **Test Endpoints:**

**Health Check:**
```bash
curl https://student-rank-api.onrender.com/
```

**API Test:**
```bash
curl https://student-rank-api.onrender.com/api/users
```

**In Browser:**
Visit: `https://student-rank-api.onrender.com/`

Should return API response or health check message.

---

## 🐛 **Troubleshooting Common Render Issues**

### **Issue 1: "npm ERR! enoent ENOENT"**

**Cause:** Build command can't find package.json in server directory

**Fix:**
1. Go to: Dashboard → Service → Settings → Build & Deploy
2. Update **Build Command** to:
   ```bash
   cd server && npm ci && npx prisma generate && npm run build
   ```
3. Click "Save Changes"
4. Trigger manual deploy

---

### **Issue 2: "Prisma Client Not Generated"**

**Cause:** Prisma generate not running during build

**Fix:**
Ensure build command includes `npx prisma generate`:
```bash
cd server && npm ci && npx prisma generate && npm run build
```

**Alternative:** Add to `server/package.json`:
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

---

### **Issue 3: "Can't reach database server"**

**Causes:**
1. PostgreSQL not added
2. DATABASE_URL not set
3. Wrong connection string

**Fix:**
1. Dashboard → "+ New" → "PostgreSQL"
2. Name it: `student-rank-db`
3. Link to your web service
4. Verify `DATABASE_URL` is in Environment Variables
5. Redeploy

---

### **Issue 4: Build Succeeds, Server Crashes**

**Cause:** Missing environment variables

**Fix:**
1. Check all required env vars are set
2. Especially check: `JWT_SECRET`, `DATABASE_URL`
3. Check logs for specific missing variable
4. Add missing variables
5. Service will auto-restart

---

### **Issue 5: "CORS Policy Error"**

**Cause:** Backend not allowing your frontend URL

**Fix:**
1. Update `CLIENT_URL` environment variable:
   ```
   CLIENT_URL=https://your-app.vercel.app
   ```
2. Verify `server/src/index.ts` has:
   ```typescript
   app.use(cors({
     origin: process.env.CLIENT_URL,
     credentials: true
   }));
   ```
3. Redeploy

---

### **Issue 6: "Port Binding Error"**

**Cause:** Not using Render's PORT environment variable

**Fix:**
Check `server/src/index.ts`:
```typescript
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
```

**Important:** Must bind to `0.0.0.0`, not `localhost`!

---

## 🔧 **Manual Deployment (Alternative)**

If you prefer to deploy without Blueprint:

### **Step 1: Create New Web Service**

1. Dashboard → "New +" → "Web Service"
2. Connect GitHub repository
3. Select branch: `main`

### **Step 2: Configure Service**

**Service Details:**
- **Name**: `student-rank-api`
- **Region**: Choose closest to you
- **Branch**: `main`
- **Root Directory**: Leave blank (repo root)

**Build Settings:**
- **Runtime**: `Node`
- **Build Command**:
  ```bash
  cd server && npm ci && npx prisma generate && npm run build
  ```
- **Start Command**:
  ```bash
  cd server && npm start
  ```

**Plan:**
- Start with **Free** tier for testing

### **Step 3: Add PostgreSQL**

1. Dashboard → "+ New" → "PostgreSQL"
2. **Name**: `student-rank-db`
3. **Database**: `studentrank`
4. **User**: `studentrank_user`
5. **Region**: Same as your web service
6. **Plan**: Free tier

### **Step 4: Link Database to Service**

1. Go to your web service
2. Environment → "Add Environment Variable"
3. **Key**: `DATABASE_URL`
4. **Value**: Link to your PostgreSQL database (Render provides this)

---

## 📊 **Render Dashboard Guide**

### **Key Sections:**

**1. Events Tab**
- View deployment history
- See build success/failures
- Check auto-deploy status

**2. Logs Tab**
- Real-time application logs
- Filter by type (Deploy, Build, Application)
- Download logs for debugging

**3. Shell Tab**
- SSH into your service
- Run commands directly
- Debug live issues

**4. Metrics Tab**
- Monitor CPU usage
- Monitor Memory usage
- Monitor Request counts

**5. Settings Tab**
- Update build/start commands
- Change instance type
- Configure auto-deploy

---

## 🎯 **Post-Deployment Checklist**

After successful deployment:

- [ ] Backend URL is accessible
- [ ] Health check endpoint responds
- [ ] All environment variables are set
- [ ] PostgreSQL database is connected
- [ ] No errors in application logs
- [ ] API endpoints return data
- [ ] Save your backend URL for frontend

### **Save Your URLs:**

**Backend URL:** `https://student-rank-api.onrender.com`

Update your frontend environment variable:
```env
NEXT_PUBLIC_API_URL=https://student-rank-api.onrender.com
```

---

## 🔄 **Update Backend Environment Variable**

Once frontend is deployed to Vercel:

1. Go to Render → Your Service → Environment
2. Update `CLIENT_URL` to your Vercel URL:
   ```
   CLIENT_URL=https://your-app.vercel.app
   ```
3. Service will auto-deploy with new variable

---

## 🆘 **Still Having Issues?**

### **Check These:**

1. **Build Logs** - Look for exact error message
2. **Application Logs** - Check for runtime errors
3. **Environment Variables** - Verify all are set correctly
4. **Database** - Ensure PostgreSQL is created and linked
5. **Build Command** - Must include `cd server &&`

### **Common Error Messages:**

**"npm ERR! missing script: build"**
- Fix: Verify `server/package.json` has `"build": "tsc"`

**"Cannot find module 'express'"**
- Fix: Ensure `npm ci` runs before build

**"PrismaClient not initialized"**
- Fix: Add `npx prisma generate` to build command

---

## 🎉 **Success!**

Once deployed successfully:

1. **Test your backend**: Visit your Render URL
2. **Update frontend**: Add backend URL to Vercel env vars
3. **Update OAuth**: Add Render URL to OAuth redirect URIs
4. **Monitor logs**: Watch for any runtime errors

Your backend is now live on Render! 🚀

---

## 📚 **Useful Resources**

- **Render Docs**: [render.com/docs](https://render.com/docs)
- **Node.js on Render**: [render.com/docs/deploy-node-express-app](https://render.com/docs/deploy-node-express-app)
- **PostgreSQL**: [render.com/docs/databases](https://render.com/docs/databases)
- **Environment Variables**: [render.com/docs/configure-environment-variables](https://render.com/docs/configure-environment-variables)
