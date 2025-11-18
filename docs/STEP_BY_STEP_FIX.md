# Step-by-Step Fix for RLS Error

Follow these steps **IN ORDER** to fix the "new row violates row-level security policy" error:

## ✅ Step 1: Verify You're Logged In

1. Open your app in the browser
2. Make sure you're **signed up and logged in** as a user
3. The error often happens if you're not authenticated

## ✅ Step 2: Run the Complete Fix Script

1. Go to **Supabase Dashboard** > **SQL Editor**
2. Click **"New query"**
3. Open the file **`FIX_RLS_ERROR_NOW.sql`** from this project
4. **Copy the ENTIRE script** and paste it into the SQL Editor
5. Click **"Run"** (or press Ctrl+Enter)
6. You should see "Success. No rows returned"

This script fixes **BOTH** database and storage policies in one go.

## ✅ Step 3: Verify Storage Bucket Exists

1. Go to **Supabase Dashboard** > **Storage**
2. Check if you see a bucket named **`notes-private`**
3. If it doesn't exist:
   - Click **"New bucket"**
   - Name: `notes-private` (exactly this)
   - **Uncheck "Public bucket"** (make it PRIVATE)
   - Click **"Create bucket"**

## ✅ Step 4: Test the Fix

1. Go back to your app
2. Make sure you're logged in
3. Try uploading a PDF file
4. It should work now! ✅

## 🔍 If It Still Doesn't Work

### Check 1: Are you authenticated?
- Open browser console (F12)
- Check if there are any auth errors
- Make sure you see your user email in the app

### Check 2: Verify policies were created
Run this in SQL Editor:
```sql
-- Check database policies
SELECT * FROM pg_policies WHERE tablename = 'notes';

-- Check storage policies  
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
```

You should see multiple policies listed.

### Check 3: Check browser console
- Open Developer Tools (F12)
- Go to Console tab
- Look for the exact error message
- The error will tell you which policy is failing

### Check 4: Verify bucket name
- The bucket must be named exactly: `notes-private`
- Case-sensitive, no spaces

## 🚨 Common Issues

### "Policy already exists"
- The script uses `DROP POLICY IF EXISTS` to handle this
- If you still get this error, the script didn't run completely
- Run the script again

### "Bucket not found"
- Create the `notes-private` bucket first (Step 3 above)
- Make sure the name is exactly `notes-private`

### "Access denied"
- Make sure you ran `FIX_RLS_ERROR_NOW.sql` completely
- Verify you're logged in
- Check that storage policies were created (Check 2 above)

## 📝 What the Fix Does

The `FIX_RLS_ERROR_NOW.sql` script:
1. ✅ Drops all existing conflicting policies
2. ✅ Recreates database policies correctly
3. ✅ Recreates storage policies with simplified rules
4. ✅ Ensures authenticated users can upload files
5. ✅ Ensures users can view their own files

## 🎯 Quick Test

After running the fix, try this:
1. Login to your app
2. Go to "Upload PDF" tab
3. Fill in title and subject
4. Select a PDF file
5. Click "Upload PDF"
6. Should see: "PDF uploaded successfully! Waiting for admin approval." ✅

If you see this message, the fix worked! 🎉

