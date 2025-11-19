# Supabase Storage Setup Guide

This guide will help you set up the `notes-private` storage bucket and configure the necessary policies.

## Step 1: Create the Storage Bucket

1. **Go to your Supabase Dashboard**
   - Navigate to [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project

2. **Open Storage**
   - In the left sidebar, click on **"Storage"**

3. **Create New Bucket**
   - Click the **"New bucket"** button (or **"Create a new bucket"**)
   - Fill in the details:
     - **Name**: `notes-private` (must be exactly this name)
     - **Public bucket**: **UNCHECKED** (make sure it's **PRIVATE**)
     - **File size limit**: Leave default or set to 50 MB (52428800 bytes)
     - **Allowed MIME types**: Leave empty (allows all types) OR enter `application/pdf` to restrict to PDFs only
   - Click **"Create bucket"**

## Step 2: Configure Storage Policies (IMPORTANT!)

After creating the bucket, you need to set up storage policies so users can upload and view files.

### Option A: Using SQL Editor (Recommended)

1. **Go to SQL Editor**
   - In the left sidebar, click **"SQL Editor"**
   - Click **"New query"**

2. **Run this SQL script**:

```sql
-- Storage policies for notes-private bucket

-- Policy: Allow authenticated users to upload files to pending/ folder
CREATE POLICY "Users can upload to pending folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'notes-private' 
    AND (storage.foldername(name))[1] = 'pending'
);

-- Policy: Allow authenticated users to view their own files
CREATE POLICY "Users can view their own files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
    bucket_id = 'notes-private'
    AND (
        -- Users can view files in pending/ folder if they uploaded them
        (storage.foldername(name))[1] = 'pending'
        OR
        -- Users can view approved files (in any folder)
        EXISTS (
            SELECT 1 FROM notes
            WHERE notes.file_path = storage.objects.name
            AND notes.status = 'approved'
        )
    )
);

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
```

3. **Click "Run"** to execute the script

### Option B: Using Storage UI (Alternative)

1. **Go to Storage**
   - Click on **"Storage"** in the left sidebar
   - Click on the **`notes-private`** bucket

2. **Open Policies Tab**
   - Click on the **"Policies"** tab at the top

3. **Create Policies Manually**
   - Click **"New Policy"**
   - For each policy, select:
     - **Policy name**: (e.g., "Users can upload to pending folder")
     - **Allowed operation**: INSERT/SELECT/DELETE
     - **Target roles**: authenticated
     - **Policy definition**: Use the SQL from Option A above

## Step 3: Verify Storage Setup

1. **Test Upload** (after setting up database and storage):
   - Go to your app
   - Login as a user
   - Try uploading a PDF
   - Check the browser console for any errors

2. **Check Storage**:
   - Go to Supabase Dashboard > Storage > `notes-private`
   - You should see a `pending/` folder
   - Uploaded files should appear as `pending/{uuid}.pdf`

## Troubleshooting Storage Issues

### Error: "new row violates row-level security policy" (Storage)

**Solution**: Make sure you've run the storage policies SQL script above. The storage bucket also has RLS that needs to be configured.

### Error: "Bucket not found"

**Solution**: 
- Verify the bucket name is exactly `notes-private` (case-sensitive)
- Make sure the bucket was created successfully
- Check in Storage > Buckets that it appears in the list

### Error: "Access denied" when uploading

**Solution**:
- Verify the storage policies are created
- Check that the user is authenticated (logged in)
- Ensure the file path starts with `pending/`
- Verify the INSERT policy allows uploads to the `pending/` folder

### Error: "Access denied" when viewing PDFs

**Solution**:
- Make sure the SELECT policies are created
- For approved notes, verify the policy allows viewing approved files
- Check that signed URLs are being generated correctly

### Files not appearing in storage

**Solution**:
- Check browser console for errors
- Verify the upload was successful (check the response)
- Refresh the Storage page in Supabase dashboard
- Check the `pending/` folder specifically

## Storage Policy Explanation

- **INSERT Policy**: Allows authenticated users to upload files to the `pending/` folder only
- **SELECT Policy (Users)**: Allows users to view files they uploaded OR approved files
- **SELECT Policy (Admins)**: Allows admins to view all files in the bucket
- **DELETE Policy (Admins)**: Allows admins to delete files (for cleanup purposes)

## File Path Structure

Files are stored with this structure:
```
notes-private/
  └── pending/
      ├── {uuid1}.pdf
      ├── {uuid2}.pdf
      └── ...
```

The file path in the database will be: `pending/{uuid}.pdf`

## Next Steps

After setting up storage:
1. ✅ Run the `database_setup_fixed.sql` script
2. ✅ Create the `notes-private` bucket (private)
3. ✅ Run the storage policies SQL script above
4. ✅ Test uploading a PDF file
5. ✅ Verify files appear in Storage dashboard

Your storage is now ready to use!

