// admin.js
// Admin-side logic for reviewing and approving/rejecting PDFs

const ADMIN_BRANCHES = [
    {
        id: 'civil',
        label: 'Civil Engineering',
        icon: '🏗️',
        keywords: ['civil engineering', 'civil']
    },
    {
        id: 'electrical',
        label: 'Electrical Engineering',
        icon: '⚡',
        keywords: ['electrical engineering', 'electrical', 'eee']
    },
    {
        id: 'electronics',
        label: 'Electronics Engineering',
        icon: '📡',
        keywords: ['electronics engineering', 'electronics', 'ece', 'entc', 'etc', 'communication']
    },
    {
        id: 'mechanical',
        label: 'Mechanical Engineering',
        icon: '⚙️',
        keywords: ['mechanical engineering', 'mechanical', 'mech']
    },
    {
        id: 'cse',
        label: 'Computer Science and Engineering',
        icon: '💻',
        keywords: ['computer science and engineering', 'computer science', 'computer', 'cse', 'cs']
    }
];

const ADMIN_SEMESTERS = [
    '1st Semester',
    '2nd Semester',
    '3rd Semester',
    '4th Semester',
    '5th Semester',
    '6th Semester'
];

const DEFAULT_BRANCH_ID = 'cse';
const DEFAULT_SEMESTER_LABEL = '5th Semester';

ADMIN_BRANCHES.forEach(branch => {
    branch.normalizedKeywords = branch.keywords.map(keyword => normalizeText(keyword));
});

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

        const grouped = groupNotesByBranchAndSemester(notes);
        listDiv.innerHTML = renderBranchSemesterLayout({
            grouped,
            type: 'pending',
            notes,
            cardRenderer: createPendingNoteCard,
            emptyMessage: 'No pending uploads at the moment.'
        });
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

        const grouped = groupNotesByBranchAndSemester(notes);
        listDiv.innerHTML = renderBranchSemesterLayout({
            grouped,
            type: 'approved',
            notes,
            cardRenderer: createApprovedNoteCard,
            emptyMessage: 'No approved notes yet.'
        });
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

function groupNotesByBranchAndSemester(notes) {
    const grouped = {};
    ADMIN_BRANCHES.forEach(branch => {
        grouped[branch.id] = createEmptyBranchGroup(branch.label);
    });

    notes.forEach(note => {
        const branchId = resolveBranchId(note.subject);
        const semesterLabel = normalizeSemesterLabel(note.semester);
        if (!grouped[branchId]) {
            grouped[branchId] = createEmptyBranchGroup('Other');
        }
        grouped[branchId].total += 1;
        grouped[branchId].semesters[semesterLabel].push(note);
    });

    return grouped;
}

function createEmptyBranchGroup(label) {
    const semesters = {};
    ADMIN_SEMESTERS.forEach(sem => {
        semesters[sem] = [];
    });
    return {
        label,
        total: 0,
        semesters
    };
}

function renderBranchSemesterLayout({ grouped, type, notes, cardRenderer, emptyMessage }) {
    if (!notes || notes.length === 0) {
        return `<div class="empty-state"><p>${escapeHtml(emptyMessage)}</p></div>`;
    }

    const branchNav = createBranchNav(grouped, type);
    const sections = ADMIN_BRANCHES.map(branch => createBranchSection({
        branch,
        branchData: grouped[branch.id],
        type,
        cardRenderer
    })).join('');

    return `
        ${branchNav}
        <div class="admin-branch-sections">
            ${sections}
        </div>
    `;
}

function createBranchNav(grouped, type) {
    return `
        <div class="branch-nav">
            ${ADMIN_BRANCHES.map(branch => {
                const count = grouped[branch.id]?.total || 0;
                return `
                    <button class="branch-nav-btn ${count ? 'active' : ''}" onclick="scrollToBranchSection('${type}-branch-${branch.id}')">
                        <span class="branch-icon">${branch.icon}</span>
                        <span class="branch-label">${branch.label}</span>
                        <span class="branch-count">${count}</span>
                    </button>
                `;
            }).join('')}
        </div>
    `;
}

