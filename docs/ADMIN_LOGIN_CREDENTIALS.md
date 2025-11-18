# 🔐 Admin Login Credentials

## ✅ Admin Account Details

**Email:** `knualkumar40@gmail.com`  
**Password:** `admin@123`  
**Login Page:** `admin-login.html`

---

## 📋 Setup Steps

### Step 1: User Account Banayein (IMPORTANT!)

**Supabase Dashboard Se:**

1. **Supabase Dashboard** → **Authentication** → **Users**
2. **"Add user"** button click karo
3. **Form fill karo:**
   - **Email:** `knualkumar40@gmail.com`
   - **Password:** `admin@123`
   - **Auto Confirm User:** ✅ (check karo - **VERY IMPORTANT!**)
4. **"Create user"** click karo
5. ✅ User account ban jayega!

**Ya App Se Sign Up:**

1. Apni app kholo (`index.html`)
2. **Sign Up** section mein jao
3. **Email:** `knualkumar40@gmail.com`
4. **Password:** `admin@123`
5. **Sign Up** button click karo

### Step 2: User Ko Admin Banayein

1. **Supabase Dashboard** → **SQL Editor**
2. **New query** click karo
3. **`CREATE_ADMIN_LOGIN.sql`** file open karo
4. **Ye SQL run karo:**

```sql
-- Pehle existing entry remove karo
DELETE FROM admins 
WHERE uid IN (
    SELECT id FROM auth.users WHERE email = 'knualkumar40@gmail.com'
);

-- Phir fresh entry add karo
INSERT INTO admins (uid, full_name)
SELECT id, email
FROM auth.users
WHERE email = 'knualkumar40@gmail.com'
ON CONFLICT (uid) DO NOTHING;
```

5. **"Run"** click karo
6. ✅ Success message aana chahiye

### Step 3: Verify Setup

**SQL Editor** mein ye run karo:

```sql
SELECT 
    u.email as user_email,
    a.full_name as admin_email,
    CASE 
        WHEN a.uid IS NOT NULL THEN '✅ Admin Setup Complete'
        ELSE '❌ Not in Admins Table'
    END as status
FROM auth.users u
LEFT JOIN admins a ON u.id = a.uid
WHERE u.email = 'knualkumar40@gmail.com';
```

**Expected Result:** `✅ Admin Setup Complete`

### Step 4: Admin Login Karein

1. **`admin-login.html`** par jao
2. **Email:** `knualkumar40@gmail.com` daalo
3. **Password:** `admin@123` daalo
4. **"Login as Admin"** click karo
5. ✅ Admin dashboard access ho jayega!

---

## 🔑 Quick Reference

**Login Credentials:**
- **Email:** `knualkumar40@gmail.com`
- **Password:** `admin@123`

**Login URL:** `admin-login.html`

**Admin Dashboard:** `admin.html`

---

## 🔍 Troubleshooting

### "Invalid email or password" Error?

**Solution:**
- Pehle Step 1 complete karo (user account banayein)
- Password exactly: `admin@123` (case-sensitive)
- Email exactly: `knualkumar40@gmail.com` (no spaces)

### "Access Denied" Error?

**Solution:**
- Step 2 run karo (user ko admin table mein add karo)
- Verify karo ki user `admins` table mein hai:
```sql
SELECT * FROM admins;
```

### Still Not Working?

1. **Browser cache clear karo** (Ctrl+Shift+Delete)
2. **Browser console check karo** (F12) - koi error hai?
3. **Supabase logs check karo** - Authentication → Logs

---

## ✅ Checklist

- [ ] **Step 1:** User account banaya (`knualkumar40@gmail.com` / `admin@123`)
- [ ] **Step 2:** User ko admin table mein add kiya
- [ ] **Step 3:** Setup verify kiya
- [ ] **Step 4:** Admin login try kiya

---

## 📝 Quick SQL Script (All-in-One)

**Ye sab ek saath run karo:**

```sql
-- Remove existing entry
DELETE FROM admins 
WHERE uid IN (
    SELECT id FROM auth.users WHERE email = 'knualkumar40@gmail.com'
);

-- Add to admins table
INSERT INTO admins (uid, full_name)
SELECT id, email
FROM auth.users
WHERE email = 'knualkumar40@gmail.com'
ON CONFLICT (uid) DO NOTHING;

-- Verify
SELECT * FROM admins WHERE uid IN (
    SELECT id FROM auth.users WHERE email = 'knualkumar40@gmail.com'
);
```

---

## 🎯 Summary

**Admin Login:**
- Email: `knualkumar40@gmail.com`
- Password: `admin@123`

**Setup:**
1. User account banayein
2. Admin table mein add karein
3. Login karein

**Sab kuch ready hai! Ab admin login kar sakte hain.** 🎉

