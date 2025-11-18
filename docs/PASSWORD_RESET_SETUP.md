# 🔐 Password Reset Setup Guide

## ✅ Quick Fix for "Could Not Find Page" Error

If you're getting a "could not find page" error when clicking the password reset link in your email, follow these steps:

### Step 1: Configure Redirect URL in Supabase

1. **Go to Supabase Dashboard**
   - Visit [supabase.com](https://supabase.com)
   - Login to your account
   - Select your project

2. **Navigate to Authentication Settings**
   - Click on **"Authentication"** in the left sidebar
   - Click on **"URL Configuration"** (or go to Settings → Authentication → URL Configuration)

3. **Add Redirect URLs**
   - Find the **"Redirect URLs"** section
   - Add your site URLs (one per line):

   **For Local Development:**
   ```
   http://localhost:3000/reset-password.html
   http://localhost:8000/reset-password.html
   http://localhost:8080/reset-password.html
   ```

   **For Production (replace with your actual domain):**
   ```
   https://yourdomain.com/reset-password.html
   https://www.yourdomain.com/reset-password.html
   ```

   **Important:** 
   - Include the full path: `/reset-password.html`
   - Add all variations (with/without www, http/https)
   - If your files are in a subdirectory, include that path too

4. **Save Changes**
   - Click **"Save"** or **"Update"**

### Step 2: Verify Site URL

1. In the same **URL Configuration** page
2. Check **"Site URL"** field
3. Make sure it matches your actual site URL:
   - For local: `http://localhost:3000` (or your port)
   - For production: `https://yourdomain.com`

### Step 3: Test the Password Reset

1. Go to your login page
2. Click **"Forgot Password?"**
3. Enter your email
4. Check your email inbox
5. Click the reset link in the email
6. You should now be redirected to `reset-password.html` successfully!

---

## 🔍 Troubleshooting

### Still Getting "Could Not Find Page"?

**Check 1: Verify File Exists**
- Make sure `reset-password.html` is in the same directory as `index.html`
- Check the file name is exactly `reset-password.html` (case-sensitive)

**Check 2: Check the Email Link**
- Open the email and look at the reset link
- It should look like: `https://yourproject.supabase.co/auth/v1/verify?token=...&type=recovery&redirect_to=...`
- The `redirect_to` parameter should match your redirect URL

**Check 3: Browser Console**
- Open browser Developer Tools (F12)
- Go to Console tab
- Click the reset link
- Check for any error messages

**Check 4: Network Tab**
- Open Developer Tools (F12)
- Go to Network tab
- Click the reset link
- Look for failed requests (red entries)
- Check the response for error messages

**Check 5: Supabase Logs**
- Go to Supabase Dashboard → Authentication → Logs
- Look for recent password reset attempts
- Check for any errors

### Common Issues

**Issue: "redirect_to URL is not allowed"**
- **Solution:** Add the exact URL to Redirect URLs in Supabase settings

**Issue: "Invalid or expired reset link"**
- **Solution:** Request a new password reset link (they expire after some time)

**Issue: Page loads but shows error**
- **Solution:** Check browser console for JavaScript errors
- Make sure `supabaseClient.js` is loaded correctly

---

## 📝 Example Configuration

### For Local Development (using `npx serve`)

**Supabase Redirect URLs:**
```
http://localhost:3000/reset-password.html
```

**Site URL:**
```
http://localhost:3000
```

### For Production

**Supabase Redirect URLs:**
```
https://yourdomain.com/reset-password.html
https://www.yourdomain.com/reset-password.html
```

**Site URL:**
```
https://yourdomain.com
```

---

## ✅ Verification Checklist

- [ ] Redirect URLs added in Supabase Dashboard
- [ ] Site URL configured correctly
- [ ] `reset-password.html` file exists in project root
- [ ] Tested password reset flow
- [ ] Email link redirects correctly
- [ ] Password reset form loads successfully

---

## 🆘 Still Need Help?

If you're still having issues:

1. **Check the exact error message** in browser console
2. **Verify the redirect URL** in Supabase matches your actual URL
3. **Test with a simple URL first** (like `http://localhost:3000/reset-password.html`)
4. **Make sure you're using the latest code** from the repository

The password reset feature should work once the redirect URL is properly configured in Supabase! 🎉

