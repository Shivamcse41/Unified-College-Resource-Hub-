// admin-login.js
// Admin login logic - Only allows users who are in admins table

// Check if already logged in as admin
document.addEventListener('DOMContentLoaded', async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        // Check if user is admin
        const { data: adminData } = await supabase
            .from('admins')
            .select('*')
            .eq('uid', session.user.id)
            .single();

        if (adminData) {
            // Already logged in as admin, redirect to dashboard
            window.location.href = 'admin.html';
        } else {
            // User is logged in but not admin - sign them out
            await supabase.auth.signOut();
        }
    }
});

// Admin login form handler
document.getElementById('adminLoginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const messageDiv = document.getElementById('loginMessage');
    messageDiv.innerHTML = '';

    const email = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value;

    try {
        // Step 1: Login with email and password
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (authError) {
            throw new Error('Invalid email or password');
        }

        // Step 2: Check if user is in admins table
        const { data: adminData, error: adminError } = await supabase
            .from('admins')
            .select('*')
            .eq('uid', authData.user.id)
            .single();

        if (adminError || !adminData) {
            // User is not an admin - sign them out immediately
            await supabase.auth.signOut();
            throw new Error('Access Denied: You are not authorized as an administrator. Only admins can access this page.');
        }

        // Step 3: User is admin - redirect to admin dashboard
        messageDiv.innerHTML = '<div class="message success">Login successful! Redirecting to admin dashboard...</div>';
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1000);

    } catch (error) {
        messageDiv.innerHTML = `<div class="message error">${error.message}</div>`;
    }
});

// Forgot password link handler
document.getElementById('adminForgotPasswordLink').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('adminLoginForm').style.display = 'none';
    document.getElementById('adminForgotPasswordSection').style.display = 'block';
});

// Back to login from forgot password
document.getElementById('adminBackToLoginLink').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('adminLoginForm').style.display = 'block';
    document.getElementById('adminForgotPasswordSection').style.display = 'none';
});

// Admin forgot password form handler
document.getElementById('adminForgotPasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('adminForgotPasswordEmail').value.trim();
    const messageDiv = document.getElementById('adminForgotPasswordMessage');

    if (!email) {
        messageDiv.innerHTML = '<div class="message error">Please enter your email address.</div>';
        return;
    }

    try {
        // Determine the redirect URL
        let redirectUrl;
        
        // Check if a custom redirect URL is configured
        if (typeof window.PASSWORD_RESET_REDIRECT_URL !== 'undefined' && window.PASSWORD_RESET_REDIRECT_URL !== null) {
            // Use the configured redirect URL (remove trailing slash if present)
            const baseUrl = window.PASSWORD_RESET_REDIRECT_URL.replace(/\/$/, '');
            redirectUrl = `${baseUrl}/reset-password.html`;
        } else {
            // Use current origin (works for production, but not for localhost from email)
            // For localhost, user should configure PASSWORD_RESET_REDIRECT_URL or use ngrok
            const currentPath = window.location.pathname;
            const basePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
            redirectUrl = `${window.location.origin}${basePath}reset-password.html`;
            
            // Warn if using localhost (won't work from email)
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.warn('⚠️ Using localhost for password reset. This won\'t work from email links. Please configure PASSWORD_RESET_REDIRECT_URL in supabaseClient.js or use ngrok for local testing.');
            }
        }
        
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: redirectUrl
        });

        if (error) throw error;

        messageDiv.innerHTML = '<div class="message success">Password reset link has been sent to your email! Please check your inbox and follow the instructions to reset your password.</div>';
        document.getElementById('adminForgotPasswordForm').reset();
    } catch (error) {
        messageDiv.innerHTML = `<div class="message error">Error: ${error.message}</div>`;
    }
});

