# Quick Deployment Guide

## 🚀 Fastest Way to Deploy (5 minutes)

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/campus-events.git
git push -u origin main
```

### Step 2: Deploy Frontend to Vercel

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "New Project"
4. Import your repository
5. **Settings:**
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`
6. **Environment Variables:**
   - `REACT_APP_API_URL` = (leave empty for now, add after backend deploys)
7. Click "Deploy"
8. Copy your Vercel URL (e.g., `https://campus-events.vercel.app`)

### Step 3: Deploy Backend to Railway

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. **Add MySQL Database:**
   - Click "+ New" → "Database" → "MySQL"
   - Wait for it to provision
6. **Configure Backend:**
   - Click on your service
   - Go to "Variables" tab
   - Add these variables:
     ```
     DB_HOST=${{MySQL.MYSQLHOST}}
     DB_USER=${{MySQL.MYSQLUSER}}
     DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
     DB_NAME=${{MySQL.MYSQLDATABASE}}
     PORT=5000
     JWT_SECRET=your-very-secure-secret-key-here
     NODE_ENV=production
     FRONTEND_URL=https://your-vercel-url.vercel.app
     ```
   - Click "Generate Domain" to get your backend URL
7. Copy your Railway backend URL (e.g., `https://campus-events-production.up.railway.app`)

### Step 4: Update Frontend Environment Variable

1. Go back to Vercel
2. Go to your project → Settings → Environment Variables
3. Update `REACT_APP_API_URL` = `https://your-railway-backend-url.railway.app`
4. Redeploy (or it will auto-redeploy)

### Step 5: Initialize Database

1. Go to Railway → Your MySQL database
2. Copy connection details
3. Update your local `.env` with Railway database credentials
4. Run locally:
   ```bash
   npm run create-admin
   npm run seed
   ```
   Or use Railway's MySQL console to run SQL commands

### Step 6: Update CORS

The code already includes CORS configuration. Just make sure `FRONTEND_URL` environment variable is set in Railway.

### Done! 🎉

Your website is now live at: `https://your-vercel-url.vercel.app`

---

## 📝 Important Notes

1. **Database:** Railway MySQL will be empty initially. You need to:
   - Run migrations (tables auto-create on first server start)
   - Create admin user: Use Railway's MySQL console or run `npm run create-admin` locally with Railway DB credentials

2. **Environment Variables:** Never commit `.env` files to GitHub

3. **CORS:** Make sure your frontend URL is in the allowed origins

4. **HTTPS:** Both Vercel and Railway provide HTTPS automatically

---

## 🔄 Updating Your Site

Just push to GitHub:
```bash
git add .
git commit -m "Update features"
git push
```

Vercel and Railway will auto-deploy!

---

## 💰 Cost

- **Vercel:** FREE (hobby plan)
- **Railway:** FREE tier available (with usage limits)
- **Total:** $0/month for small projects

---

## 🆘 Troubleshooting

### Database Connection Issues:
- Check environment variables in Railway
- Verify database is running
- Test connection string format

### CORS Errors:
- Verify `FRONTEND_URL` is set in Railway
- Check frontend URL matches exactly

### Build Errors:
- Check build logs in Vercel
- Verify all dependencies in package.json
- Check Node.js version compatibility

