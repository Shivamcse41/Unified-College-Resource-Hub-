-- database_setup_fixed.sql
-- Fixed SQL script to resolve RLS policy violations
-- Run this in your Supabase project's SQL Editor

-- Enable UUID extension (usually already enabled, but just in case)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can insert their own notes" ON notes;
DROP POLICY IF EXISTS "Anyone can view approved notes" ON notes;
DROP POLICY IF EXISTS "Users can view their own notes" ON notes;
DROP POLICY IF EXISTS "Admins can view all notes" ON notes;
DROP POLICY IF EXISTS "Admins can update notes" ON notes;
DROP POLICY IF EXISTS "Public can view approved notes" ON notes;
DROP POLICY IF EXISTS "Admins can view admins" ON admins;

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
    uid UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT
);

-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subject TEXT,
    uploader_uid UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    uploader_name TEXT,
    file_path TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ
);

-- Enable Row Level Security (RLS) on notes table
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Enable RLS on admins table
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Policy: Allow users to insert their own notes
-- This is the most important policy for uploads
CREATE POLICY "Users can insert their own notes"
ON notes
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = uploader_uid);

-- Policy: Allow users to select approved notes (public)
CREATE POLICY "Anyone can view approved notes"
ON notes
FOR SELECT
TO authenticated
USING (status = 'approved');

-- Policy: Allow users to view their own notes (regardless of status)
CREATE POLICY "Users can view their own notes"
ON notes
FOR SELECT
TO authenticated
USING (auth.uid() = uploader_uid);

-- Policy: Allow admins to view all notes
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

-- Policy: Allow admins to update notes (for approval/rejection)
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

-- Policy: Allow public (unauthenticated) to view approved notes
-- Note: This requires enabling anonymous access in Supabase settings
CREATE POLICY "Public can view approved notes"
ON notes
FOR SELECT
TO anon
USING (status = 'approved');

-- Policy: Allow admins to view admins table
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

-- Optional: Create an index on status for faster queries
CREATE INDEX IF NOT EXISTS idx_notes_status ON notes(status);
CREATE INDEX IF NOT EXISTS idx_notes_uploader_uid ON notes(uploader_uid);
CREATE INDEX IF NOT EXISTS idx_notes_approved_at ON notes(approved_at);

-- Example: Insert an admin user
-- Replace 'YOUR_ADMIN_USER_UID_HERE' with the actual UUID of your admin user
-- You can find this UUID in Supabase Dashboard > Authentication > Users
-- Or use: SELECT id FROM auth.users WHERE email = 'admin@example.com';
-- 
-- INSERT INTO admins (uid, full_name)
-- VALUES ('YOUR_ADMIN_USER_UID_HERE', 'Admin Name');

