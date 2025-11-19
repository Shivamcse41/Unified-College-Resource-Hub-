// user.js
// User-side logic for upload, my uploads, and profile

// Notification subscription
let notificationSubscription = null;

// Check authentication status on page load
document.addEventListener('DOMContentLoaded', async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        showUserDashboard();
        loadMyUploads();
        loadProfile();
        loadNotifications();
        subscribeToNotifications();
    } else {
        showLogin();
    }
});

// Listen for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
        showUserDashboard();
        loadMyUploads();
        loadProfile();
        loadNotifications();
        subscribeToNotifications();
    } else {
        showLogin();
        // Unsubscribe from notifications when logged out
        if (notificationSubscription) {
            supabase.removeChannel(notificationSubscription);
            notificationSubscription = null;
        }
    }
});

// Show login section
function showLogin() {
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('signupSection').style.display = 'none';
    document.getElementById('forgotPasswordSection').style.display = 'none';
    document.getElementById('userDashboard').style.display = 'none';
}

// Show signup section
function showSignup() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('signupSection').style.display = 'block';
    document.getElementById('forgotPasswordSection').style.display = 'none';
    document.getElementById('userDashboard').style.display = 'none';
}

// Show forgot password section
function showForgotPassword() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('signupSection').style.display = 'none';
    document.getElementById('forgotPasswordSection').style.display = 'block';
    document.getElementById('userDashboard').style.display = 'none';
}

// Show user dashboard
function showUserDashboard() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('signupSection').style.display = 'none';
    document.getElementById('userDashboard').style.display = 'block';
}

// Tab switching
function switchTab(tabName) {
    // Hide all tabs and remove inline styles
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
        tab.style.display = 'none';
    });
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    if (tabName === 'upload') {
        const uploadTab = document.getElementById('uploadTab');
        const uploadBtn = document.querySelectorAll('.tab-button')[0];
        if (uploadTab) {
            uploadTab.classList.add('active');
            uploadTab.style.display = 'block';
        }
        if (uploadBtn) uploadBtn.classList.add('active');
    } else if (tabName === 'myUploads') {
        const myUploadsTab = document.getElementById('myUploadsTab');
        const myUploadsBtn = document.querySelectorAll('.tab-button')[1];
        if (myUploadsTab) {
            myUploadsTab.classList.add('active');
            myUploadsTab.style.display = 'block';
        }
        if (myUploadsBtn) myUploadsBtn.classList.add('active');
        loadMyUploads();
    } else if (tabName === 'profile') {
        const profileTab = document.getElementById('profileTab');
        const profileBtn = document.querySelectorAll('.tab-button')[2];
        if (profileTab) {
            profileTab.classList.add('active');
            profileTab.style.display = 'block';
        }
        if (profileBtn) profileBtn.classList.add('active');
        loadProfile();
    }
}

// Login form handler
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const messageDiv = document.getElementById('loginMessage');

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        messageDiv.innerHTML = '<div class="message success">Login successful! Redirecting...</div>';
        setTimeout(() => {
            showUserDashboard();
            loadMyUploads();
            loadProfile();
        }, 1000);
    } catch (error) {
        messageDiv.innerHTML = `<div class="message error">Error: ${error.message}</div>`;
    }
});

// Signup form handler
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const firstName = document.getElementById('signupFirstName').value.trim();
    const lastName = document.getElementById('signupLastName').value.trim();
    const phone = document.getElementById('signupPhone').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const userId = document.getElementById('signupUserId').value.trim();
    const password = document.getElementById('signupPassword').value;
    const messageDiv = document.getElementById('signupMessage');

    // Validation
    if (!firstName || !lastName) {
        messageDiv.innerHTML = '<div class="message error">Please enter both first name and last name.</div>';
        return;
    }

    if (!phone || phone.length < 10) {
        messageDiv.innerHTML = '<div class="message error">Please enter a valid phone number.</div>';
        return;
    }

    if (!userId || userId.length < 3 || userId.length > 20) {
        messageDiv.innerHTML = '<div class="message error">User ID must be between 3 and 20 characters.</div>';
        return;
    }

    // Validate User ID format (letters, numbers, underscore, hyphen only)
    const userIdPattern = /^[A-Za-z0-9_\-]+$/;
    if (!userIdPattern.test(userId)) {
        messageDiv.innerHTML = '<div class="message error">User ID can only contain letters, numbers, underscore, and hyphen.</div>';
        return;
    }

    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    phone: phone,
                    user_id: userId,
                    full_name: `${firstName} ${lastName}`
                }
            }
        });

        if (error) throw error;

        // Notify all existing users about the new signup
        // We'll do this after a short delay to ensure the user is created
        setTimeout(async () => {
            try {
                const fullName = `${firstName} ${lastName}`;
                const { error: notifyError } = await supabase.rpc('notify_all_users', {
                    notification_title: 'New User Joined! 🎉',
                    notification_message: `${fullName} (${email}) has joined the platform.`,
                    notification_type: 'new_user',
                    notification_link: null,
                    exclude_user_id: data.user?.id || null
                });
                
                if (notifyError) {
                    console.error('Error notifying users:', notifyError);
                }
            } catch (err) {
                console.error('Error in notification:', err);
            }
        }, 1000);

        messageDiv.innerHTML = '<div class="message success">Account created successfully! Please check your email to verify your account, then login.</div>';
        setTimeout(() => {
            showLogin();
        }, 2000);
    } catch (error) {
        messageDiv.innerHTML = `<div class="message error">Error: ${error.message}</div>`;
    }
});

