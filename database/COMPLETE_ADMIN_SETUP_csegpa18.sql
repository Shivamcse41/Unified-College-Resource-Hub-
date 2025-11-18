-- COMPLETE_ADMIN_SETUP_csegpa18.sql
-- Complete setup script for admin account
-- IMPORTANT: Pehle user account banayein Supabase Dashboard se!

-- ============================================
-- STEP 1: Check if User Account Exists
-- ============================================
-- Ye run karo to check ki user account hai ya nahi

SELECT id, email, created_at, email_confirmed_at
FROM auth.users 
WHERE email = 'csegpa18@gmail.com';

-- ============================================
-- IMPORTANT: Agar User Account Nahi Hai
-- ============================================
-- Pehle user account banayein:
-- 
-- Method 1: Supabase Dashboard
-- 1. Authentication → Users
-- 2. "Add user" click karo
-- 3. Email: csegpa18@gmail.com
-- 4. Password: admin@123
-- 5. Auto Confirm User: ✅ (check karo)
-- 6. "Create user" click karo
--
-- Method 2: App Se Sign Up
-- 1. index.html par jao
-- 2. Sign Up karo with:
--    Email: csegpa18@gmail.com
--    Password: admin@123

-- ============================================
-- STEP 2: Add User to Admins Table
-- ============================================
-- Ye tab run karo jab user account ban gaya ho

INSERT INTO admins (uid, full_name)
SELECT id, email
FROM auth.users
WHERE email = 'csegpa18@gmail.com'
ON CONFLICT (uid) DO NOTHING;

-- ============================================
-- STEP 3: Verify Admin Setup
-- ============================================
-- Check karo ki user admin table mein add ho gaya

SELECT 
    a.uid,
    a.full_name as admin_email,
    u.email as user_email,
    u.email_confirmed_at
FROM admins a
JOIN auth.users u ON a.uid = u.id
WHERE u.email = 'csegpa18@gmail.com';

-- ============================================
-- STEP 4: Check All Admins
-- ============================================
-- Saare admins dekhne ke liye

SELECT * FROM admins;

-- ============================================
-- STEP 5: If Password Reset Needed
-- ============================================
-- Supabase Dashboard → Authentication → Users
-- User find karo → "Reset password" click karo
-- Naya password set karo: admin@123


