// reset-password.js
// Handle password reset when user clicks the link from email

document.addEventListener('DOMContentLoaded', async () => {
    const messageDiv = document.getElementById('resetMessage');
    
    // Check for hash fragment in URL (Supabase includes reset token in hash)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const type = hashParams.get('type');
    const errorParam = hashParams.get('error');
    const errorDescription = hashParams.get('error_description');
    
    // Check for errors in URL
    if (errorParam) {
        messageDiv.innerHTML = `
            <div class="message error">
                <strong>Error: ${errorParam}</strong><br>
                ${errorDescription || 'An error occurred while processing the reset link.'}
                <br><br>
                <a href="index.html" class="auth-link">← Back to Login</a>
            </div>
        `;
        document.getElementById('resetPasswordForm').style.display = 'none';
        return;
    }
    
    // If we have hash parameters, Supabase will handle the session automatically
    // Wait a moment for Supabase to process the hash
    if (accessToken && type === 'recovery') {
        // Give Supabase time to process the recovery token
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Check if we have a valid session (user clicked the reset link)
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
        messageDiv.innerHTML = `
            <div class="message error">
                <strong>Invalid or expired reset link.</strong><br>
                The password reset link may have expired or is invalid. Please request a new password reset link from the login page.
                <br><br>
                <a href="index.html" class="auth-link">← Back to Login</a>
            </div>
        `;
        document.getElementById('resetPasswordForm').style.display = 'none';
        return;
    }

    // Listen for password reset form submission
    document.getElementById('resetPasswordForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        messageDiv.innerHTML = '';

        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validation
        if (newPassword.length < 6) {
            messageDiv.innerHTML = '<div class="message error">Password must be at least 6 characters long.</div>';
            return;
        }

        if (newPassword !== confirmPassword) {
            messageDiv.innerHTML = '<div class="message error">Passwords do not match. Please try again.</div>';
            return;
        }

        try {
            // Update the password
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

            messageDiv.innerHTML = `
                <div class="message success">
                    <strong>Password reset successful!</strong><br>
                    Your password has been updated. Redirecting to login page...
                </div>
            `;

            // Redirect to login page after 2 seconds
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);

        } catch (error) {
            messageDiv.innerHTML = `<div class="message error">Error: ${error.message}</div>`;
        }
    });
});

