-- FIX_ADMIN_ACCESS.sql
-- COMPLETE FIX: Add yourself as admin and verify setup
-- Run this in Supabase SQL Editor

-- ============================================
-- STEP 1: See All Users (Find Your Email)
-- ============================================
-- Run this first to see all users and find your email:
SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC;

-- ============================================
-- STEP 2: Add Yourself as Admin
-- ============================================
-- Replace 'YOUR_EMAIL_HERE' with your actual email from Step 1
-- Then run this:

INSERT INTO admins (uid, full_name)
SELECT id, email
FROM auth.users
WHERE email = 'YOUR_EMAIL_HERE'
ON CONFLICT (uid) DO NOTHING;

-- ============================================
-- STEP 3: Verify You're Added as Admin
-- ============================================
-- Run this to check:
SELECT * FROM admins;

-- You should see your user listed here!

-- ============================================
-- STEP 4: Check Pending Documents (Optional)
-- ============================================
-- Run this to see if there are any pending documents:
SELECT id, title, subject, uploader_name, uploaded_at, status 
FROM notes 
WHERE status = 'pending'
ORDER BY uploaded_at DESC;


