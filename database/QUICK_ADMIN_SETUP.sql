-- QUICK_ADMIN_SETUP.sql
-- Admin account banane ke liye ye steps follow karein

-- ============================================
-- STEP 1: Pehle User Account Banayein
-- ============================================
-- Supabase Dashboard → Authentication → Users
-- "Add user" click karein
-- Email aur password set karein
-- User account create karein

-- ============================================
-- STEP 2: User Ko Admin Banayein
-- ============================================
-- Apna email replace karein (jo aapne account banaya hai)
-- Example: 'admin@college.com' ko apne email se replace karein

INSERT INTO admins (uid, full_name)
SELECT id, email
FROM auth.users
WHERE email = 'YOUR_EMAIL_HERE'
ON CONFLICT (uid) DO NOTHING;

-- ============================================
-- STEP 3: Verify Karein
-- ============================================
-- Run karein to check ki aap admin table mein hain

SELECT * FROM admins;

-- ============================================
-- STEP 4: All Users Dekhne Ke Liye
-- ============================================
-- Agar aapko saare users dekhne hain:

SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC;


