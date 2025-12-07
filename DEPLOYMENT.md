# How to Host Your Campus Event Management System

## Deployment Options

### Option 1: Free Hosting (Recommended for Start)

#### Frontend (React) - Vercel or Netlify
#### Backend (Express) - Railway, Render, or Fly.io
#### Database (MySQL) - Railway, PlanetScale, or Aiven

---

## 🚀 Quick Deployment Guide

### Step 1: Prepare for Production

#### 1.1 Update API Configuration

Create `client/.env.production`:
```env
REACT_APP_API_URL=https://your-backend-url.com
```

Update `client/src/config.js`:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
```

#### 1.2 Build the Frontend

```bash
cd client
npm run build
```

This creates an optimized production build in `client/build/`

---

## 📦 Deployment Methods

### Method 1: Vercel (Frontend) + Railway (Backend + Database)

#### Frontend on Vercel:

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   cd client
   vercel
   ```
   - Follow prompts
   - Add environment variable: `REACT_APP_API_URL=https://your-backend.railway.app`

3. **Or use Vercel Dashboard:**
   - Go to https://vercel.com
   - Import your GitHub repository
   - Set root directory to `client`
   - Add environment variable: `REACT_APP_API_URL`

#### Backend + Database on Railway:

1. **Go to:** https://railway.app
2. **Sign up** with GitHub
3. **Create New Project**
4. **Add MySQL Database:**
   - Click "New" → "Database" → "MySQL"
   - Copy connection details
5. **Add Backend Service:**
   - Click "New" → "GitHub Repo"
   - Select your repository
   - Set root directory to project root (not client)
   - Add environment variables:
     ```
     DB_HOST=your-railway-mysql-host
     DB_USER=root
     DB_PASSWORD=your-password
     DB_NAME=railway
     PORT=5000
     JWT_SECRET=your-secret-key
     ```
6. **Update CORS in server/index.js:**
   ```javascript
   app.use(cors({
     origin: ['https://your-frontend.vercel.app', 'http://localhost:3000'],
     credentials: true
   }));
   ```

---

### Method 2: Netlify (Frontend) + Render (Backend)

#### Frontend on Netlify:

1. **Go to:** https://netlify.com
2. **Sign up** and connect GitHub
3. **New site from Git**
4. **Settings:**
   - Build command: `cd client && npm install && npm run build`
   - Publish directory: `client/build`
   - Environment variables:
     - `REACT_APP_API_URL=https://your-backend.onrender.com`

#### Backend on Render:

1. **Go to:** https://render.com
2. **Sign up** with GitHub
3. **New Web Service**
4. **Connect repository**
5. **Settings:**
   - Build command: `npm install`
   - Start command: `node server/index.js`
   - Environment variables:
     ```
     DB_HOST=your-db-host
     DB_USER=your-user
     DB_PASSWORD=your-password
     DB_NAME=your-db-name
     PORT=5000
     JWT_SECRET=your-secret-key
     NODE_ENV=production
     ```
6. **Add MySQL Database:**
   - New → PostgreSQL (or use external MySQL)
   - Or use PlanetScale for MySQL

---

### Method 3: All-in-One: Fly.io

1. **Install Fly CLI:**
   ```bash
   powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
   ```

2. **Login:**
   ```bash
   fly auth login
   ```

3. **Initialize:**
   ```bash
   fly launch
   ```

4. **Configure:**
   - Follow prompts
   - Add MySQL database separately

---

## 🗄️ Database Hosting Options

### Option 1: Railway MySQL (Easiest)
- Included with Railway deployment
- Free tier available

### Option 2: PlanetScale (MySQL)
- Free tier: 1 database, 1GB storage
- Go to: https://planetscale.com
- Create database
- Get connection string

### Option 3: Aiven MySQL
- Free tier available
- Go to: https://aiven.io

### Option 4: Supabase (PostgreSQL - requires code changes)
- Free tier available
- Would need to modify database queries

---

## 📝 Production Checklist

### Before Deploying:

- [ ] Update `client/src/config.js` to use environment variable
- [ ] Set strong `JWT_SECRET` in production
- [ ] Update CORS to allow your frontend domain
- [ ] Test database connection
- [ ] Build frontend: `cd client && npm run build`
- [ ] Test production build locally

### Environment Variables Needed:

**Backend:**
```
DB_HOST=your-database-host
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=your-database-name
PORT=5000
JWT_SECRET=strong-random-secret-key
NODE_ENV=production
```

**Frontend:**
```
REACT_APP_API_URL=https://your-backend-url.com
```

---

## 🔧 Update Code for Production

### 1. Update CORS in server/index.js:

```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'https://your-frontend.vercel.app',
  'https://your-frontend.netlify.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

### 2. Create production build script:

Add to `package.json`:
```json
"scripts": {
  "build": "cd client && npm run build",
  "start:prod": "node server/index.js"
}
```

---

## 🎯 Recommended Setup (Easiest)

1. **Frontend:** Vercel (automatic deployments from GitHub)
2. **Backend:** Railway (includes MySQL database)
3. **Total Cost:** FREE

### Steps:
1. Push code to GitHub
2. Deploy frontend to Vercel
3. Deploy backend to Railway
4. Connect database on Railway
5. Update environment variables
6. Done!

---

## 📚 Additional Resources

- **Vercel Docs:** https://vercel.com/docs
- **Railway Docs:** https://docs.railway.app
- **Netlify Docs:** https://docs.netlify.com
- **Render Docs:** https://render.com/docs

---

## 🆘 Troubleshooting

### CORS Errors:
- Make sure frontend URL is in CORS allowed origins
- Check environment variables are set correctly

### Database Connection:
- Verify database credentials
- Check if database allows external connections
- Test connection locally first

### Build Errors:
- Make sure all dependencies are in package.json
- Check Node.js version compatibility
- Review build logs for specific errors

