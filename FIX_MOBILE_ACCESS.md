# Fix: Connection Timeout on Mobile

## Quick Fix Steps

### 1. **Allow Windows Firewall Access** (MOST IMPORTANT!)

**Option A: PowerShell (Run as Administrator)**
```powershell
New-NetFirewallRule -DisplayName "React Dev Server" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "Express Server" -Direction Inbound -LocalPort 5000 -Protocol TCP -Action Allow
```

**Option B: Manual Method**
1. Press `Win + R`, type `wf.msc`, press Enter
2. Click "Inbound Rules" → "New Rule"
3. Select "Port" → Next
4. Select "TCP", enter port: **3000** → Next
5. Select "Allow the connection" → Next
6. Check all profiles → Next
7. Name it "React Dev Server" → Finish
8. Repeat for port **5000** (name it "Express Server")

### 2. **Restart Your Server**

1. Stop the current server (press `Ctrl+C` in the terminal)
2. Start it again:
   ```bash
   npm run dev
   ```

### 3. **Check the Output**

After starting, you should see:
```
Compiled successfully!

You can now view campus-events-client in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.31.173:3000  ← This line is important!
```

**If you see "On Your Network" URL, it's working!**

### 4. **Try on Your Phone Again**

Open: `http://192.168.31.173:3000`

## If Still Not Working

### Check Your IP Address
```bash
ipconfig
```
Look for "IPv4 Address" - make sure it matches `192.168.31.173`

### Verify Same WiFi Network
- Phone and computer must be on the **same WiFi network**
- Try disconnecting and reconnecting your phone to WiFi

### Test Connection
On your phone, try pinging your computer:
- Install a network tool app
- Or try accessing: `http://192.168.31.173:5000/api/events` (should show JSON or error, not timeout)

## The .env File

I've created `client/.env` with:
```
HOST=0.0.0.0
DANGEROUSLY_DISABLE_HOST_CHECK=true
```

This makes React listen on all network interfaces. Restart the server after this is created.

