-- QUICK_ADMIN_ACCESS.sql
-- Complete setup for admin access
-- Run this in Supabase SQL Editor

-- ============================================
-- STEP 1: Check if User Account Exists
-- ============================================
-- Pehle ye run karo to check ki user account hai ya nahi

SELECT id, email, created_at, email_confirmed_at
FROM auth.users 
WHERE email = 'knualkumar40@gmail.com';

-- ============================================
-- IMPORTANT: Agar User Account Nahi Hai
-- ============================================
-- Pehle user account banayein:
-- 
-- Supabase Dashboard → Authentication → Users
-- "Add user" click karo
-- Email: csegpa18@gmail.com
-- Password: admin@123
-- Auto Confirm User: ✅ (check karo)
-- "Create user" click karo

-- ============================================
-- STEP 2: Add User to Admins Table
-- ============================================
-- Ye tab run karo jab user account ban gaya ho

INSERT INTO admins (uid, full_name)
SELECT id, email
FROM auth.users
WHERE email = 'knualkumar40@gmail.com'
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
WHERE u.email = 'knualkumar40@gmail.com';

-- ============================================
-- STEP 4: Check All Admins
-- ============================================
-- Saare admins dekhne ke liye

SELECT * FROM admins;

-- ============================================
-- Admin Login Credentials
-- ============================================
-- Email: csegpa18@gmail.com
-- Password: admin@123
-- Login Page: admin-login.html


