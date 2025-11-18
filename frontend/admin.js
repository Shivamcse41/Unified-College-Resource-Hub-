// admin.js
// Admin-side logic for reviewing and approving/rejecting PDFs

let currentUser = null;

// Check authentication and admin status on page load
document.addEventListener('DOMContentLoaded', async () => {
    await checkAuthAndAdmin();
});

// Check if user is authenticated and is an admin
async function checkAuthAndAdmin() {
    const loadingDiv = document.getElementById('loadingState');
    const notAdminDiv = document.getElementById('notAdminMessage');
    const adminContentDiv = document.getElementById('adminContent');

    try {
        // Check session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
            // Not logged in - redirect to admin login
            document.getElementById('loadingState').style.display = 'none';
            document.getElementById('redirectToLogin').style.display = 'block';
            return;
        }

        currentUser = session.user;

        // Check if user is admin
        const { data: adminData, error: adminError } = await supabase
            .from('admins')
            .select('*')
            .eq('uid', currentUser.id)
            .single();

        if (adminError || !adminData) {
            // Not an admin
            loadingDiv.style.display = 'none';
            notAdminDiv.style.display = 'block';
            adminContentDiv.style.display = 'none';
            return;
        }

        // User is admin
        loadingDiv.style.display = 'none';
        notAdminDiv.style.display = 'none';
        adminContentDiv.style.display = 'block';
        
        loadPendingNotes();
        loadApprovedNotesForAdmin();
    } catch (error) {
        loadingDiv.innerHTML = `<div class="message error">Error: ${error.message}</div>`;
    }
}

