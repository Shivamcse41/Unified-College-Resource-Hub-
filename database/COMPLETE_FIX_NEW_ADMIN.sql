-- COMPLETE_FIX_NEW_ADMIN.sql
-- Complete fix for new admin access
-- Run this step by step in Supabase SQL Editor

-- ============================================
-- STEP 1: Remove ALL Old Admins (Clean Start)
-- ============================================
-- Sabhi old admins ko remove karo

DELETE FROM admins 
WHERE uid IN (
    SELECT id FROM auth.users WHERE email = 'csegpa18@gmail.com'
);

-- ============================================
-- STEP 2: Check if New User Account Exists
-- ============================================
-- Pehle verify karo ki user account hai ya nahi

SELECT 
    id, 
    email, 
    created_at, 
    email_confirmed_at,
    CASE 
        WHEN email_confirmed_at IS NOT NULL THEN '✅ Email Confirmed'
        ELSE '❌ Email Not Confirmed'
    END as email_status
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

-- ============================================
-- STEP 3: Delete Existing Admin Entry (If Any)
-- ============================================
-- Agar pehle se admin table mein entry hai, to remove karo

DELETE FROM admins 
WHERE uid IN (
    SELECT id FROM auth.users WHERE email = 'knualkumar40@gmail.com'
);

-- ============================================
-- STEP 4: Add New User to Admins Table (Fresh)
-- ============================================
-- Ye tab run karo jab user account ban gaya ho

INSERT INTO admins (uid, full_name)
SELECT id, email
FROM auth.users
WHERE email = 'knualkumar40@gmail.com'
ON CONFLICT (uid) DO NOTHING;

-- ============================================
-- STEP 5: Complete Verification
-- ============================================
-- Check karo ki sab kuch sahi hai

SELECT 
    u.id as user_id,
    u.email as user_email,
    u.email_confirmed_at,
    u.created_at as user_created,
    a.uid as admin_uid,
    a.full_name as admin_name,
    CASE 
        WHEN u.id IS NULL THEN '❌ User Account Not Found'
        WHEN a.uid IS NULL THEN '❌ Not in Admins Table'
        WHEN u.email_confirmed_at IS NULL THEN '⚠️ Email Not Confirmed'
        ELSE '✅ Admin Setup Complete'
    END as status
FROM auth.users u
LEFT JOIN admins a ON u.id = a.uid
WHERE u.email = 'knualkumar40@gmail.com';

-- ============================================
-- STEP 6: Verify Old Admin Removed
-- ============================================
-- Check karo ki old admin remove ho gaya

SELECT 
    u.email,
    CASE 
        WHEN a.uid IS NOT NULL THEN '❌ Still Admin (Remove Again)'
        ELSE '✅ Removed Successfully'
    END as status
FROM auth.users u
LEFT JOIN admins a ON u.id = a.uid
WHERE u.email = 'csegpa18@gmail.com';

-- ============================================
-- STEP 7: List All Current Admins
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
-- STEP 8: If Email Not Confirmed - Fix It
-- ============================================
-- Agar email confirmed nahi hai, to manually confirm karo:
-- 
-- Supabase Dashboard → Authentication → Users
-- knualkumar40@gmail.com find karo
-- "Auto Confirm User" enable karo
-- Ya "Confirm email" click karo

-- ============================================
-- Admin Login Credentials
-- ============================================
-- Email: knualkumar40@gmail.com
-- Password: admin@123
-- Login Page: admin-login.html

