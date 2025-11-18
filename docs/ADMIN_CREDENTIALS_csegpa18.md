# 🔐 Admin Account Credentials

## ✅ Admin Login Details

**Email:** `csegpa18@gmail.com`  
**Password:** `admin@123`

---

## 📋 Setup Steps

### Step 1: User Account Banayein

**Option A: Supabase Dashboard Se (Recommended)**

1. **Supabase Dashboard** → **Authentication** → **Users**
2. **"Add user"** button click karein
3. **Email:** `csegpa18@gmail.com`
4. **Password:** `admin@123`
5. **"Create user"** click karein

**Option B: App Se Sign Up**

1. Apni app mein jao (`index.html`)
2. **Sign Up** karein:
   - Email: `csegpa18@gmail.com`
   - Password: `admin@123`
3. Email verify karein (agar required ho)

### Step 2: User Ko Admin Banayein

1. **Supabase Dashboard** → **SQL Editor**
2. **New query** click karein
3. **`SETUP_ADMIN_csegpa18.sql`** file open karein
4. **Ye SQL run karein:**

```sql
INSERT INTO admins (uid, full_name)
SELECT id, email
FROM auth.users
WHERE email = 'csegpa18@gmail.com'
ON CONFLICT (uid) DO NOTHING;
```

5. **Click "Run"**
6. **Success message** aana chahiye ✅

### Step 3: Verify Setup

```sql
-- Check karein ki user admin table mein hai
SELECT * FROM admins WHERE uid IN (
    SELECT id FROM auth.users WHERE email = 'csegpa18@gmail.com'
);
```

Aapko `csegpa18@gmail.com` dikhna chahiye.

### Step 4: Admin Login Karein

1. **`admin-login.html`** par jao
2. **Email:** `csegpa18@gmail.com`
3. **Password:** `admin@123`
4. **"Login as Admin"** click karein
5. ✅ Admin dashboard access ho jayega!

---

## 🔒 Security Note

- ✅ Password: `admin@123` (temporary - change karein later)
- ✅ Strong password use karein production mein
- ✅ Apna password secure rakhein
- ✅ Kisi ko share mat karein

---

## 🆘 Troubleshooting

### "User not found" Error?

**Solution:**
- Pehle Step 1 complete karein (user account banayein)
- Phir Step 2 run karein (admin table mein add karein)

### "Access Denied" After Login?

**Solution:**
- Verify karein ki user `admins` table mein hai:
```sql
SELECT * FROM admins;
```
- Agar nahi hai, to Step 2 dobara run karein

### Password Change Karna Hai?

**Solution:**
1. **Supabase Dashboard** → **Authentication** → **Users**
2. `csegpa18@gmail.com` find karein
3. **"Reset password"** click karein
4. Ya **"Send password reset email"** use karein

---

## ✅ Checklist

- [ ] User account banaya (`csegpa18@gmail.com` / `admin@123`)
- [ ] User ko `admins` table mein add kiya
- [ ] Admin login test kiya
- [ ] Admin dashboard access ho raha hai
- [ ] Pending documents dikh rahe hain

---

## 📝 Quick Reference

**Login Credentials:**
- **Email:** `csegpa18@gmail.com`
- **Password:** `admin@123`

**Login Page:** `admin-login.html`

**Admin Dashboard:** `admin.html`

---

**Setup complete! Ab aap admin login kar sakte hain.** 🎉

