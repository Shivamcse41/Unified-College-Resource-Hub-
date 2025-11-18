# 🔔 Notification System Setup Guide

## Overview

The notification system has been successfully added to your project! Users will now receive notifications when:
1. **New users sign up** - All existing users get notified
2. **New PDFs/documents are approved** - All users get notified when a document is approved and added to "All Approved Notes"

## Setup Instructions

### Step 1: Run the SQL Script

1. Open your **Supabase Dashboard**
2. Go to **SQL Editor**
3. Open the file `notifications_setup.sql`
4. Copy and paste the entire SQL script
5. Click **Run** to execute

This will create:
- `notifications` table
- Database functions for creating notifications
- Row Level Security (RLS) policies
- Indexes for performance

### Step 2: Verify Setup

After running the SQL script, verify that everything was created:

```sql
-- Check if notifications table exists
SELECT * FROM notifications LIMIT 1;

-- Check if functions exist
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('notify_all_users', 'notify_user', 'notify_document_approved');
```

### Step 3: Test the System

1. **Test New User Signup Notification:**
   - Have one user already logged in
   - Create a new account (signup)
   - The logged-in user should receive a notification

2. **Test Document Approval Notification:**
   - Upload a PDF as a user
   - Approve it as an admin
   - All logged-in users should receive a notification

## Features

### Notification Bell Icon
- Located in the top-right of the user dashboard
- Shows a red badge with unread count
- Click to open notification panel

### Notification Panel
- Shows all notifications (newest first)
- Unread notifications are highlighted
- Click any notification to mark as read
- "Mark all as read" button available
- Clicking a notification with a link navigates to that page

### Real-time Updates
- Notifications appear instantly when new events occur
- Toast notifications appear in the top-right corner
- No page refresh needed

### Notification Types
- **new_user** - Green border (when someone signs up)
- **new_document** - Blue border (when a document is approved)
- **info** - Purple border (general notifications)
- **success** - Green border
- **warning** - Orange border

## How It Works

### When a New User Signs Up:
1. User completes signup form
2. `user.js` calls `notify_all_users()` function
3. All existing users receive a notification
4. Notification appears in real-time for logged-in users

### When a Document is Approved:
1. Admin approves a document in `admin.html`
2. `admin.js` calls `notify_document_approved()` function
3. All users receive a notification with a link to `public.html`
4. Notification appears in real-time for logged-in users

## Database Functions

### `notify_all_users()`
Creates a notification for all users except the excluded one.

**Parameters:**
- `notification_title` - Title of the notification
- `notification_message` - Message content
- `notification_type` - Type (new_user, new_document, info, success, warning)
- `notification_link` - Optional link (e.g., 'public.html')
- `exclude_user_id` - User ID to exclude (usually the trigger user)

### `notify_user()`
Creates a notification for a specific user.

**Parameters:**
- `target_user_id` - User ID to notify
- `notification_title` - Title of the notification
- `notification_message` - Message content
- `notification_type` - Type
- `notification_link` - Optional link

### `notify_document_approved()`
Creates notifications for all users when a document is approved.

**Parameters:**
- `document_title` - Title of the approved document
- `document_subject` - Subject of the document
- `uploader_name` - Name of the uploader

## Troubleshooting

### Notifications not appearing?
1. Check if the SQL script ran successfully
2. Verify RLS policies are set correctly
3. Check browser console for errors
4. Ensure user is logged in

### "Permission denied" errors?
- Make sure the database functions have `SECURITY DEFINER` set
- Verify RLS policies allow authenticated users to insert notifications

### Real-time not working?
- Check Supabase Realtime is enabled in your project settings
- Verify the subscription is created (check browser console)

## Files Modified

1. **notifications_setup.sql** - Database setup script
2. **index.html** - Added notification UI component
3. **user.js** - Added notification functions and real-time subscription
4. **admin.js** - Added notification trigger when approving documents
5. **styles.css** - Added notification styles and animations

## Notes

- Notifications are stored in the database and persist across sessions
- Unread notifications are highlighted
- Clicking a notification marks it as read
- Notifications older than 50 are not shown (limit can be adjusted)
- Real-time updates work for all logged-in users

