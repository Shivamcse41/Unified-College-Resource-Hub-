-- CREATE_ADMIN_LOGIN.sql
-- Complete admin login setup
-- Run this in Supabase SQL Editor

-- ============================================
-- STEP 1: Check if User Account Exists
-- ============================================
-- Pehle check karo ki user account hai ya nahi

SELECT id, email, created_at, email_confirmed_at
FROM auth.users 
WHERE email = 'knualkumar40@gmail.com';

-- ============================================
-- IMPORTANT: If User Account Doesn't Exist
-- ============================================
-- Agar kuch nahi dikha, to pehle user account banayein:
-- 
-- Supabase Dashboard → Authentication → Users
-- "Add user" click karo
-- Email: knualkumar40@gmail.com
-- Password: admin@123
-- Auto Confirm User: ✅ (check karo - VERY IMPORTANT!)
-- "Create user" click karo
--
-- YA app se sign up karo (index.html) with:
-- Email: knualkumar40@gmail.com
-- Password: admin@123

-- ============================================
-- STEP 2: Remove Existing Admin Entry (Clean Start)
-- ============================================
-- Pehle existing entry remove karo (agar hai)

DELETE FROM admins 
WHERE uid IN (
    SELECT id FROM auth.users WHERE email = 'knualkumar40@gmail.com'
);

-- ============================================
-- STEP 3: Add User to Admins Table
-- ============================================
-- Ye tab run karo jab user account ban gaya ho

INSERT INTO admins (uid, full_name)
SELECT id, email
FROM auth.users
WHERE email = 'knualkumar40@gmail.com'
ON CONFLICT (uid) DO NOTHING;

-- ============================================
-- STEP 4: Verify Admin Setup
-- ============================================
-- Check karo ki sab kuch sahi hai

SELECT 
    u.email as user_email,
    u.email_confirmed_at,
    a.full_name as admin_email,
    CASE 
        WHEN u.id IS NULL THEN '❌ User Account Not Found - Create User First!'
        WHEN a.uid IS NULL THEN '❌ Not in Admins Table - Run Step 3 Again!'
        WHEN u.email_confirmed_at IS NULL THEN '⚠️ Email Not Confirmed - Confirm in Dashboard!'
        ELSE '✅ Admin Setup Complete - Ready to Login!'
    END as status
FROM auth.users u
LEFT JOIN admins a ON u.id = a.uid
WHERE u.email = 'knualkumar40@gmail.com';

-- ============================================
-- STEP 5: List All Admins
-- ============================================
-- Saare admins dekhne ke liye

SELECT 
    a.uid,
    a.full_name as admin_email,
    u.email as user_email,
    u.email_confirmed_at
FROM admins a
JOIN auth.users u ON a.uid = u.id
ORDER BY u.created_at DESC;

-- ============================================
-- ADMIN LOGIN CREDENTIALS
-- ============================================
-- Email: knualkumar40@gmail.com
-- Password: admin@123
-- Login Page: admin-login.html
--
-- After running this script:
-- 1. Make sure user account exists (Step 1)
-- 2. Run Step 3 to add to admins table
-- 3. Verify with Step 4
-- 4. Login at admin-login.html

