-- SETUP_NEW_ADMIN_knualkumar40.sql
-- Fresh admin setup for knualkumar40@gmail.com
-- Remove old admin and add new admin

-- ============================================
-- STEP 1: Remove Old Admin (csegpa18@gmail.com)
-- ============================================
-- Old admin ko remove karo

DELETE FROM admins 
WHERE uid IN (
    SELECT id FROM auth.users WHERE email = 'csegpa18@gmail.com'
);

-- ============================================
-- STEP 2: Check if New User Account Exists
-- ============================================
-- Pehle check karo ki user account hai ya nahi

SELECT id, email, created_at, email_confirmed_at
FROM auth.users 
WHERE email = 'knualkumar40@gmail.com';

-- ============================================
-- STEP 3: If User Account Nahi Hai - Create It
-- ============================================
-- IMPORTANT: Agar user account nahi hai, to pehle banayein:
-- 
-- Supabase Dashboard → Authentication → Users
-- "Add user" click karo
-- Email: knualkumar40@gmail.com
-- Password: admin@123
-- Auto Confirm User: ✅ (check karo)
-- "Create user" click karo
--
-- YA app se sign up karo (index.html) with:
-- Email: knualkumar40@gmail.com
-- Password: admin@123

-- ============================================
-- STEP 4: Add New User to Admins Table
-- ============================================
-- Ye tab run karo jab user account ban gaya ho

INSERT INTO admins (uid, full_name)
SELECT id, email
FROM auth.users
WHERE email = 'knualkumar40@gmail.com'
ON CONFLICT (uid) DO NOTHING;

-- ============================================
-- STEP 5: Verify New Admin Setup
-- ============================================
-- Check karo ki sab kuch sahi hai

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
WHERE u.email = 'knualkumar40@gmail.com';

-- ============================================
-- STEP 6: Verify Old Admin Removed
-- ============================================
-- Check karo ki old admin remove ho gaya

SELECT 
    u.email,
    CASE 
        WHEN a.uid IS NOT NULL THEN '❌ Still Admin'
        ELSE '✅ Removed'
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
    u.email as user_email
FROM admins a
JOIN auth.users u ON a.uid = u.id;

-- ============================================
-- Admin Login Credentials
-- ============================================
-- Email: knualkumar40@gmail.com
-- Password: admin@123
-- Login Page: admin-login.html

