-- ADD_ADMIN_USER.sql
-- Script to add yourself as an admin
-- Follow the steps below to find your user UUID, then run this script

-- ============================================
-- STEP 1: Find Your User UUID
-- ============================================
-- Option A: Find by email (replace with your email)
-- SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Option B: List all users
-- SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC;

-- ============================================
-- STEP 2: Add Yourself as Admin
-- ============================================
-- Replace 'YOUR_USER_UUID_HERE' with the UUID from Step 1
-- Replace 'Your Name' with your name (optional)

-- Example (uncomment and modify):
-- INSERT INTO admins (uid, full_name)
-- VALUES ('YOUR_USER_UUID_HERE', 'Your Name');

-- ============================================
-- STEP 3: List All Users (to find your email/UUID)
-- ============================================
-- Run this first to see all users and find yours:
SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC;

-- ============================================
-- STEP 4: Add Yourself as Admin (QUICK METHOD)
-- ============================================
-- Replace 'your-email@example.com' with YOUR email from Step 3
-- Then run this:

INSERT INTO admins (uid, full_name)
SELECT id, email
FROM auth.users
WHERE email = 'your-email@example.com'
ON CONFLICT (uid) DO NOTHING;

-- ============================================
-- Verify You're Added
-- ============================================
-- Run this to check if you're in the admins table:
-- SELECT * FROM admins;