// Toggle between login and signup
document.getElementById('signupLink').addEventListener('click', (e) => {
    e.preventDefault();
    showSignup();
});

document.getElementById('loginLink').addEventListener('click', (e) => {
    e.preventDefault();
    showLogin();
});

// Forgot password link handler
document.getElementById('forgotPasswordLink').addEventListener('click', (e) => {
    e.preventDefault();
    showForgotPassword();
});

// Back to login from forgot password
document.getElementById('backToLoginLink').addEventListener('click', (e) => {
    e.preventDefault();
    showLogin();
});

// Forgot password form handler
document.getElementById('forgotPasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('forgotPasswordEmail').value.trim();
    const messageDiv = document.getElementById('forgotPasswordMessage');

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
        document.getElementById('forgotPasswordForm').reset();
    } catch (error) {
        messageDiv.innerHTML = `<div class="message error">Error: ${error.message}</div>`;
    }
});

// File input change handler - show selected file name
document.getElementById('noteFile').addEventListener('change', (e) => {
    const file = e.target.files[0];
    const fileLabel = document.querySelector('.file-text');
    if (file && fileLabel) {
        fileLabel.textContent = file.name;
        fileLabel.style.color = '#667eea';
    }
});

// Upload form handler
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const messageDiv = document.getElementById('uploadMessage');
    messageDiv.innerHTML = '';

    const title = document.getElementById('noteTitle').value.trim();
    const subject = document.getElementById('noteSubject').value.trim();
    const fileInput = document.getElementById('noteFile');
    const file = fileInput.files[0];

    // Validation
    if (!subject) {
        messageDiv.innerHTML = '<div class="message error">Please select your branch.</div>';
        return;
    }

    if (!file) {
        messageDiv.innerHTML = '<div class="message error">Please select a PDF file.</div>';
        return;
    }

    if (file.type !== 'application/pdf') {
        messageDiv.innerHTML = '<div class="message error">Only PDF files are allowed.</div>';
        return;
    }

    if (file.size > 50 * 1024 * 1024) {
        messageDiv.innerHTML = '<div class="message error">File size must be less than 50 MB.</div>';
        return;
    }

    try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // Generate UUID for note ID
        const noteId = crypto.randomUUID();
        const filePath = `pending/${noteId}.pdf`;

        // Upload file to storage
        const { error: uploadError } = await supabase.storage
            .from('notes-private')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) throw uploadError;

        // Insert note record
        const { error: insertError } = await supabase
            .from('notes')
            .insert({
                id: noteId,
                title: title,
                subject: subject,
                uploader_uid: user.id,
                uploader_name: user.email,
                file_path: filePath,
                status: 'pending'
            });

        if (insertError) throw insertError;

        // Success
        messageDiv.innerHTML = '<div class="message success">PDF uploaded successfully! Waiting for admin approval.</div>';
        document.getElementById('uploadForm').reset();

        // Refresh my uploads if on that tab
        if (document.getElementById('myUploadsTab').classList.contains('active')) {
            loadMyUploads();
        }
    } catch (error) {
        messageDiv.innerHTML = `<div class="message error">Error: ${error.message}</div>`;
    }
});

