# Backend Deployment Troubleshooting 🔧

## 🚨 Common Backend Deployment Failures

### Issue #1: Build Command Failing

#### **Symptoms:**
- Build fails with `npm ERR! enoent`
- "Cannot find package.json"
- "Command not found"

#### **Root Causes:**
1. **Monorepo structure** - Backend is in `server/` subdirectory
2. **Windows path syntax** - Using `&&` which may not work on Linux
3. **Missing dependencies**

#### **Solutions:**

**For Railway:**
1. Ensure `railway.json` exists at root:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run build:server"
  },
  "deploy": {
    "startCommand": "npm run start:server",
    "healthcheckPath": "/",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

2. Check root `package.json` has correct scripts:
```json
{
  "scripts": {
    "build:server": "cd server && npm ci && npx prisma generate && npm run build",
    "start:server": "cd server && npm start"
  }
}
```

**For Render:**
1. Use the `render.yaml` configuration file (already created)
2. OR manually set in Render dashboard:
   - **Build Command**: `cd server && npm ci && npx prisma generate && npm run build`
   - **Start Command**: `cd server && npm start`
   - **Root Directory**: Leave blank (use repo root)

---

### Issue #2: Prisma Client Not Generated

#### **Symptoms:**
- `Error: @prisma/client did not initialize yet`
- `PrismaClient is unable to be run in the browser`
- Build succeeds but runtime error

#### **Root Cause:**
Prisma client must be generated during the build process

#### **Solution:**
Ensure build command includes `npx prisma generate`:
```bash
cd server && npm ci && npx prisma generate && npm run build
```

**Verify in server/package.json:**
```json
{
  "scripts": {
    "build": "tsc",
    "postinstall": "prisma generate"
  }
}
```

---

### Issue #3: Database Connection Error

#### **Symptoms:**
- `Can't reach database server`
- `Connection timeout`
- `Invalid `prisma.user.findMany()` invocation`

#### **Root Causes:**
1. `DATABASE_URL` environment variable not set
2. PostgreSQL database not created
3. Wrong connection string format
4. Database not accessible from deployment platform

#### **Solutions:**

**For Railway:**
1. Add PostgreSQL plugin:
   - Dashboard → "+ New" → "Database" → "Add PostgreSQL"
   - Railway auto-sets `DATABASE_URL`

2. Verify in Variables tab:
   ```
   DATABASE_URL=postgresql://postgres:...@containers-us-west-1.railway.app:5432/railway
   ```

**For Render:**
1. Create PostgreSQL database in Render dashboard
2. Link it to your web service
3. Environment variable will be auto-populated

**Manual Connection Test:**
```bash
# In Railway/Render shell
npx prisma db push
npx prisma db seed  # if you have seed data
```

---

### Issue #4: Missing Environment Variables

#### **Symptoms:**
- Server starts but crashes immediately
- OAuth login doesn't work
- JWT authentication fails
- 500 Internal Server Error

#### **Required Environment Variables:**
```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Authentication
JWT_SECRET=your-super-secret-key-min-32-chars

# GitHub OAuth
GITHUB_TOKEN=ghp_yourPersonalAccessToken
GITHUB_CLIENT_ID=Iv1.abc123def456
GITHUB_CLIENT_SECRET=abc123def456...

# Google OAuth
GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123...

# App Configuration
PORT=5000
CLIENT_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

#### **How to Set:**

**Railway:**
- Dashboard → Your Service → Variables tab → "+ New Variable"

**Render:**
- Dashboard → Your Service → Environment → Add Environment Variable

---

### Issue #5: Port Binding Error

#### **Symptoms:**
- "Error: listen EADDRINUSE: address already in use"
- Server fails to start
- Health check fails

#### **Root Cause:**
App not using the PORT environment variable provided by the platform

#### **Solution:**
Check `server/src/index.ts`:
```typescript
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

**Important:** Bind to `0.0.0.0`, not `localhost`!

---

### Issue #6: Build Succeeds but Server Crashes

#### **Symptoms:**
- Build completes successfully
- Server starts then immediately crashes
- Logs show runtime errors

#### **Common Causes & Solutions:**

**1. TypeScript not compiled:**
```bash
# Verify dist/ folder exists after build
cd server && npm run build
# Should create dist/index.js
```

**2. Dependencies in devDependencies:**
```json
// server/package.json
{
  "dependencies": {
    "@prisma/client": "^5.7.1",  // ✅ MUST be here
    "express": "^4.18.2"
  },
  "devDependencies": {
    "prisma": "^5.7.1",  // ✅ Build-time only
    "typescript": "^5.3.3"
  }
}
```

**3. Missing .env file:**
- Don't commit `.env` files!
- Set all variables in platform dashboard

---

### Issue #7: CORS Errors After Deployment

#### **Symptoms:**
- Frontend can't connect to backend
- "CORS policy" errors in browser console
- Preflight OPTIONS requests fail

#### **Solution:**
Check `server/src/index.ts` CORS configuration:
```typescript
import cors from 'cors';

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
```

Update `CLIENT_URL` environment variable with your Vercel URL:
```
CLIENT_URL=https://your-app.vercel.app
```

---

## 🔍 How to Debug

### 1. **Check Build Logs**

**Railway:**
- Dashboard → Deployments → Click on failed deployment → View Logs

**Render:**
- Dashboard → Your Service → Logs tab → Filter by "Build"

**Look for:**
- `npm install` errors
- TypeScript compilation errors
- Prisma generation errors

### 2. **Check Runtime Logs**

**Look for:**
- Database connection errors
- Missing environment variables
- Uncaught exceptions
- Port binding errors

### 3. **Test Locally First**

```bash
# Test the exact build command locally
cd c:\Users\HP\PRO\student-rank
npm run build:server

# Test start command
npm run start:server
```

### 4. **Use Platform Shell**

**Railway:**
- Dashboard → Service → "..." menu → Open Shell
- Run: `npm run build:server`

**Render:**
- Dashboard → Shell tab
- Run commands to debug

---

## ✅ Deployment Checklist

Before deploying, verify:

- [ ] `package.json` exists at root with build scripts
- [ ] `railway.json` OR `render.yaml` configured
- [ ] All environment variables set in platform
- [ ] PostgreSQL database created and linked
- [ ] Build command includes `npx prisma generate`
- [ ] Start command points to correct entry file
- [ ] PORT environment variable used in code
- [ ] CORS configured with CLIENT_URL
- [ ] Dependencies in correct package.json sections

---

## 🆘 Still Failing?

### Share These Details:

1. **Platform**: Railway or Render?
2. **Error Message**: Copy exact error from build/deploy logs
3. **Build Command**: What command is being run?
4. **Environment Variables**: Are they all set? (don't share values!)
5. **Database**: Is PostgreSQL connected?

### Quick Health Check:

```bash
# Test if your backend URL is accessible
curl https://your-backend-url.railway.app/

# Test with your frontend URL
curl https://your-backend-url.railway.app/api/users
```

---

## 🎯 Most Common Fix

**90% of backend failures are due to:**
1. Missing `DATABASE_URL`
2. Prisma client not generated
3. Wrong build/start commands

**Quick Fix Steps:**
1. Add PostgreSQL database
2. Verify `DATABASE_URL` is set
3. Update build command: `cd server && npm ci && npx prisma generate && npm run build`
4. Update start command: `cd server && npm start`
5. Redeploy

---

Good luck! 🚀
