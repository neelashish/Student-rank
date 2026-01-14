# Manual Database Setup for Render (Free Tier)

Since Render Shell is not available on the free tier, we need to set up the database schema manually.

---

## 🎯 **Solution: Create Schema Using Prisma Studio**

### **Option 1: Use Local Prisma Studio (Recommended)**

You can create the schema from your local machine using a connection to the Render PostgreSQL database.

#### **Step 1: Get Database Connection String**

1. Go to **Render Dashboard** → Your PostgreSQL database
2. Click **"Info"** tab
3. Copy the **"External Database URL"** (starts with `postgresql://`)
4. It looks like:
   ```
   postgresql://username:password@oregon-postgres.render.com:5432/dbname
   ```

####  **Step 2: Connect From Local Machine**

1. **Create temporary `.env` file** in your project root:
   ```bash
   # In c:\Users\HP\PRO\student-rank\server
   echo DATABASE_URL="<paste-external-url-here>" > .env.temp
   ```

2. **Run Prisma Migration**:
   ```bash
   cd c:\Users\HP\PRO\student-rank\server
   npx prisma db push --schema=prisma/schema.prisma
   ```

3. **Delete temp file**:
   ```bash
   rm .env.temp
   ```

This will create all tables in your Render PostgreSQL database!

---

### **Option 2: SQL Script Upload (Alternative)**

If Prisma connection doesn't work, you can generate SQL and execute it manually.

#### **Step 1: Generate SQL Schema**

Run locally:
```bash
cd c:\Users\HP\PRO\student-rank\server
npx prisma migrate dev --name init --create-only
```

This creates a migration file in `prisma/migrations/`.

#### **Step 2: Copy SQL Content**

Open the generated SQL file and copy its contents.

#### **Step 3: Execute in Render**

Unfortunately, free tier doesn't have SQL editor access. You'll need to upgrade to use this method.

---

## ✅ **Recommended Approach**

**Use Option 1**: Connect from your local machine to Render's database and run `prisma db push`.

### **Complete Steps:**

```bash
# 1. Navigate to server directory
cd c:\Users\HP\PRO\student-rank\server

# 2. Set DATABASE_URL temporarily
$env:DATABASE_URL="postgresql://user:pass@oregon-postgres.render.com:5432/dbname"

# 3. Push schema to database
npx prisma db push

# 4. Verify tables created
npx prisma studio
```

---

## 🔍 **Verify Schema Created**

After running `prisma db push`, you should see:

```
✔ Prisma schema loaded from prisma/schema.prisma
✔ Datasource "db": PostgreSQL database "dbname", schema "public" at "oregon-postgres.render.com:5432"

✔ Generated Prisma Client (v5.22.0)

The following migration(s) have been applied:

✔ Applied changes to the database:
  - Created table "User"
  - Created table "College"
  - Created table "PlatformStats"
  - Created table "Ranking"
  - Created indexes and relations
```

---

## 📊 **Tables That Will Be Created:**

- ✅ **User** - Stores user accounts
- ✅ **College** - College information
- ✅ **PlatformStats** - LeetCode, GitHub, HackerRank stats
- ✅ **Ranking** - Leaderboard rankings
- ✅ All relationships and indexes

----

## 🎉 **After Schema is Created:**

1. **Redeploy your Render service** (if it's not already running)
2. Test your backend:
   ```
   https://your-backend-url.onrender.com/health
   ```
3. Your backend should now start successfully!

---

## 🆘 **If Connection Fails:**

**Error: "Can't reach database"**

Make sure you're using the **External Database URL**.

The Internal URL only works from within Render services, not from your local machine.

---

**Good luck!** 🚀
