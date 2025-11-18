# 🔧 Fix: Infinite Recursion Error in Admins Table

## 🚨 Problem
"infinite recursion detected in policy for relation 'admins'" error aa raha hai.

## ✅ Solution

### Root Cause
`admins` table ki policy apne aap ko check kar rahi thi:
```sql
CREATE POLICY "Admins can view admins"
ON admins
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM admins  -- ← Yahan recursion ho raha hai!
        WHERE admins.uid = auth.uid()
    )
);
```

Jab policy `admins` table ko query karti hai, to wo policy trigger hoti hai, phir wo phir `admins` table query karti hai = **Infinite Loop!**

---

## 📋 Fix Steps

### Step 1: Run the Fix Script

1. **Supabase Dashboard** → **SQL Editor**
2. **New query** click karo
3. **`FIX_INFINITE_RECURSION.sql`** file open karo
4. **Copy-paste** karo aur **"Run"** click karo
5. ✅ Error fix ho jayega!

### Step 2: Verify Fix

**SQL Editor** mein ye run karo:

```sql
SELECT * FROM admins;
```

**Agar koi error nahi aaye** = ✅ Fix successful!

---

## 🔍 What the Fix Does

### Before (Problematic):
```sql
-- Policy checks admins table → triggers policy → checks admins table again → LOOP!
CREATE POLICY "Admins can view admins"
ON admins
USING (EXISTS (SELECT 1 FROM admins WHERE ...));
```

### After (Fixed):
```sql
-- Simple policy - no recursion
CREATE POLICY "Authenticated users can view admins"
ON admins
FOR SELECT
TO authenticated
USING (true);
```

**Why this is safe:**
- `admins` table mein sirf `uid` aur `full_name` hai
- Koi sensitive data nahi hai
- Sabhi authenticated users dekh sakte hain (no security issue)

---

## 🎯 Alternative Solution (If You Want Restricted Access)

Agar aap chahte ho ki sirf admins hi `admins` table dekh saken, to **security definer function** use karo:

```sql
-- Create function that bypasses RLS
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admins WHERE uid = user_id
  );
$$;

-- Use function in policy (no recursion)
CREATE POLICY "Admins can view admins"
ON admins
FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));
```

**Note:** `SECURITY DEFINER` function RLS bypass karta hai, isliye recursion nahi hota.

---

## ✅ Quick Fix (Recommended)

**Ye sab ek saath run karo:**

```sql
-- Drop problematic policy
DROP POLICY IF EXISTS "Admins can view admins" ON admins;

-- Create simple policy (no recursion)
CREATE POLICY "Authenticated users can view admins"
ON admins
FOR SELECT
TO authenticated
USING (true);
```

---

## 🔍 Verify Fix

**Test karo:**

1. **My Uploads** tab par jao
2. **Uploads load hone chahiye** (no error)
3. **Profile** tab par jao
4. **Profile load hona chahiye** (no error)

---

## 📝 Why This Happens

**Recursion Flow:**
```
User queries notes table
    ↓
Notes policy checks: "Is user admin?"
    ↓
Queries admins table
    ↓
Admins policy checks: "Is user admin?"
    ↓
Queries admins table again
    ↓
Admins policy checks again...
    ↓
INFINITE LOOP! ❌
```

**Fixed Flow:**
```
User queries notes table
    ↓
Notes policy checks: "Is user admin?"
    ↓
Queries admins table
    ↓
Admins policy: "All authenticated users can view"
    ↓
Returns result ✅
```

---

## ✅ Summary

- ✅ Problematic policy removed
- ✅ Simple policy created (no recursion)
- ✅ All authenticated users can view admins table
- ✅ No security issue (admins table has no sensitive data)
- ✅ My Uploads section ab kaam karega

**Run the fix script and the error will be resolved!** 🎯

