# 🔐 Admin Account Credentials

## ✅ Admin Login Details

**Email:** `knualkumar40@gmail.com`  
**Password:** `admin@123`

**Login Page:** `admin-login.html`

---

## 📋 Setup Steps

### Step 1: User Account Banayein

**Supabase Dashboard Se:**

1. **Supabase Dashboard** → **Authentication** → **Users**
2. **"Add user"** button click karo
3. **Email:** `knualkumar40@gmail.com`
4. **Password:** `admin@123`
5. **Auto Confirm User:** ✅ (check karo)
6. **"Create user"** click karo

### Step 2: User Ko Admin Banayein

1. **Supabase Dashboard** → **SQL Editor**
2. **New query** click karo
3. **Ye SQL run karo:**

```sql
INSERT INTO admins (uid, full_name)
SELECT id, email
FROM auth.users
WHERE email = 'knualkumar40@gmail.com'
ON CONFLICT (uid) DO NOTHING;
```

4. **"Run"** click karo
5. ✅ Success message aana chahiye

### Step 3: Admin Login Karein

1. **`admin-login.html`** par jao
2. **Email:** `knualkumar40@gmail.com`
3. **Password:** `admin@123`
4. **"Login as Admin"** click karo
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

---

## ✅ Checklist

- [ ] User account banaya (`knualkumar40@gmail.com` / `admin@123`)
- [ ] User ko `admins` table mein add kiya
- [ ] Admin login test kiya
- [ ] Admin dashboard access ho raha hai
- [ ] Pending documents dikh rahe hain

---

## 📝 Quick Reference

**Login Credentials:**
- **Email:** `knualkumar40@gmail.com`
- **Password:** `admin@123`

**Login Page:** `admin-login.html`

**Admin Dashboard:** `admin.html`

---

**Setup complete! Ab aap admin login kar sakte hain.** 🎉

