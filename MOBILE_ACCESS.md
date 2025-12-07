# How to Access the Website on Your Phone

## Quick Steps

1. **Make sure your phone and computer are on the same WiFi network**

2. **Find your computer's IP address:**
   - Windows: Open Command Prompt and type `ipconfig`
   - Look for "IPv4 Address" (e.g., 192.168.31.173)
   - Mac/Linux: Open Terminal and type `ifconfig`

3. **Update the config file** (if your IP changed):
   - Edit `client/src/config.js`
   - Change the IP address to your current IP

4. **Start the servers:**
   ```bash
   npm run dev
   ```

5. **Access from your phone:**
   - Open your phone's browser
   - Go to: `http://192.168.31.173:3000`
   - (Replace with your actual IP address)

## Current Configuration

Your current IP address is set to: **192.168.31.173**

If your IP address changes, update it in `client/src/config.js`

## Troubleshooting

### Can't connect from phone:
1. **Check firewall:** Make sure Windows Firewall allows connections on ports 3000 and 5000
2. **Check WiFi:** Ensure phone and computer are on the same network
3. **Check IP:** Verify your IP address hasn't changed (run `ipconfig` again)
4. **Check servers:** Make sure both frontend and backend are running

### Firewall Settings (Windows):
1. Open Windows Defender Firewall
2. Click "Advanced settings"
3. Click "Inbound Rules" → "New Rule"
4. Select "Port" → Next
5. Enter ports: 3000 and 5000
6. Allow the connection

### Alternative: Use ngrok (for external access)
If you want to access from anywhere (not just same WiFi):
1. Install ngrok: https://ngrok.com/
2. Run: `ngrok http 3000`
3. Use the provided URL on your phone

