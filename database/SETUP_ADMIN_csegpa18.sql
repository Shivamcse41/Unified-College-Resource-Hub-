-- SETUP_ADMIN_csegpa18.sql
-- Admin account setup for csegpa18@gmail.com
-- Run this in Supabase SQL Editor

-- ============================================
-- STEP 1: Pehle User Account Banayein (Important!)
-- ============================================
-- Supabase Dashboard → Authentication → Users
-- "Add user" click karein
-- Email: csegpa18@gmail.com
-- Password: admin@123
-- "Create user" click karein
-- 
-- YA app se sign up karein (index.html) with:
-- Email: csegpa18@gmail.com
-- Password: admin@123

-- ============================================
-- STEP 2: User Ko Admin Banayein
-- ============================================
-- Ye SQL run karein (user account banane ke baad):

INSERT INTO admins (uid, full_name)
SELECT id, email
FROM auth.users
WHERE email = 'csegpa18@gmail.com'
ON CONFLICT (uid) DO NOTHING;

-- ============================================
-- STEP 3: Verify Karein
-- ============================================
-- Check karein ki user admin table mein add ho gaya:

SELECT * FROM admins WHERE uid IN (
    SELECT id FROM auth.users WHERE email = 'csegpa18@gmail.com'
);

-- ============================================
-- STEP 4: Check User Exists
-- ============================================
-- Agar user nahi mila, to pehle user account banayein:

SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'csegpa18@gmail.com';

-- Agar kuch nahi dikha, to pehle user account banayein (Step 1)


