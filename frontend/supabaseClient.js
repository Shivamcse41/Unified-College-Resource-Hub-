// supabaseClient.js
// Supabase client configuration

// ============================================
// HOW TO GET YOUR SUPABASE URL AND ANON KEY:
// ============================================
// 1. Go to https://supabase.com and login to your account
// 2. Select your project (or create a new one)
// 3. In the left sidebar, click on "Settings" (gear icon)
// 4. Click on "API" in the settings menu
// 5. You will see:
//    - "Project URL" - Copy this value and paste it below as SUPABASE_URL
//    - "anon public" key - Copy this value and paste it below as SUPABASE_ANON_KEY
// 
// Example:
// SUPABASE_URL will look like: 'https://abcdefghijklmnop.supabase.co'
// SUPABASE_ANON_KEY will look like: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' (a long string)
// ============================================

// Supabase project credentials
const SUPABASE_URL = 'https://fnqogmrilacriqbawahx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZucW9nbXJpbGFjcmlxYmF3YWh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMDIyMzEsImV4cCI6MjA3ODc3ODIzMX0.K9Gx4equuRYkR0zyYEXWtIYokDtBrMUVywa_nBszkdo';

// Password Reset Redirect URL Configuration
// IMPORTANT: Set this to your actual public URL where the app is hosted
// For local development with ngrok: Use your ngrok URL (e.g., 'https://abc123.ngrok.io')
// For production: Use your actual domain (e.g., 'https://yourdomain.com')
// Leave as null to use Supabase's Site URL setting
// Make it globally accessible
window.PASSWORD_RESET_REDIRECT_URL = 'https://unified-college-resource-hub.vercel.app'; // Vercel deployment URL

// Initialize Supabase client
// Note: We use window.supabase because the Supabase SDK is loaded via CDN in the HTML files
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

