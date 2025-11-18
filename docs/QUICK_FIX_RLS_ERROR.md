# Quick Fix: "new row violates row-level security policy" Error

If you're getting this error, follow these steps in order:

## Step 1: Fix Database RLS Policies

1. Go to Supabase Dashboard > **SQL Editor**
2. Open `database_setup_fixed.sql` from this project
3. Copy and paste the entire script
4. Click **"Run"**

This will:
- Drop any conflicting existing policies
- Recreate all policies correctly
- Fix the INSERT policy that allows users to upload notes

## Step 2: Create Storage Bucket (if not done)

1. Go to Supabase Dashboard > **Storage**
2. Click **"New bucket"** or **"Create a new bucket"**
3. Name: `notes-private`
4. **Uncheck "Public bucket"** (make it PRIVATE)
5. Click **"Create bucket"**

## Step 3: Set Up Storage Policies (CRITICAL!)

**This is the most common cause of the error!**

1. Go to Supabase Dashboard > **SQL Editor**
2. Open `storage_policies.sql` from this project
3. Copy and paste the entire script
4. Click **"Run"**

This creates policies that allow:
- ✅ Users to upload files to `pending/` folder
- ✅ Users to view their own files
- ✅ Admins to view all files

## Step 4: Verify Setup

1. Make sure you're **logged in** as a user
2. Try uploading a PDF again
3. Check browser console (F12) for any errors

## Still Getting Errors?

### Check These:

1. **Are you logged in?**
   - The error often happens if you're not authenticated
   - Make sure you've signed up and logged in

2. **Did you run both SQL scripts?**
   - `database_setup_fixed.sql` (for database)
   - `storage_policies.sql` (for storage)

3. **Is the bucket name correct?**
   - Must be exactly: `notes-private` (case-sensitive)

4. **Check Supabase Dashboard:**
   - Go to **Storage** > **Policies** tab
   - You should see 4 policies for `notes-private` bucket
   - Go to **SQL Editor** > Check if policies exist for `notes` table

5. **Browser Console:**
   - Open Developer Tools (F12)
   - Check the Console tab for specific error messages
   - The error message will tell you which policy is failing

## Common Issues:

### "Policy already exists"
- The `database_setup_fixed.sql` and `storage_policies.sql` scripts use `DROP POLICY IF EXISTS` to handle this
- If you still get this error, manually delete the policies in SQL Editor first

### "Bucket not found"
- Make sure the bucket `notes-private` exists
- Check the name is exactly `notes-private` (no spaces, correct case)

### "Access denied" on upload
- Make sure storage policies are set up (Step 3 above)
- Verify you're uploading to `pending/` folder (the code does this automatically)

## Need More Help?

See `STORAGE_SETUP_GUIDE.md` for detailed storage setup instructions.