// Load pending notes
async function loadPendingNotes() {
    const listDiv = document.getElementById('pendingList');
    listDiv.innerHTML = '<div class="loading">Loading pending uploads...</div>';

    try {
        const { data: notes, error } = await supabase
            .from('notes')
            .select('*')
            .eq('status', 'pending')
            .order('uploaded_at', { ascending: true });

        if (error) throw error;

        if (!notes || notes.length === 0) {
            listDiv.innerHTML = '<div class="empty-state"><p>No pending uploads at the moment.</p></div>';
            return;
        }

        // Create cards for each pending note
        let html = '<div class="card-grid">';

        notes.forEach(note => {
            const date = new Date(note.uploaded_at).toLocaleString();
            html += `
                <div class="card">
                    <div class="card-title">${escapeHtml(note.title)}</div>
                    <div class="card-meta"><strong>Branch:</strong> ${escapeHtml(note.subject)}</div>
                    <div class="card-meta"><strong>Uploaded by:</strong> ${escapeHtml(note.uploader_name)}</div>
                    <div class="card-meta"><strong>Uploaded at:</strong> ${date}</div>
                    <div class="admin-actions" style="margin-top: 15px;">
                        <button class="small secondary" onclick="previewPDF('${note.file_path}')">Preview</button>
                        <button class="small success" onclick="approveNote('${note.id}')">Approve</button>
                        <button class="small danger" onclick="rejectNote('${note.id}')">Reject</button>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        listDiv.innerHTML = html;
    } catch (error) {
        listDiv.innerHTML = `<div class="message error">Error loading pending notes: ${error.message}</div>`;
    }
}

// Load approved notes for admin (with delete option)
async function loadApprovedNotesForAdmin() {
    const listDiv = document.getElementById('approvedList');
    if (!listDiv) return;

    listDiv.innerHTML = '<div class="loading">Loading approved notes...</div>';

    try {
        const { data: notes, error } = await supabase
            .from('notes')
            .select('*')
            .eq('status', 'approved')
            .order('approved_at', { ascending: false });

        if (error) throw error;

        if (!notes || notes.length === 0) {
            listDiv.innerHTML = '<div class="empty-state"><p>No approved notes yet.</p></div>';
            return;
        }

        let html = '<div class="card-grid">';

        notes.forEach(note => {
            const approvedDate = note.approved_at
                ? new Date(note.approved_at).toLocaleString()
                : 'N/A';

            html += `
                <div class="card">
                    <div class="card-title">${escapeHtml(note.title)}</div>
                    <div class="card-meta"><strong>Branch:</strong> ${escapeHtml(note.subject || '')}</div>
                    <div class="card-meta"><strong>Uploaded by:</strong> ${escapeHtml(note.uploader_name || '')}</div>
                    <div class="card-meta"><strong>Approved on:</strong> ${approvedDate}</div>
                    <div class="admin-actions" style="margin-top: 15px; display:flex; gap:10px; flex-wrap:wrap;">
                        <button class="small secondary" onclick="previewPDF('${note.file_path}')">Preview</button>
                        <button class="small danger" onclick="deleteApprovedNote('${note.id}', '${note.file_path}')">Delete</button>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        listDiv.innerHTML = html;
    } catch (error) {
        listDiv.innerHTML = `<div class="message error">Error loading approved notes: ${error.message}</div>`;
    }
}

// Delete/hide an approved note (admin-only)
async function deleteApprovedNote(noteId, filePath) {
    if (!confirm('Are you sure you want to remove this note from public view? It will be marked as rejected and hidden from public page.')) {
        return;
    }

    try {
        // Mark note as rejected instead of hard delete (works with existing RLS policies)
        const { error: dbError } = await supabase
            .from('notes')
            .update({ status: 'rejected' })
            .eq('id', noteId);

        if (dbError) throw dbError;

        showMessage('Note removed from public and marked as rejected.', 'success');
        loadApprovedNotesForAdmin();
    } catch (error) {
        showMessage('Error deleting note: ' + error.message, 'error');
    }
}

// Preview PDF
async function previewPDF(filePath) {
    try {
        const { data, error } = await supabase.storage
            .from('notes-private')
            .createSignedUrl(filePath, 60);

        if (error) throw error;

        window.open(data.signedUrl, '_blank');
    } catch (error) {
        showMessage('Error previewing PDF: ' + error.message, 'error');
    }
}

// Approve note
async function approveNote(noteId) {
    if (!confirm('Are you sure you want to approve this note?')) {
        return;
    }

    try {
        // First, get the note details before updating
        const { data: noteData, error: fetchError } = await supabase
            .from('notes')
            .select('title, subject, uploader_name')
            .eq('id', noteId)
            .single();

        if (fetchError) throw fetchError;

        // Update the note status
        const { error } = await supabase
            .from('notes')
            .update({
                status: 'approved',
                approved_by: currentUser.id,
                approved_at: new Date().toISOString()
            })
            .eq('id', noteId);

        if (error) throw error;

        // Notify all users about the new approved document
        try {
            const { error: notifyError } = await supabase.rpc('notify_document_approved', {
                document_title: noteData.title,
                document_subject: noteData.subject || 'No branch',
                uploader_name: noteData.uploader_name || 'Unknown'
            });

            if (notifyError) {
                console.error('Error notifying users about approved document:', notifyError);
                // Don't throw - approval was successful, notification is secondary
            }
        } catch (notifyErr) {
            console.error('Error in notification:', notifyErr);
            // Don't throw - approval was successful
        }

        showMessage('Note approved successfully!', 'success');
        loadPendingNotes(); // Refresh list
    } catch (error) {
        showMessage('Error approving note: ' + error.message, 'error');
    }
}

// Reject note
async function rejectNote(noteId) {
    if (!confirm('Are you sure you want to reject this note?')) {
        return;
    }

    try {
        const { error } = await supabase
            .from('notes')
            .update({
                status: 'rejected'
            })
            .eq('id', noteId);

        if (error) throw error;

        showMessage('Note rejected.', 'success');
        loadPendingNotes(); // Refresh list
    } catch (error) {
        showMessage('Error rejecting note: ' + error.message, 'error');
    }
}

// Show message
function showMessage(text, type) {
    const messageDiv = document.getElementById('adminMessage');
    messageDiv.innerHTML = `<div class="message ${type}">${escapeHtml(text)}</div>`;
    setTimeout(() => {
        messageDiv.innerHTML = '';
    }, 5000);
}

// Logout handler
async function handleLogout() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        // Redirect to admin login page after logout
        window.location.href = 'admin-login.html';
    } catch (error) {
        alert('Error logging out: ' + error.message);
    }
}

// Utility: Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

