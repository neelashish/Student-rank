# Railway Deployment Guide (Backend) 🚂

This guide helps you deploy the **Express.js backend** to Railway.

## ✅ What I Fixed

Your deployment was failing because:
- Root directory is fixed at `main` (the repo root)
- Project has monorepo structure (client + server in subdirectories)
- Railway couldn't find package.json or build instructions

**Solution**: Added `package.json` and `railway.json` at root level with proper build scripts.

---

## 🚀 Deploy Backend to Railway

### Step 1: Commit and Push Changes

```bash
cd c:\Users\HP\PRO\student-rank
git add package.json railway.json
git commit -m "Add Railway configuration for monorepo"
git push
```

### Step 2: Configure Railway Project Settings

In your Railway dashboard, update these settings:

#### ⚙️ Build Settings
- **Build Command**: `npm run build:server`
- **Start Command**: `npm run start:server`
- **Watch Paths**: `server/**` (optional)

#### 📦 Install Command
- Leave as default (npm install)

### Step 3: Add Environment Variables

Click on **Variables** tab and add:

```env
DATABASE_URL=<auto-provided-by-railway-postgres>
JWT_SECRET=your-super-secret-jwt-key-change-this
GITHUB_TOKEN=your-github-personal-access-token
GITHUB_CLIENT_ID=your-github-oauth-client-id
GITHUB_CLIENT_SECRET=your-github-oauth-client-secret
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
PORT=5000
CLIENT_URL=http://localhost:3000
NODE_ENV=production
```

**Important**: 
- `DATABASE_URL` will be auto-filled if you add PostgreSQL plugin (see Step 4)
- Update `CLIENT_URL` later with your Vercel URL
- Generate a strong `JWT_SECRET`: `openssl rand -base64 32` or use a password generator

### Step 4: Add PostgreSQL Database

1. Click on your project
2. Click **"+ New"** → **"Database"** → **"Add PostgreSQL"**
3. Railway will automatically:
   - Create a PostgreSQL database
   - Set the `DATABASE_URL` environment variable
   - Link it to your service

### Step 5: Redeploy

After setting environment variables and adding PostgreSQL:
1. Go to **Deployments** tab
2. Click **"Redeploy"** or push a new commit to trigger deployment
3. Watch the build logs

---

## 🔍 Verify Deployment

### Check Build Logs
1. Click on your deployment
2. View **Build Logs** to see if build completed successfully
3. View **Deploy Logs** to see if server started

### Test Your Backend
Once deployed, Railway gives you a URL like: `https://student-rank-production.up.railway.app`

Test these endpoints:
```bash
# Health check
curl https://your-app.railway.app/

# Should return 404 or API response
curl https://your-app.railway.app/api/users
```

---

## 🐛 Common Railway Issues

### Issue 1: "npm ERR! enoent ENOENT: no such file or directory"

**Cause**: Build command not finding the right directory
**Solution**: 
- Verify `package.json` exists at root
- Check build command is: `npm run build:server`
- Ensure `railway.json` is committed

### Issue 2: "Prisma Client not generated"

**Cause**: Prisma client not generated during build
**Solution**: Build command should include `npx prisma generate`:
```json
"build:server": "cd server && npm install && npx prisma generate && npm run build"
```
This is already in the root `package.json` I created.

### Issue 3: "Cannot find module 'express'"

**Cause**: Dependencies not installed in server directory
**Solution**: Build command runs `npm install` in server directory (already configured)

### Issue 4: Database Connection Error

**Cause**: DATABASE_URL not set or PostgreSQL not connected
**Solution**:
1. Add PostgreSQL plugin to your project
2. Verify `DATABASE_URL` variable is set
3. Check database is running

### Issue 5: Port Binding Error

**Cause**: App not listening on PORT from environment
**Solution**: Check `server/src/index.ts`:
```typescript
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## 🔧 Advanced Railway Configuration

### Custom Nixpacks Configuration

If you need more control, create `nixpacks.toml`:

```toml
[phases.setup]
nixPkgs = ["nodejs-18_x", "postgresql"]

[phases.install]
cmds = ["cd server && npm install"]

[phases.build]
cmds = ["cd server && npx prisma generate && npm run build"]

[start]
cmd = "cd server && npm start"
```

### Multiple Services

If you want to deploy both frontend and backend on Railway:
1. Create **two separate services** in the same project
2. Configure each service differently:
   - **Backend Service**: Use `railway.json` as is
   - **Frontend Service**: Create separate config for client

---

## ✅ Next Steps After Backend Deployment

1. **Save your Railway backend URL**: `https://your-app.railway.app`
2. **Test all endpoints** to ensure they work
3. **Deploy frontend to Vercel** (see `VERCEL_DEPLOYMENT.md`)
4. **Update `CLIENT_URL`** in Railway env vars with your Vercel URL
5. **Update OAuth redirect URIs** to use your deployed URLs

---

## 📱 Railway Dashboard Tips

### Monitor Your App
- **Metrics**: View CPU, Memory, Network usage
- **Logs**: Real-time logs from your app
- **Deployments**: History of all deployments

### Environment Management
- Create separate environments (staging, production)
- Copy variables between environments
- Use Railway CLI for local testing

### Database Management
- **Railway Admin Panel**: Built-in database viewer
- **External Connection**: Connect with TablePlus, DBeaver, etc.
- **Backups**: Configure automated backups

---

## 🔗 Useful Links

- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Railway Discord**: Get help from the community
- **Nixpacks**: [nixpacks.com/docs](https://nixpacks.com/docs)

---

## 🎉 Success Checklist

- [ ] Backend builds successfully
- [ ] Server starts without errors
- [ ] Database connection works
- [ ] Environment variables are set
- [ ] Backend URL is accessible
- [ ] API endpoints respond correctly
- [ ] Prisma migrations applied

Once all checks pass, proceed to deploy the frontend to Vercel! 🚀
