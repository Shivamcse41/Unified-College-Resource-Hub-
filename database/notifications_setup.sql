-- notifications_setup.sql
-- SQL script to set up notifications system for Unified College Resource Hub
-- Run this in your Supabase project's SQL Editor

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'new_user', 'new_document')),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    link TEXT -- Optional link to related content (e.g., public.html for new documents)
);

-- Enable Row Level Security (RLS) on notifications table
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own notifications
CREATE POLICY "Users can view their own notifications"
ON notifications
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Users can update their own notifications (to mark as read)
CREATE POLICY "Users can update their own notifications"
ON notifications
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Allow authenticated users to insert notifications
-- This allows the notify_all_users function to work
CREATE POLICY "Authenticated users can insert notifications"
ON notifications
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Function: Create notification for all users (except the trigger user)
-- This function bypasses RLS using SECURITY DEFINER
CREATE OR REPLACE FUNCTION notify_all_users(
    notification_title TEXT,
    notification_message TEXT,
    notification_type TEXT DEFAULT 'info',
    notification_link TEXT DEFAULT NULL,
    exclude_user_id UUID DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Insert notifications for all users except the excluded one
    INSERT INTO notifications (user_id, title, message, type, link)
    SELECT 
        id as user_id,
        notification_title,
        notification_message,
        notification_type,
        notification_link
    FROM auth.users
    WHERE id != COALESCE(exclude_user_id, '00000000-0000-0000-0000-000000000000'::uuid);
END;
$$;

-- Function: Create notification for a specific user
-- This function bypasses RLS using SECURITY DEFINER
CREATE OR REPLACE FUNCTION notify_user(
    target_user_id UUID,
    notification_title TEXT,
    notification_message TEXT,
    notification_type TEXT DEFAULT 'info',
    notification_link TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO notifications (user_id, title, message, type, link)
    VALUES (target_user_id, notification_title, notification_message, notification_type, notification_link);
END;
$$;

-- Trigger: Notify all users when a new user signs up
-- This trigger fires when a new user is created in auth.users
CREATE OR REPLACE FUNCTION handle_new_user_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_email TEXT;
    user_name TEXT;
BEGIN
    -- Get user email
    user_email := NEW.email;
    user_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email);
    
    -- Notify all existing users about the new signup
    -- Exclude the new user themselves
    PERFORM notify_all_users(
        'New User Joined! 🎉',
        user_name || ' (' || user_email || ') has joined the platform.',
        'new_user',
        NULL,
        NEW.id
    );
    
    RETURN NEW;
END;
$$;

-- Create trigger on auth.users (if possible) or we'll handle it in application code
-- Note: Direct triggers on auth.users may not be possible in Supabase
-- So we'll handle new user notifications in the signup handler in user.js

-- Function: Notify all users when a document is approved
-- This will be called from admin.js when approving a document
-- This function bypasses RLS using SECURITY DEFINER
CREATE OR REPLACE FUNCTION notify_document_approved(
    document_title TEXT,
    document_subject TEXT,
    uploader_name TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    PERFORM notify_all_users(
        'New Document Available! 📄',
        'A new document "' || document_title || '" (' || COALESCE(document_subject, 'No branch') || ') has been approved and is now available in All Approved Notes.',
        'new_document',
        'public.html'
    );
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION notify_all_users TO authenticated;
GRANT EXECUTE ON FUNCTION notify_user TO authenticated;
GRANT EXECUTE ON FUNCTION notify_document_approved TO authenticated;

