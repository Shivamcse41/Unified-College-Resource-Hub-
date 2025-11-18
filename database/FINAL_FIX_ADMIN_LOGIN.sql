-- FINAL_FIX_ADMIN_LOGIN.sql
-- Complete diagnostic and fix for admin login issue
-- Run this step by step in Supabase SQL Editor

-- ============================================
-- STEP 1: Complete Diagnostic Check
-- ============================================
-- Ye pehle run karo to sab kuch check karo

SELECT 
    'User Account Check' as check_type,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ User Account Exists'
        ELSE '❌ User Account NOT Found'
    END as status,
    COUNT(*) as count
FROM auth.users 
WHERE email = 'knualkumar40@gmail.com'

UNION ALL

SELECT 
    'Admin Table Check' as check_type,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ In Admins Table'
        ELSE '❌ NOT in Admins Table'
    END as status,
    COUNT(*) as count
FROM admins a
JOIN auth.users u ON a.uid = u.id
WHERE u.email = 'knualkumar40@gmail.com'

UNION ALL

SELECT 
    'Email Confirmed Check' as check_type,
    CASE 
        WHEN email_confirmed_at IS NOT NULL THEN '✅ Email Confirmed'
        ELSE '❌ Email NOT Confirmed'
    END as status,
    CASE 
        WHEN email_confirmed_at IS NOT NULL THEN 1
        ELSE 0
    END as count
FROM auth.users 
WHERE email = 'knualkumar40@gmail.com';

-- ============================================
-- STEP 2: Detailed User Information
-- ============================================
-- User ki complete information dekhne ke liye

SELECT 
    u.id as user_id,
    u.email as user_email,
    u.created_at as user_created,
    u.email_confirmed_at,
    u.last_sign_in_at,
    a.uid as admin_uid,
    a.full_name as admin_name,
    CASE 
        WHEN u.id IS NULL THEN '❌ User Account Not Found'
        WHEN a.uid IS NULL THEN '❌ Not in Admins Table'
        WHEN u.email_confirmed_at IS NULL THEN '⚠️ Email Not Confirmed'
        ELSE '✅ Everything OK'
    END as overall_status
FROM auth.users u
LEFT JOIN admins a ON u.id = a.uid
WHERE u.email = 'knualkumar40@gmail.com';

-- ============================================
-- STEP 3: Remove ALL Existing Entries (Clean Start)
-- ============================================
-- Pehle sab kuch clean karo

DELETE FROM admins 
WHERE uid IN (
    SELECT id FROM auth.users WHERE email = 'knualkumar40@gmail.com'
);

-- ============================================
-- STEP 4: Verify User Account Exists
-- ============================================
-- Check karo ki user account hai ya nahi

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
-- STEP 5: Add User to Admins Table (Fresh Entry)
-- ============================================
-- Ye tab run karo jab user account ban gaya ho

INSERT INTO admins (uid, full_name)
SELECT id, email
FROM auth.users
WHERE email = 'knualkumar40@gmail.com'
ON CONFLICT (uid) DO NOTHING;

-- ============================================
-- STEP 6: Final Verification
-- ============================================
-- Check karo ki sab kuch sahi hai

SELECT 
    u.email as user_email,
    u.email_confirmed_at,
    a.full_name as admin_email,
    CASE 
        WHEN u.id IS NULL THEN '❌ User Account Not Found - Create User First!'
        WHEN a.uid IS NULL THEN '❌ Not in Admins Table - Run Step 5 Again!'
        WHEN u.email_confirmed_at IS NULL THEN '⚠️ Email Not Confirmed - Confirm in Dashboard!'
        ELSE '✅ Admin Setup Complete - Try Login Now!'
    END as final_status
FROM auth.users u
LEFT JOIN admins a ON u.id = a.uid
WHERE u.email = 'knualkumar40@gmail.com';

-- ============================================
-- STEP 7: List All Admins (Verify)
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
-- STEP 8: Check RLS Policies (If Still Not Working)
-- ============================================
-- Check karo ki RLS policies sahi hain

SELECT 
    schemaname,
    tablename,
    policyname,
    cmd as operation,
    roles
FROM pg_policies 
WHERE tablename = 'admins'
ORDER BY policyname;

-- ============================================
-- Admin Login Credentials
-- ============================================
-- Email: knualkumar40@gmail.com
-- Password: admin@123
-- Login Page: admin-login.html

