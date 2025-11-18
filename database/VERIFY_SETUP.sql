-- VERIFY_SETUP.sql
-- Run this to check if your setup is correct
-- Copy and paste this into Supabase SQL Editor

-- ============================================
-- CHECK 1: Verify tables exist
-- ============================================
SELECT 'Tables Check' as check_type;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('notes', 'admins')
ORDER BY table_name;

-- ============================================
-- CHECK 2: Verify RLS is enabled
-- ============================================
SELECT 'RLS Check' as check_type;
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('notes', 'admins')
OR (schemaname = 'storage' AND tablename = 'objects')
ORDER BY schemaname, tablename;

-- ============================================
-- CHECK 3: Verify notes table policies
-- ============================================
SELECT 'Notes Policies' as check_type;
SELECT 
    policyname,
    cmd as operation,
    roles,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies 
WHERE tablename = 'notes'
ORDER BY cmd, policyname;

-- ============================================
-- CHECK 4: Verify storage policies
-- ============================================
SELECT 'Storage Policies' as check_type;
SELECT 
    policyname,
    cmd as operation,
    roles,
    qual as using_expression,
    with_check as with_check_expression
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage'
ORDER BY cmd, policyname;

-- ============================================
-- CHECK 5: Count policies (should see numbers)
-- ============================================
SELECT 'Policy Count' as check_type;
SELECT 
    'notes' as table_name,
    COUNT(*) as policy_count
FROM pg_policies WHERE tablename = 'notes'
UNION ALL
SELECT 
    'storage.objects' as table_name,
    COUNT(*) as policy_count
FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';

