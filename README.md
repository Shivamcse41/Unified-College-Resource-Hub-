# Unified College Resource Hub – PDF Notes System

A simple web application for students to upload and share PDF notes and previous year questions (PYQs) with an admin approval system. Built with HTML, CSS, vanilla JavaScript, and Supabase.

## Features

- **User Authentication**: Sign up and login using Supabase Auth
- **PDF Upload**: Students can upload PDF notes with title and subject
- **Admin Approval System**: All uploads go through a pending state before approval
- **Status Tracking**: Users can see the status of their uploads (pending, approved, rejected)
- **Public Notes Page**: All approved notes are visible to everyone
- **Admin Dashboard**: Admins can review, preview, approve, or reject pending uploads
- **Secure File Storage**: PDFs are stored in private Supabase Storage with signed URLs for viewing

## Project Structure

```
├── index.html          # Main entry page with login and user dashboard
├── user.js            # User-side logic (upload, my uploads, profile)
├── admin.html         # Admin dashboard page
├── admin.js           # Admin-side logic (approve/reject pending PDFs)
├── public.html        # Public page showing all approved notes
├── public.js          # Logic to fetch and display approved PDFs
├── supabaseClient.js  # Supabase client configuration
├── styles.css         # Styling for all pages
├── database_setup.sql         # SQL script for database setup (original)
├── database_setup_fixed.sql   # Fixed SQL script (use this if you get RLS errors)
├── storage_policies.sql       # Storage bucket policies (run after creating bucket)
├── STORAGE_SETUP_GUIDE.md     # Detailed storage setup guide
└── README.md                  # This file
```

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in your project details (name, database password, region)
4. Wait for the project to be created (takes a few minutes)

### 2. Set Up the Database

1. In your Supabase project dashboard, go to **SQL Editor**
2. **Use `database_setup_fixed.sql`** (this fixes RLS policy issues)
   - Open the `database_setup_fixed.sql` file from this project
   - Copy and paste the entire SQL script into the SQL Editor
   - Click "Run" to execute the script
3. This will create:
   - `admins` table
   - `notes` table
   - Row Level Security (RLS) policies (with proper conflict handling)
   - Indexes for better performance

**Note**: If you get "new row violates row-level security policy" errors, use `database_setup_fixed.sql` instead of `database_setup.sql`

### 3. Create Storage Bucket

1. In Supabase dashboard, go to **Storage**
2. Click "Create a new bucket" (or "New bucket")
3. Name it: `notes-private` (must be exactly this name)
4. **Important**: Make sure it's set to **Private** (uncheck "Public bucket")
5. File size limit: 10 MB (10485760 bytes) or leave default
6. Click "Create bucket"

### 4. Set Up Storage Policies (CRITICAL!)

**This step is required to fix storage upload errors!**

1. In Supabase dashboard, go to **SQL Editor**
2. Open the `storage_policies.sql` file from this project
3. Copy and paste the entire SQL script into the SQL Editor
4. Click "Run" to execute the script
5. This creates policies that allow:
   - Users to upload files to the `pending/` folder
   - Users to view their own files and approved files
   - Admins to view and delete all files

**See `STORAGE_SETUP_GUIDE.md` for detailed instructions and troubleshooting.**

### 5. Add an Admin User

1. In Supabase dashboard, go to **Authentication** > **Users**
2. Create a new user account (or use an existing one) that you want to be an admin
3. Copy the user's UUID (it looks like: `123e4567-e89b-12d3-a456-426614174000`)
4. Go back to **SQL Editor**
5. Run this SQL (replace `YOUR_ADMIN_USER_UID_HERE` with the actual UUID):

```sql
INSERT INTO admins (uid, full_name)
VALUES ('YOUR_ADMIN_USER_UID_HERE', 'Admin Name');
```

Alternatively, you can find the UUID by email:

```sql
-- First, find the user's UUID
SELECT id, email FROM auth.users WHERE email = 'admin@example.com';

-- Then insert into admins table using that UUID
INSERT INTO admins (uid, full_name)
VALUES ('uuid-from-above-query', 'Admin Name');
```

### 6. Configure Supabase Client

1. In Supabase dashboard, go to **Settings** > **API**
2. Copy your **Project URL** and **anon/public key**
3. Open `supabaseClient.js` in this project
4. Replace the placeholders:

