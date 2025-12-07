# Fix Connection Timeout on Mobile

## The Problem
Your phone can't connect because:
1. React dev server only listens on localhost by default
2. Windows Firewall might be blocking the connection

## Solution Steps

### Step 1: Allow Firewall Access

Run these commands in PowerShell as Administrator:

```powershell
# Allow port 3000 (React)
New-NetFirewallRule -DisplayName "React Dev Server" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow

# Allow port 5000 (Backend)
New-NetFirewallRule -DisplayName "Express Server" -Direction Inbound -LocalPort 5000 -Protocol TCP -Action Allow
```

**OR manually:**
1. Open Windows Defender Firewall
2. Click "Advanced settings"
3. Click "Inbound Rules" → "New Rule"
4. Select "Port" → Next
5. Select "TCP" and enter port: 3000
6. Select "Allow the connection"
7. Apply to all profiles
8. Repeat for port 5000

### Step 2: Restart the Server

1. Stop the current server (Ctrl+C)
2. Restart it:
   ```bash
   npm run dev
   ```

### Step 3: Verify Server is Listening

After starting, you should see:
```
Compiled successfully!
You can now view campus-events-client in the browser.
  Local:            http://localhost:3000
  On Your Network:  http://192.168.31.173:3000
```

If you see "On Your Network" URL, it's working!

### Step 4: Try Again on Phone

Open: `http://192.168.31.173:3000`

## Alternative: Use .env file

If the package.json method doesn't work, create `client/.env` file:

```
HOST=0.0.0.0
DANGEROUSLY_DISABLE_HOST_CHECK=true
```

Then restart the server.

