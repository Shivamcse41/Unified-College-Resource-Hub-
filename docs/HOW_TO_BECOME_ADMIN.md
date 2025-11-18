# 🔐 How to Access Admin Dashboard

You're seeing "Access Denied" because your user account is not in the `admins` table. Follow these steps to add yourself as an admin:

---

## 🚀 Quick Method (Recommended)

### Step 1: Find Your Email

1. **Go to your app** and check what email you used to sign up
2. **Or go to Supabase Dashboard** → **Authentication** → **Users**
3. **Find your user** and note the email address

### Step 2: Add Yourself as Admin

1. **Go to Supabase Dashboard** → **SQL Editor**
2. **Click "New query"**
3. **Copy and paste this SQL** (replace the email with YOUR email):

```sql
INSERT INTO admins (uid, full_name)
SELECT id, email
FROM auth.users
WHERE email = 'your-email@example.com'
ON CONFLICT (uid) DO NOTHING;
```

4. **Replace `'your-email@example.com'`** with your actual email address
5. **Click "Run"**
6. **Should see "Success. 1 row inserted"** ✅

### Step 3: Refresh Admin Page

1. **Go back to your app**
2. **Refresh the admin page** (or click "Admin Panel" again)
3. **You should now have access!** 🎉

---

## 📋 Alternative Method (Using UUID)

If the quick method doesn't work, use this:

### Step 1: Find Your User UUID

1. **Go to Supabase Dashboard** → **SQL Editor**
2. **Run this query** (replace with your email):

```sql
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';
```

3. **Copy the UUID** (the `id` value - looks like: `123e4567-e89b-12d3-a456-426614174000`)

### Step 2: Add Yourself as Admin

1. **In SQL Editor**, run this (replace with your UUID):

```sql
INSERT INTO admins (uid, full_name)
VALUES ('YOUR_UUID_HERE', 'Your Name')
ON CONFLICT (uid) DO NOTHING;
```

2. **Replace `'YOUR_UUID_HERE'`** with the UUID you copied
3. **Replace `'Your Name'`** with your name (or keep it as is)
4. **Click "Run"**

### Step 3: Verify

Run this to check:

```sql
SELECT * FROM admins;
```

You should see your user listed.

---

## 🔍 Troubleshooting

### "relation admins does not exist"
- You need to run the database setup script first
- Go to **SQL Editor** and run `database_setup_fixed.sql` or `FIXED_ULTIMATE_FIX_RLS.sql`

### "duplicate key value violates unique constraint"
- You're already an admin!
- Just refresh the admin page

### "0 rows inserted"
- Check that your email is correct
- Make sure you're using the exact email you used to sign up
- Try the UUID method instead

### Still can't access?
1. **Make sure you're logged in** to your app
2. **Clear browser cache** and refresh
3. **Check browser console** (F12) for errors
4. **Verify you're in the admins table**:
   ```sql
   SELECT * FROM admins;
   ```

---

## ✅ Verification

After adding yourself as admin:

1. **Refresh the admin page** in your app
2. **You should see:**
   - "Pending PDFs" heading
   - List of pending notes (if any)
   - No "Access Denied" message

3. **If you see the admin dashboard**, you're all set! ✅

---

## 📝 Quick Reference

**File to use:** `ADD_ADMIN_USER.sql` (has the SQL ready to use)

**What it does:** Adds your user to the `admins` table so you can access the admin dashboard

**Time needed:** 2 minutes

---

## 🎯 What Happens Next

Once you're added as admin:

- ✅ You can access `admin.html`
- ✅ You can see all pending PDF uploads
- ✅ You can approve or reject notes
- ✅ You can preview PDFs before approving

---

## 💡 Pro Tip

You can add multiple admins! Just run the INSERT statement for each user's email or UUID.

