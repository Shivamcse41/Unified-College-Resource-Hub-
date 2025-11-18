-- FIX_RLS_ERROR_NOW.sql
-- COMPLETE FIX for "new row violates row-level security policy" error
-- Run this script in Supabase SQL Editor to fix both database and storage RLS issues

-- ============================================
-- PART 1: FIX DATABASE POLICIES
-- ============================================

-- Drop all existing policies on notes table
DROP POLICY IF EXISTS "Users can insert their own notes" ON notes;
DROP POLICY IF EXISTS "Anyone can view approved notes" ON notes;
DROP POLICY IF EXISTS "Users can view their own notes" ON notes;
DROP POLICY IF EXISTS "Admins can view all notes" ON notes;
DROP POLICY IF EXISTS "Admins can update notes" ON notes;
DROP POLICY IF EXISTS "Public can view approved notes" ON notes;

-- Drop all existing policies on admins table
DROP POLICY IF EXISTS "Admins can view admins" ON admins;

-- Recreate notes table policies
CREATE POLICY "Users can insert their own notes"
ON notes
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = uploader_uid);

CREATE POLICY "Anyone can view approved notes"
ON notes
FOR SELECT
TO authenticated
USING (status = 'approved');

CREATE POLICY "Users can view their own notes"
ON notes
FOR SELECT
TO authenticated
USING (auth.uid() = uploader_uid);

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

CREATE POLICY "Public can view approved notes"
ON notes
FOR SELECT
TO anon
USING (status = 'approved');

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
-- PART 2: FIX STORAGE POLICIES
-- ============================================

-- Drop all existing storage policies
DROP POLICY IF EXISTS "Users can upload to pending folder" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated reads" ON storage.objects;

-- SIMPLIFIED: Allow authenticated users to upload to notes-private bucket
CREATE POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'notes-private');

-- SIMPLIFIED: Allow authenticated users to read from notes-private bucket
CREATE POLICY "Allow authenticated reads"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'notes-private');

-- Allow admins to view all files
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

-- Allow admins to delete files
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
-- VERIFICATION QUERIES (Optional - run these to check)
-- ============================================

-- Check if policies exist on notes table
-- SELECT * FROM pg_policies WHERE tablename = 'notes';

-- Check if policies exist on storage.objects
-- SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';

