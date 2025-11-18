# 🔧 Fix: ERR_CONNECTION_REFUSED - Password Reset Not Working

## 🚨 Problem

When you click the password reset link from your email, you get:
- `ERR_CONNECTION_REFUSED`
- `127.0.0.1 refused to connect`
- "This site can't be reached"

**Why this happens:**
- The email link tries to redirect to `localhost` or `127.0.0.1`
- When you click the email link, your browser can't connect to localhost because:
  - The local server might not be running
  - Email links can't access your local machine
  - Localhost URLs don't work from external sources (like email)

---

## ✅ Solution Options

### **Option 1: Use ngrok (Recommended for Local Testing)**

ngrok creates a public URL that tunnels to your local server.

#### Step 1: Install ngrok
```bash
# Download from https://ngrok.com/download
# Or use npm:
npm install -g ngrok
```

#### Step 2: Start your local server
```bash
# In one terminal, start your server:
npx serve .
# Or: python -m http.server 8000
```

#### Step 3: Start ngrok
```bash
# In another terminal, run ngrok:
ngrok http 3000
# Or: ngrok http 8000 (if using Python server)
```

#### Step 4: Copy the ngrok URL
You'll see something like:
```
Forwarding: https://abc123.ngrok.io -> http://localhost:3000
```

#### Step 5: Configure in supabaseClient.js
Open `supabaseClient.js` and set:
```javascript
const PASSWORD_RESET_REDIRECT_URL = 'https://abc123.ngrok.io'; // Your ngrok URL
```

#### Step 6: Configure in Supabase Dashboard
1. Go to **Supabase Dashboard** → **Authentication** → **URL Configuration**
2. Add to **Redirect URLs**:
   ```
   https://abc123.ngrok.io/reset-password.html
   ```
3. Set **Site URL** to:
   ```
   https://abc123.ngrok.io
   ```
4. **Save**

#### Step 7: Test
1. Request password reset
2. Click the link in email
3. It should now work! ✅

---

### **Option 2: Configure Supabase Site URL (For Production)**

If your app is deployed to a public URL:

#### Step 1: Configure in supabaseClient.js
Open `supabaseClient.js` and set:
```javascript
const PASSWORD_RESET_REDIRECT_URL = 'https://yourdomain.com'; // Your actual domain
```

#### Step 2: Configure in Supabase Dashboard
1. Go to **Supabase Dashboard** → **Authentication** → **URL Configuration**
2. Add to **Redirect URLs**:
   ```
   https://yourdomain.com/reset-password.html
   ```
3. Set **Site URL** to:
   ```
   https://yourdomain.com
   ```
4. **Save**

---

### **Option 3: Manual Token Copy (Quick Workaround)**

If you just need to reset your password quickly:

1. **Request password reset** (click "Forgot Password?")
2. **Check your email** for the reset link
3. **Copy the entire URL** from the email
4. **Open it in your browser** (make sure your local server is running)
5. **OR extract the token manually:**
   - The URL will have a hash like: `#access_token=...&type=recovery`
   - Copy everything after the `#`
   - Go to `http://localhost:3000/reset-password.html` (or your port)
   - Add the hash to the URL: `http://localhost:3000/reset-password.html#access_token=...&type=recovery`
   - Press Enter

---

## 🔍 Quick Fix Steps (Choose One)

### For Local Development (Use ngrok):
1. ✅ Install ngrok: `npm install -g ngrok`
2. ✅ Start server: `npx serve .`
3. ✅ Start ngrok: `ngrok http 3000`
4. ✅ Copy ngrok URL (e.g., `https://abc123.ngrok.io`)
5. ✅ Set in `supabaseClient.js`: `PASSWORD_RESET_REDIRECT_URL = 'https://abc123.ngrok.io'`
6. ✅ Add to Supabase Redirect URLs: `https://abc123.ngrok.io/reset-password.html`
7. ✅ Test password reset

### For Production:
1. ✅ Set in `supabaseClient.js`: `PASSWORD_RESET_REDIRECT_URL = 'https://yourdomain.com'`
2. ✅ Add to Supabase Redirect URLs: `https://yourdomain.com/reset-password.html`
3. ✅ Set Supabase Site URL: `https://yourdomain.com`
4. ✅ Test password reset

---

## 📝 Configuration Example

### supabaseClient.js
```javascript
// For local development with ngrok:
const PASSWORD_RESET_REDIRECT_URL = 'https://abc123.ngrok.io';

// For production:
// const PASSWORD_RESET_REDIRECT_URL = 'https://yourdomain.com';

// Leave null to use Supabase Site URL:
// const PASSWORD_RESET_REDIRECT_URL = null;
```

### Supabase Dashboard Settings
**Redirect URLs:**
```
https://abc123.ngrok.io/reset-password.html
https://yourdomain.com/reset-password.html
```

**Site URL:**
```
https://abc123.ngrok.io
```
(or your production domain)

---

## ✅ Verification

After configuration:

1. ✅ Request password reset from login page
2. ✅ Check email for reset link
3. ✅ Click the link
4. ✅ Should redirect to reset-password.html successfully
5. ✅ No more "ERR_CONNECTION_REFUSED" error!

---

## 🆘 Still Having Issues?

**Check:**
- ✅ Is your local server running? (`npx serve .`)
- ✅ Is ngrok running? (if using ngrok)
- ✅ Is the redirect URL correct in `supabaseClient.js`?
- ✅ Is the redirect URL added in Supabase Dashboard?
- ✅ Did you save the changes in Supabase Dashboard?

**Common Mistakes:**
- ❌ Forgetting to include `/reset-password.html` in Supabase Redirect URLs
- ❌ Using `http://` instead of `https://` (ngrok uses https)
- ❌ Not saving changes in Supabase Dashboard
- ❌ Typo in the redirect URL

---

**The password reset will work once you configure a public URL (ngrok for local, or your domain for production)!** 🎉