// Load my uploads
async function loadMyUploads() {
    const listDiv = document.getElementById('myUploadsList');
    listDiv.innerHTML = '<div class="loading">Loading your uploads...</div>';

    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data: notes, error } = await supabase
            .from('notes')
            .select('*')
            .eq('uploader_uid', user.id)
            .order('uploaded_at', { ascending: false });

        if (error) throw error;

        if (!notes || notes.length === 0) {
            listDiv.innerHTML = '<div class="empty-state"><p>You haven\'t uploaded any notes yet.</p></div>';
            return;
        }

        // Create table
        let html = '<table><thead><tr><th>Title</th><th>Branch</th><th>Status</th><th>Uploaded At</th><th>Action</th></tr></thead><tbody>';

        notes.forEach(note => {
            const date = new Date(note.uploaded_at).toLocaleDateString();
            const statusClass = note.status;
            html += `
                <tr>
                    <td>${escapeHtml(note.title)}</td>
                    <td>${escapeHtml(note.subject)}</td>
                    <td><span class="status ${statusClass}">${note.status}</span></td>
                    <td>${date}</td>
                    <td>
                        ${note.status === 'approved' 
                            ? `<button class="small" onclick="viewPDF('${note.file_path}')">View</button>` 
                            : '-'}
                    </td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        listDiv.innerHTML = html;
    } catch (error) {
        listDiv.innerHTML = `<div class="message error">Error loading uploads: ${error.message}</div>`;
    }
}

// View PDF (for approved notes)
async function viewPDF(filePath) {
    try {
        const { data, error } = await supabase.storage
            .from('notes-private')
            .createSignedUrl(filePath, 60);

        if (error) throw error;

        window.open(data.signedUrl, '_blank');
    } catch (error) {
        alert('Error viewing PDF: ' + error.message);
    }
}

// Load profile
async function loadProfile() {
    const profileDiv = document.getElementById('profileContent');
    if (!profileDiv) {
        console.error('Profile content div not found');
        return;
    }
    
    profileDiv.innerHTML = '<div class="loading">Loading profile...</div>';

    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) throw userError;
        if (!user) throw new Error('Not authenticated');

        // Get user metadata
        const firstName = user.user_metadata?.first_name || 'Not set';
        const lastName = user.user_metadata?.last_name || 'Not set';
        const phone = user.user_metadata?.phone || 'Not set';
        const userId = user.user_metadata?.user_id || 'Not set';
        const fullName = user.user_metadata?.full_name || `${firstName} ${lastName}`.trim() || user.email;
        const avatarLetter = fullName && fullName.length > 0 ? fullName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase();

        // Get approved upload count only
        const { count: uploadCount, error: notesError } = await supabase
            .from('notes')
            .select('*', { count: 'exact', head: true })
            .eq('uploader_uid', user.id)
            .eq('status', 'approved');

        if (notesError) {
            console.error('Error fetching notes:', notesError);
        }

        const approvedUploadCount = uploadCount || 0;

        profileDiv.innerHTML = `
            <div class="profile-info modern-profile">
                <div class="profile-header">
                    <div class="profile-avatar">${avatarLetter}</div>
                    <h3>${escapeHtml(fullName)}</h3>
                </div>
                <div class="profile-details">
                    <div class="profile-item">
                        <span class="profile-label">🆔 User ID:</span>
                        <span class="profile-value profile-userid">${escapeHtml(userId)}</span>
                    </div>
                    <div class="profile-item">
                        <span class="profile-label">👤 First Name:</span>
                        <span class="profile-value">${escapeHtml(firstName)}</span>
                    </div>
                    <div class="profile-item">
                        <span class="profile-label">👤 Last Name:</span>
                        <span class="profile-value">${escapeHtml(lastName)}</span>
                    </div>
                    <div class="profile-item">
                        <span class="profile-label">📱 Phone:</span>
                        <span class="profile-value">${escapeHtml(phone)}</span>
                    </div>
                    <div class="profile-item">
                        <span class="profile-label">📧 Email:</span>
                        <span class="profile-value">${escapeHtml(user.email || 'N/A')}</span>
                    </div>
                    <div class="profile-item">
                        <span class="profile-label">🔑 System ID:</span>
                        <span class="profile-value profile-id">${escapeHtml(user.id || 'N/A')}</span>
                    </div>
                    <div class="profile-item">
                        <span class="profile-label">📚 Total Uploads:</span>
                        <span class="profile-value profile-uploads">${approvedUploadCount}</span>
                    </div>
                </div>
            </div>
            <button onclick="handleLogout()" class="danger">Logout</button>
        `;
    } catch (error) {
        console.error('Error loading profile:', error);
        profileDiv.innerHTML = `
            <div class="message error">
                <strong>Error loading profile:</strong> ${escapeHtml(error.message)}
                <br><br>
                <button onclick="loadProfile()" class="small">Try Again</button>
            </div>
        `;
    }
}

// Logout handler
async function handleLogout() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        showLogin();
    } catch (error) {
        alert('Error logging out: ' + error.message);
    }
}

// ==================== NOTIFICATION FUNCTIONS ====================

// Load notifications
async function loadNotifications() {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: notifications, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) {
            console.error('Error loading notifications:', error);
            return;
        }

        displayNotifications(notifications || []);
        updateNotificationBadge(notifications || []);
    } catch (error) {
        console.error('Error loading notifications:', error);
    }
}

// Display notifications
function displayNotifications(notifications) {
    const listDiv = document.getElementById('notificationList');
    if (!listDiv) return;

    if (!notifications || notifications.length === 0) {
        listDiv.innerHTML = '<div class="notification-empty"><p>No notifications yet</p></div>';
        return;
    }

    let html = '';
    notifications.forEach(notification => {
        const timeAgo = getTimeAgo(new Date(notification.created_at));
        const unreadClass = notification.is_read ? '' : 'unread';
        const typeClass = notification.type || 'info';
        
        html += `
            <div class="notification-item ${unreadClass} ${typeClass}" 
                 onclick="markNotificationAsRead('${notification.id}', '${notification.link || ''}')">
                <div class="notification-title">${escapeHtml(notification.title)}</div>
                <div class="notification-message">${escapeHtml(notification.message)}</div>
                <div class="notification-time">${timeAgo}</div>
            </div>
        `;
    });

    listDiv.innerHTML = html;
}

// Update notification badge
function updateNotificationBadge(notifications) {
    const badge = document.getElementById('notificationBadge');
    if (!badge) return;

    const unreadCount = notifications.filter(n => !n.is_read).length;
    
    if (unreadCount > 0) {
        badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
        badge.style.display = 'flex';
    } else {
        badge.style.display = 'none';
    }
}

// Toggle notification panel
function toggleNotifications() {
    const panel = document.getElementById('notificationPanel');
    if (!panel) return;

    if (panel.style.display === 'none' || !panel.style.display) {
        panel.style.display = 'block';
        loadNotifications(); // Refresh notifications when opening
    } else {
        panel.style.display = 'none';
    }
}

// Mark notification as read
async function markNotificationAsRead(notificationId, link) {
    try {
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', notificationId);

        if (error) throw error;

        // Reload notifications to update UI
        loadNotifications();

        // Close notification panel
        const panel = document.getElementById('notificationPanel');
        if (panel) {
            panel.style.display = 'none';
        }

        // Navigate to link if provided
        if (link) {
            if (link.startsWith('http')) {
                window.open(link, '_blank');
            } else {
                // Relative path (e.g., 'public.html')
                window.location.href = link;
            }
        }
    } catch (error) {
        console.error('Error marking notification as read:', error);
    }
}

// Mark all notifications as read
async function markAllAsRead() {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', user.id)
            .eq('is_read', false);

        if (error) throw error;

        loadNotifications();
    } catch (error) {
        console.error('Error marking all as read:', error);
        alert('Error marking notifications as read: ' + error.message);
    }
}

// Subscribe to real-time notifications
async function subscribeToNotifications() {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Remove existing subscription if any
        if (notificationSubscription) {
            supabase.removeChannel(notificationSubscription);
        }

        // Create new subscription
        notificationSubscription = supabase
            .channel('notifications')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'notifications',
                filter: `user_id=eq.${user.id}`
            }, (payload) => {
                // New notification received
                loadNotifications();
                // Show a toast notification
                showToastNotification(payload.new);
            })
            .subscribe();
    } catch (error) {
        console.error('Error subscribing to notifications:', error);
    }
}

// Show toast notification
function showToastNotification(notification) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        max-width: 350px;
        border-left: 4px solid #667eea;
        animation: slideInRight 0.3s ease-out;
    `;
    toast.innerHTML = `
        <div style="font-weight: 600; color: #333; margin-bottom: 5px;">${escapeHtml(notification.title)}</div>
        <div style="color: #666; font-size: 13px;">${escapeHtml(notification.message)}</div>
    `;

    document.body.appendChild(toast);

    // Remove after 5 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 5000);
}

// Get time ago string
function getTimeAgo(date) {
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
}

// Close notification panel when clicking outside
document.addEventListener('click', (e) => {
    const panel = document.getElementById('notificationPanel');
    const btn = document.getElementById('notificationBtn');
    
    if (panel && btn && !panel.contains(e.target) && !btn.contains(e.target)) {
        panel.style.display = 'none';
    }
});

// Utility: Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

