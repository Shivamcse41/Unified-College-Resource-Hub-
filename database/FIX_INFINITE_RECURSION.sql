-- FIX_INFINITE_RECURSION.sql
-- Fix for "infinite recursion detected in policy for relation admins" error
-- Run this in Supabase SQL Editor

-- ============================================
-- STEP 1: Drop the Problematic Policy
-- ============================================
-- Ye policy infinite recursion create kar rahi hai

DROP POLICY IF EXISTS "Admins can view admins" ON admins;

-- ============================================
-- STEP 2: Create Fixed Policy (No Recursion)
-- ============================================
-- Option 1: Allow all authenticated users to view admins table
-- (This is safe because admins table only has uid and full_name, not sensitive data)

CREATE POLICY "Authenticated users can view admins"
ON admins
FOR SELECT
TO authenticated
USING (true);

-- ============================================
-- Alternative: If you want to restrict admins table access
-- ============================================
-- Uncomment this if you want only admins to view admins table
-- (But this requires a security definer function to avoid recursion)

-- CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
-- RETURNS BOOLEAN
-- LANGUAGE sql
-- SECURITY DEFINER
-- STABLE
-- AS $$
--   SELECT EXISTS (
--     SELECT 1 FROM admins WHERE uid = user_id
--   );
-- $$;

-- CREATE POLICY "Admins can view admins"
-- ON admins
-- FOR SELECT
-- TO authenticated
-- USING (is_admin(auth.uid()));

-- ============================================
-- STEP 3: Verify Policy is Created
-- ============================================
-- Check karo ki policy create ho gayi

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
-- STEP 4: Test Query
-- ============================================
-- Ye query run karo to test (should work without recursion error)

-- SELECT * FROM admins;

