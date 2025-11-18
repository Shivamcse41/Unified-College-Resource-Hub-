# 🔐 Admin Account Kaise Banayein

## 📋 Step-by-Step Guide

### Step 1: Supabase Mein User Account Banayein

**Option A: Supabase Dashboard Se (Recommended)**

1. **Supabase Dashboard** → **Authentication** → **Users**
2. **"Add user"** ya **"Invite user"** button click karein
3. **Email** daalein (jaise: `admin@yourdomain.com`)
4. **Password** set karein (strong password use karein)
5. **"Create user"** click karein

**Option B: App Se Sign Up Karein**

1. Apni app mein jao (`index.html`)
2. **Sign Up** karein with email aur password
3. Email verify karein (agar required ho)

### Step 2: User Ko `admins` Table Mein Add Karein

1. **Supabase Dashboard** → **SQL Editor**
2. **New query** click karein
3. **Ye SQL run karein** (apna email replace karein):

```sql
-- Apna email daalo (jo aapne account banaya hai)
INSERT INTO admins (uid, full_name)
SELECT id, email
FROM auth.users
WHERE email = 'admin@yourdomain.com'
ON CONFLICT (uid) DO NOTHING;
```

4. **Replace `'admin@yourdomain.com'`** with your actual email
5. **Click "Run"**
6. **Success message** aana chahiye

### Step 3: Verify Admin Account

```sql
-- Check karein ki aap admin table mein hain
SELECT * FROM admins;
```

Aapka email dikhna chahiye.

### Step 4: Admin Login Karein

1. **`admin-login.html`** par jao
2. **Email** daalo (jo aapne use kiya)
3. **Password** daalo (jo aapne set kiya)
4. **"Login as Admin"** click karein
5. ✅ Admin dashboard access ho jayega!

---

## 💡 Example

Agar aapka email `admin@college.com` hai aur password `Admin@123` hai:

1. **Supabase** mein user account banayein:
   - Email: `admin@college.com`
   - Password: `Admin@123`

2. **SQL Editor** mein run karein:
```sql
INSERT INTO admins (uid, full_name)
SELECT id, email
FROM auth.users
WHERE email = 'admin@college.com'
ON CONFLICT (uid) DO NOTHING;
```

3. **Admin login** karein:
   - Email: `admin@college.com`
   - Password: `Admin@123`

---

## 🔒 Password Best Practices

- ✅ **Minimum 8 characters**
- ✅ **Mix of uppercase, lowercase, numbers**
- ✅ **Special characters** (optional but recommended)
- ✅ **Don't use common passwords** like "password123"
- ✅ **Keep it secure** - don't share with others

**Good Examples:**
- `Admin@2024!`
- `CollegeAdmin#123`
- `MyAdminPass@2024`

**Bad Examples:**
- `admin`
- `password`
- `12345678`

---

## 🆘 Troubleshooting

### "User not found" Error?

**Solution:**
- Pehle user account banayein (Step 1)
- Phir `admins` table mein add karein (Step 2)

### "Access Denied" After Login?

**Solution:**
- Verify karein ki aap `admins` table mein hain:
```sql
SELECT * FROM admins;
```
- Agar nahi hain, to Step 2 dobara run karein

### Password Bhool Gaye?

**Solution:**
1. **Supabase Dashboard** → **Authentication** → **Users**
2. Apna user find karein
3. **"Reset password"** ya **"Send password reset email"** click karein
4. Email check karein aur password reset karein

---

## 📝 Quick Reference

**Admin Login Credentials:**
- Email: `[Your Email]` (jo aapne Supabase mein banaya)
- Password: `[Your Password]` (jo aapne set kiya)

**Important:**
- ✅ Apna email aur password secure rakhein
- ✅ Kisi ko share mat karein
- ✅ Strong password use karein
- ✅ Regularly password change karein

---

## ✅ Checklist

- [ ] Supabase mein user account banaya
- [ ] User ko `admins` table mein add kiya
- [ ] Admin login page par test kiya
- [ ] Admin dashboard access ho raha hai
- [ ] Pending documents dikh rahe hain

---

**Apna admin account banayein aur secure rakhein!** 🔐

