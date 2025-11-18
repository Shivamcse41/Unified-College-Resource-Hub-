# 🔐 Vercel Password Reset Setup - Complete Guide

## ✅ Configuration Complete!

आपका app Vercel पर host है: **https://unified-college-resource-hub.vercel.app**

Password reset feature को configure कर दिया गया है। अब आपको सिर्फ Supabase Dashboard में settings update करनी हैं।

---

## 📋 Step-by-Step Setup

### Step 1: Supabase Dashboard में जाएं

1. **Supabase Dashboard** खोलें: [supabase.com](https://supabase.com)
2. Login करें
3. अपना project select करें

### Step 2: Authentication Settings खोलें

1. Left sidebar में **"Authentication"** पर click करें
2. **"URL Configuration"** पर click करें
   (या Settings → Authentication → URL Configuration)

### Step 3: Redirect URLs Add करें

**"Redirect URLs"** section में ये URL add करें:

```
https://unified-college-resource-hub.vercel.app/reset-password.html
```

**Important:**
- Exact URL copy-paste करें (case-sensitive)
- `/reset-password.html` include करना जरूरी है
- Multiple URLs add कर सकते हैं (एक line में एक URL)

### Step 4: Site URL Set करें

**"Site URL"** field में ये URL set करें:

```
https://unified-college-resource-hub.vercel.app
```

**Note:** Site URL में `/reset-password.html` नहीं जोड़ना है, सिर्फ base URL

### Step 5: Save करें

- **"Save"** या **"Update"** button click करें
- Settings save हो जाएंगी

---

## ✅ Verification (Test करें)

### Test Password Reset:

1. **Login page** पर जाएं: `https://unified-college-resource-hub.vercel.app`
2. **"Forgot Password?"** link click करें
3. **Email address** enter करें
4. **"Send Reset Link"** button click करें
5. **Email check करें** (inbox/spam folder)
6. **Email में reset link** click करें
7. ✅ **reset-password.html** page खुलना चाहिए
8. **New password** enter करें
9. ✅ **Password reset successful!**

---

## 🔍 Troubleshooting

### अगर अभी भी error आ रहा है:

**Check 1: Supabase Redirect URLs**
- ✅ `https://unified-college-resource-hub.vercel.app/reset-password.html` add किया है?
- ✅ Exact URL है? (no typos, correct spelling)

**Check 2: Supabase Site URL**
- ✅ `https://unified-college-resource-hub.vercel.app` set किया है?
- ✅ Trailing slash नहीं है?

**Check 3: Code Configuration**
- ✅ `supabaseClient.js` में URL set है:
  ```javascript
  window.PASSWORD_RESET_REDIRECT_URL = 'https://unified-college-resource-hub.vercel.app';
  ```

**Check 4: Browser Console**
- F12 press करें (Developer Tools)
- Console tab check करें
- कोई error message है?

**Check 5: Network Tab**
- F12 → Network tab
- Reset link click करें
- Failed requests (red) check करें

---

## 📝 Configuration Summary

### Code में (Already Done ✅):
```javascript
// supabaseClient.js
window.PASSWORD_RESET_REDIRECT_URL = 'https://unified-college-resource-hub.vercel.app';
```

### Supabase Dashboard में (आपको करना है):

**Redirect URLs:**
```
https://unified-college-resource-hub.vercel.app/reset-password.html
```

**Site URL:**
```
https://unified-college-resource-hub.vercel.app
```

---

## 🎯 Quick Checklist

- [ ] Supabase Dashboard खोला
- [ ] Authentication → URL Configuration पर गया
- [ ] Redirect URLs में `https://unified-college-resource-hub.vercel.app/reset-password.html` add किया
- [ ] Site URL में `https://unified-college-resource-hub.vercel.app` set किया
- [ ] Save button click किया
- [ ] Password reset test किया
- [ ] Email link काम कर रहा है ✅

---

## 🆘 अगर अभी भी Problem है:

1. **Supabase Dashboard** में settings double-check करें
2. **Browser cache clear** करें (Ctrl+Shift+Delete)
3. **New password reset request** send करें
4. **Email link** को directly browser में paste करके try करें

---

## ✅ Success!

एक बार Supabase में settings configure हो जाने के बाद, password reset feature perfectly काम करेगा! 🎉

**Code में सब कुछ ready है, बस Supabase Dashboard में settings update करनी हैं!**


