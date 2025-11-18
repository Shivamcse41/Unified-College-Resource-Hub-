-- FIX_ACCESS_DENIED_ERROR.sql
-- Complete fix for "Access Denied" error
-- Run this step by step in Supabase SQL Editor

-- ============================================
-- STEP 1: Check if User Account Exists
-- ============================================
-- Ye pehle run karo to check ki user account hai ya nahi

SELECT id, email, created_at, email_confirmed_at
FROM auth.users 
WHERE email = 'csegpa18@gmail.com';

-- ============================================
-- AGAR USER ACCOUNT NAHI HAI (No results)
-- ============================================
-- To pehle user account banayein:
-- 
-- Method 1: Supabase Dashboard
-- 1. Authentication → Users
-- 2. "Add user" click karo
-- 3. Email: csegpa18@gmail.com
-- 4. Password: admin@123
-- 5. Auto Confirm User: ✅ (check karo)
-- 6. "Create user" click karo
--
-- Method 2: App Se
-- 1. index.html par jao
-- 2. Sign Up karo with: csegpa18@gmail.com / admin@123

-- ============================================
-- STEP 2: Check if User is in Admins Table
-- ============================================
-- Ye run karo to check ki user admin table mein hai ya nahi

SELECT * FROM admins WHERE uid IN (
    SELECT id FROM auth.users WHERE email = 'csegpa18@gmail.com'
);

-- ============================================
-- STEP 3: Add User to Admins Table
-- ============================================
-- Ye run karo to user ko admin banane ke liye
-- (Pehle Step 1 se verify karo ki user account hai)

INSERT INTO admins (uid, full_name)
SELECT id, email
FROM auth.users
WHERE email = 'csegpa18@gmail.com'
ON CONFLICT (uid) DO NOTHING;

-- ============================================
-- STEP 4: Verify Complete Setup
-- ============================================
-- Ye run karo to verify ki sab kuch sahi hai

SELECT 
    u.id as user_id,
    u.email as user_email,
    u.email_confirmed_at,
    a.uid as admin_uid,
    a.full_name as admin_name,
    CASE 
        WHEN a.uid IS NOT NULL THEN '✅ Admin Setup Complete'
        ELSE '❌ Not in Admins Table'
    END as status
FROM auth.users u
LEFT JOIN admins a ON u.id = a.uid
WHERE u.email = 'csegpa18@gmail.com';

-- ============================================
-- STEP 5: If Still Not Working - Reset Password
-- ============================================
-- Supabase Dashboard → Authentication → Users
-- csegpa18@gmail.com find karo
-- "Reset password" click karo
-- Password set karo: admin@123

-- ============================================
-- STEP 6: Check All Admins
-- ============================================
-- Saare admins dekhne ke liye

SELECT * FROM admins;

