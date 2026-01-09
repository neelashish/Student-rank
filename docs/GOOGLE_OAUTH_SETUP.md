# Google OAuth Setup Guide 🔐

## Step-by-Step Instructions

### 1. Go to Google Cloud Console

Visit: **https://console.cloud.google.com/**

### 2. Create a New Project (or Select Existing)

1. Click on the **project dropdown** at the top
2. Click **"New Project"**
3. **Project Name**: `StudentRank` (or your preferred name)
4. Click **"Create"**
5. Wait for the project to be created (a few seconds)
6. **Select the new project** from the dropdown

### 3. Enable Google+ API

1. In the left sidebar, go to **"APIs & Services" → "Library"**
2. Search for **"Google+ API"** or **"Google Identity"**
3. Click on **"Google+ API"**
4. Click **"Enable"**

### 4. Configure OAuth Consent Screen

1. Go to **"APIs & Services" → "OAuth consent screen"**
2. Choose **"External"** (unless you have a Google Workspace account)
3. Click **"Create"**

**Fill in the required fields:**
- **App name**: `StudentRank`
- **User support email**: Your email
- **Developer contact email**: Your email
- **App logo** (optional): Skip for now
- **Authorized domains**: Leave empty for development

4. Click **"Save and Continue"**
5. **Scopes**: Click **"Add or Remove Scopes"**
   - Select: `userinfo.email`
   - Select: `userinfo.profile`
   - Click **"Update"**
   - Click **"Save and Continue"**

6. **Test users** (for External apps):
   - Click **"Add Users"**
   - Add your email and any test emails
   - Click **"Save and Continue"**

7. Click **"Back to Dashboard"**

### 5. Create OAuth 2.0 Credentials

1. Go to **"APIs & Services" → "Credentials"**
2. Click **"+ CREATE CREDENTIALS"** at the top
3. Select **"OAuth client ID"**
4. **Application type**: Choose **"Web application"**

**Configure the OAuth client:**

- **Name**: `StudentRank Web Client`

- **Authorized JavaScript origins**:
  - `http://localhost:3000`
  - `http://localhost:3001` (if needed)

- **Authorized redirect URIs**:
  - `http://localhost:3000/auth/callback/google`

5. Click **"Create"**
6. A popup will appear with your **Client ID** and **Client Secret**
7. **Copy both** - you'll need them for environment variables

### 6. Update Environment Variables

#### Backend: `server/.env`

Add these lines:
```env
GOOGLE_CLIENT_ID="your_google_client_id_here"
GOOGLE_CLIENT_SECRET="your_google_client_secret_here"
```

#### Frontend: `client/.env.local`

Add this line:
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your_google_client_id_here"
```

**Important**: Replace `your_google_client_id_here` and `your_google_client_secret_here` with the actual values from Google Cloud Console.

### 7. Restart Your Servers

```bash
# Stop both servers (Ctrl+C in each terminal)

# Restart backend
cd server
npm run dev

# Restart frontend (new terminal)
cd client
npm run dev
```

## ✅ Testing Google OAuth

1. Go to http://localhost:3000/auth/login
2. Click **"Continue with Google"**
3. Select your Google account
4. Authorize the app
5. You should be redirected back and logged in!

## 🔧 Troubleshooting

### Error: "Access blocked: This app's request is invalid"
- **Solution**: Make sure you've configured the OAuth consent screen properly
- Add your email as a test user if using External app type

### Error: "redirect_uri_mismatch"
- **Solution**: Check that the redirect URI in Google Cloud Console exactly matches:
  - `http://localhost:3000/auth/callback/google`
- No trailing slash, protocol must be http for localhost

### Error: "invalid_client"
- **Solution**: Double-check your Client ID and Secret in `.env` files
- Make sure there are no extra spaces or quotes

### Button still shows "coming soon"
- **Solution**: Make sure you've:
  1. Updated the login page code (I'll update this for you)
  2. Added `NEXT_PUBLIC_GOOGLE_CLIENT_ID` to `client/.env.local`
  3. Restarted the frontend server

## 🚀 Production Setup

When deploying to production (e.g., Vercel, Netlify):

1. Go back to Google Cloud Console → Credentials
2. Edit your OAuth client
3. Add your production URLs:
   - **Authorized JavaScript origins**: `https://yourdomain.com`
   - **Authorized redirect URIs**: `https://yourdomain.com/auth/callback/google`
4. Update environment variables in your hosting platform

## 📝 Important Notes

- Keep your **Client Secret** private (never commit to Git)
- The `.env.local` file is already in `.gitignore`
- For External app type, only test users can sign in until you publish the app
- To make it public, submit the OAuth consent screen for verification (optional)

## 🎯 What You Get with Google OAuth

✅ User's Google profile picture  
✅ User's name from Google  
✅ User's email (verified by Google)  
✅ Automatic account creation  
✅ Secure authentication without passwords  

---

**Happy coding! 🚀**
