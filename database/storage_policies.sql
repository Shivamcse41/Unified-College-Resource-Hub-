-- storage_policies.sql
-- Storage policies for the notes-private bucket
-- Run this AFTER creating the notes-private bucket in Supabase Storage
-- 
-- NOTE: For a complete fix, use FIX_RLS_ERROR_NOW.sql instead (fixes both database and storage)

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can upload to pending folder" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated reads" ON storage.objects;

-- SIMPLIFIED Policy: Allow authenticated users to upload ANY file to notes-private bucket
-- This is simpler and more reliable than checking folder names
CREATE POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'notes-private');

-- SIMPLIFIED Policy: Allow authenticated users to read files from notes-private bucket
CREATE POLICY "Allow authenticated reads"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'notes-private');

-- Policy: Allow admins to view all files
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

-- Policy: Allow admins to delete files (optional, for cleanup)
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