function createBranchSection({ branch, branchData, type, cardRenderer }) {
    const hasNotes = branchData && branchData.total > 0;
    const semestersHtml = ADMIN_SEMESTERS.map(semester => {
        const notes = branchData?.semesters[semester] || [];
        const count = notes.length;
        const cardsHtml = count ? `<div class="card-grid">${notes.map(cardRenderer).join('')}</div>` : `<div class="empty-state"><p>No ${type} notes for ${semester.toLowerCase()}.</p></div>`;
        const openAttr = count > 0 || semester === DEFAULT_SEMESTER_LABEL ? ' open' : '';

        return `
            <details class="semester-block"${openAttr}>
                <summary>
                    <span>${semester}</span>
                    <span class="semester-count">${count}</span>
                </summary>
                ${cardsHtml}
            </details>
        `;
    }).join('');

    return `
        <section class="branch-section admin-branch-section" id="${type}-branch-${branch.id}">
            <div class="branch-header">
                <h3>${branch.icon} ${branch.label}</h3>
                <p>Total ${type} notes: ${branchData?.total || 0}</p>
            </div>
            ${hasNotes ? '' : '<div class="empty-state"><p>No uploads yet for this branch.</p></div>'}
            <div class="semester-grid">
                ${semestersHtml}
            </div>
        </section>
    `;
}

function createPendingNoteCard(note) {
    const date = new Date(note.uploaded_at).toLocaleString();
    return `
        <div class="card">
            <div class="card-title">${escapeHtml(note.title)}</div>
            <div class="card-meta"><strong>Branch:</strong> ${escapeHtml(note.subject || 'N/A')}</div>
            <div class="card-meta"><strong>Semester:</strong> ${escapeHtml(getNoteSemester(note))}</div>
            <div class="card-meta"><strong>Uploaded by:</strong> ${escapeHtml(note.uploader_name || '')}</div>
            <div class="card-meta"><strong>Uploaded at:</strong> ${date}</div>
            <div class="admin-actions" style="margin-top: 15px; display:flex; gap:10px; flex-wrap:wrap;">
                <button class="small secondary" onclick="previewPDF('${note.file_path}')">Preview</button>
                <button class="small success" onclick="approveNote('${note.id}')">Approve</button>
                <button class="small danger" onclick="rejectNote('${note.id}')">Reject</button>
            </div>
        </div>
    `;
}

function createApprovedNoteCard(note) {
    const approvedDate = note.approved_at
        ? new Date(note.approved_at).toLocaleString()
        : 'N/A';

    return `
        <div class="card">
            <div class="card-title">${escapeHtml(note.title)}</div>
            <div class="card-meta"><strong>Branch:</strong> ${escapeHtml(note.subject || '')}</div>
            <div class="card-meta"><strong>Semester:</strong> ${escapeHtml(getNoteSemester(note))}</div>
            <div class="card-meta"><strong>Uploaded by:</strong> ${escapeHtml(note.uploader_name || '')}</div>
            <div class="card-meta"><strong>Approved on:</strong> ${approvedDate}</div>
            <div class="admin-actions" style="margin-top: 15px; display:flex; gap:10px; flex-wrap:wrap;">
                <button class="small secondary" onclick="previewPDF('${note.file_path}')">Preview</button>
                <button class="small danger" onclick="deleteApprovedNote('${note.id}', '${note.file_path}')">Delete</button>
            </div>
        </div>
    `;
}

function scrollToBranchSection(sectionId) {
    const el = document.getElementById(sectionId);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function normalizeText(text) {
    return (text || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();
}

function resolveBranchId(subject) {
    const normalized = normalizeText(subject);
    if (!normalized) return DEFAULT_BRANCH_ID;

    const words = normalized.split(/\s+/);

    for (const branch of ADMIN_BRANCHES) {
        for (const keyword of branch.normalizedKeywords) {
            if (!keyword) continue;
            if (keyword.includes(' ')) {
                if (normalized.includes(keyword)) {
                    return branch.id;
                }
            } else if (words.includes(keyword)) {
                return branch.id;
            }
        }
    }

    return DEFAULT_BRANCH_ID;
}

function getNoteSemester(note) {
    return normalizeSemesterLabel(note.semester);
}

function normalizeSemesterLabel(value) {
    const normalizedValue = (value || '').toLowerCase();
    if (!normalizedValue) return DEFAULT_SEMESTER_LABEL;

    for (const semester of ADMIN_SEMESTERS) {
        if (normalizedValue.includes(semester.toLowerCase())) {
            return semester;
        }
    }

    return DEFAULT_SEMESTER_LABEL;
}