**Note:** For direct PostgreSQL connections (database clients), see `DATABASE_CONNECTION_GUIDE.md` and `database_config.js`
   - `YOUR_SUPABASE_PROJECT_URL` with your Project URL
   - `YOUR_SUPABASE_ANON_KEY` with your anon/public key

```javascript
const SUPABASE_URL = 'https://xxxxx.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

### 7. Enable Anonymous Access (Optional but Recommended)

For the public notes page to work without login:

1. In Supabase dashboard, go to **Settings** > **API**
2. Under "Project API keys", make sure "Enable anonymous access" is checked
3. The public notes page will work for unauthenticated users

### 8. Run the Project Locally

You can use any static file server. Here are a few options:

**Option 1: Using `npx serve` (recommended)**
```bash
npx serve .
```

**Option 2: Using Python**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Option 3: Using Node.js `http-server`**
```bash
npx http-server
```

Then open your browser and go to:
- `http://localhost:3000` (for serve)
- `http://localhost:8000` (for Python)
- `http://localhost:8080` (for http-server)

## How It Works

### User Flow

1. **Sign Up / Login**: Users create an account or login using email and password
2. **Upload PDF**: 
   - User fills in title and subject
   - Selects a PDF file (max 10 MB)
   - File is uploaded to `notes-private/pending/{noteId}.pdf`
   - A record is created in the `notes` table with status = `pending`
3. **My Uploads**: Users can see all their uploads and their status
4. **Status Updates**: 
   - When admin approves → status changes to `approved`
   - When admin rejects → status changes to `rejected`
   - Users see the updated status in "My Uploads"

### Admin Flow

1. **Admin Login**: Admin logs in with their credentials
2. **Access Check**: System verifies the user is in the `admins` table
3. **Review Pending**: Admin sees all notes with status = `pending`
4. **Preview**: Admin can preview PDFs using signed URLs
5. **Approve/Reject**: 
   - Approve → sets status to `approved`, records `approved_by` and `approved_at`
   - Reject → sets status to `rejected`
6. **Auto-refresh**: List updates automatically after approval/rejection

### Public Notes Flow

1. **No Login Required**: Anyone can access the public notes page
2. **View Approved**: Shows all notes with status = `approved`
3. **Search**: Client-side search by title or subject
4. **View PDF**: Clicking "View PDF" generates a signed URL (valid for 60 seconds) and opens in a new tab

## File Storage

- **Bucket**: `notes-private` (private bucket)
- **File Path Format**: `pending/{noteId}.pdf`
- **Note**: Files are NOT moved after approval. Only the database status changes.
- **Viewing**: All PDFs are accessed via signed URLs (`createSignedUrl`) valid for 60 seconds

## Security Features

- **Row Level Security (RLS)**: Enabled on all tables
- **Policies**:
  - Users can only insert notes with their own `uploader_uid`
  - Users can only view their own notes (any status) or approved notes (public)
  - Admins can view all notes and update status
  - Public can view approved notes (if anonymous access enabled)
- **Private Storage**: Files are stored in a private bucket
- **Signed URLs**: PDFs are accessed via time-limited signed URLs

## Troubleshooting

### "You are not an admin" error
- Make sure you've added your user UUID to the `admins` table
- Verify the UUID matches exactly (case-sensitive)

### "new row violates row-level security policy" error
- **For database**: Run `database_setup_fixed.sql` instead of `database_setup.sql`
- **For storage**: Make sure you've run `storage_policies.sql` after creating the bucket
- Verify the user is authenticated (logged in)
- Check that RLS policies are created correctly in SQL Editor

### Can't upload files
- Check that the `notes-private` bucket exists and is private
- **CRITICAL**: Run `storage_policies.sql` to set up storage policies
- Verify RLS policies are correctly set up for both database and storage
- Check browser console for specific error messages
- Ensure the file path starts with `pending/`

### Public page not loading notes
- Make sure anonymous access is enabled in Supabase settings
- Verify the RLS policy for `anon` users is created
- Check that there are notes with status = `approved`

### Signed URLs not working
- Verify the file path in the database matches the actual file path in storage
- Check that the bucket name is exactly `notes-private`
- Ensure the file was uploaded successfully

## Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Backend**: Supabase (PostgreSQL, Storage, Auth)
- **Libraries**: Supabase JS SDK (via CDN)

## License

This project is open source and available for educational purposes.

## Support

For issues or questions:
1. Check the Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
2. Review the browser console for error messages
3. Verify all setup steps were completed correctly

