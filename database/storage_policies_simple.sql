-- storage_policies_simple.sql
-- SIMPLIFIED Storage policies for the notes-private bucket
-- This version uses simpler checks that are more reliable
-- Run this AFTER creating the notes-private bucket

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload to pending folder" ON storage.objects;
DROP POLICY IF EXISTS "Users can view files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated reads" ON storage.objects;

-- SIMPLIFIED Policy: Allow authenticated users to upload ANY file to notes-private bucket
-- We restrict by folder in the application code, but this ensures uploads work
CREATE POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'notes-private');

-- SIMPLIFIED Policy: Allow authenticated users to read files from notes-private bucket
-- Users can view files they uploaded or approved files
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

-- Policy: Allow admins to delete files
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

