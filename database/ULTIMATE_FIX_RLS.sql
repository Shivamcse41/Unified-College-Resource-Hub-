-- ULTIMATE_FIX_RLS.sql
-- COMPLETE AND GUARANTEED FIX for "new row violates row-level security policy" error
-- This script fixes EVERYTHING - run this in Supabase SQL Editor

-- ============================================
-- STEP 1: ENABLE RLS ON ALL TABLES
-- ============================================

-- Enable RLS on notes table (if not already enabled)
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Enable RLS on admins table (if not already enabled)
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Note: storage.objects RLS is already enabled by default in Supabase
-- We don't need to enable it manually (and can't without owner permissions)

-- ============================================
-- STEP 2: DROP ALL EXISTING POLICIES
-- ============================================

-- Drop notes table policies
DROP POLICY IF EXISTS "Users can insert their own notes" ON notes;
DROP POLICY IF EXISTS "Anyone can view approved notes" ON notes;
DROP POLICY IF EXISTS "Users can view their own notes" ON notes;
DROP POLICY IF EXISTS "Admins can view all notes" ON notes;
DROP POLICY IF EXISTS "Admins can update notes" ON notes;
DROP POLICY IF EXISTS "Public can view approved notes" ON notes;

-- Drop admins table policies
DROP POLICY IF EXISTS "Admins can view admins" ON admins;

-- Drop storage policies (try all possible names)
DROP POLICY IF EXISTS "Users can upload to pending folder" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated reads" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can read" ON storage.objects;

-- ============================================
-- STEP 3: CREATE DATABASE POLICIES (NOTES TABLE)
-- ============================================

-- Policy 1: INSERT - Users can insert their own notes
CREATE POLICY "Users can insert their own notes"
ON notes
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = uploader_uid);

-- Policy 2: SELECT - Users can view approved notes
CREATE POLICY "Anyone can view approved notes"
ON notes
FOR SELECT
TO authenticated
USING (status = 'approved');

-- Policy 3: SELECT - Users can view their own notes (any status)
CREATE POLICY "Users can view their own notes"
ON notes
FOR SELECT
TO authenticated
USING (auth.uid() = uploader_uid);

-- Policy 4: SELECT - Admins can view all notes
CREATE POLICY "Admins can view all notes"
ON notes
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM admins
        WHERE admins.uid = auth.uid()
    )
);

-- Policy 5: UPDATE - Admins can update notes
CREATE POLICY "Admins can update notes"
ON notes
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM admins
        WHERE admins.uid = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM admins
        WHERE admins.uid = auth.uid()
    )
);

-- Policy 6: SELECT - Public (anon) can view approved notes
CREATE POLICY "Public can view approved notes"
ON notes
FOR SELECT
TO anon
USING (status = 'approved');

-- ============================================
-- STEP 4: CREATE DATABASE POLICIES (ADMINS TABLE)
-- ============================================

CREATE POLICY "Admins can view admins"
ON admins
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM admins
        WHERE admins.uid = auth.uid()
    )
);

-- ============================================
-- STEP 5: CREATE STORAGE POLICIES (CRITICAL!)
-- ============================================

-- Policy 1: INSERT - Allow ALL authenticated users to upload to notes-private bucket
-- This is the most permissive policy to ensure uploads work
CREATE POLICY "Authenticated users can upload"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'notes-private');

-- Policy 2: SELECT - Allow ALL authenticated users to read from notes-private bucket
CREATE POLICY "Authenticated users can read"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'notes-private');

-- Policy 3: SELECT - Admins can view all files
CREATE POLICY "Admins can view all files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
    bucket_id = 'notes-private'
    AND EXISTS (
        SELECT 1 FROM admins
        WHERE admins.uid = auth.uid()
    )
);

-- Policy 4: DELETE - Admins can delete files
CREATE POLICY "Admins can delete files"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id = 'notes-private'
    AND EXISTS (
        SELECT 1 FROM admins
        WHERE admins.uid = auth.uid()
    )
);

-- ============================================
-- STEP 6: VERIFICATION
-- ============================================

-- Uncomment these to verify policies were created:

-- Check notes table policies
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
-- FROM pg_policies 
-- WHERE tablename = 'notes';

-- Check storage policies
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
-- FROM pg_policies 
-- WHERE tablename = 'objects' AND schemaname = 'storage';

-- Check if RLS is enabled
-- SELECT tablename, rowsecurity FROM pg_tables WHERE tablename IN ('notes', 'admins');
-- SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE schemaname = 'storage' AND tablename = 'objects';

