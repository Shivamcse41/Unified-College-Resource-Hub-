-- QUICK_ADMIN_FIX.sql
-- COPY AND PASTE THIS - Replace YOUR_EMAIL with your actual email
-- Run in Supabase SQL Editor

-- Step 1: See all users (find your email)
SELECT id, email FROM auth.users ORDER BY created_at DESC;

-- Step 2: Add yourself as admin (REPLACE 'your-email@example.com' with YOUR email)
INSERT INTO admins (uid, full_name)
SELECT id, email
FROM auth.users
WHERE email = 'your-email@example.com'
ON CONFLICT (uid) DO NOTHING;

-- Step 3: Verify you're added
SELECT * FROM admins;

-- Step 4: Check pending documents
SELECT id, title, subject, status FROM notes WHERE status = 'pending';


