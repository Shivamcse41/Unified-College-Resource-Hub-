// public.js
// Logic to fetch and display approved PDFs (public page)

const BRANCHES = [
    {
        id: 'civil',
        label: 'Civil Engineering',
        keywords: ['civil engineering', 'civil']
    },
    {
        id: 'electrical',
        label: 'Electrical Engineering',
        keywords: ['electrical engineering', 'electrical', 'eee']
    },
    {
        id: 'electronics',
        label: 'Electronics Engineering',
        keywords: ['electronics engineering', 'electronics', 'ece', 'entc', 'etc', 'communication']
    },
    {
        id: 'mechanical',
        label: 'Mechanical Engineering',
        keywords: ['mechanical engineering', 'mechanical', 'mech']
    },
    {
        id: 'cse',
        label: 'Computer Science and Engineering',
        keywords: ['computer science and engineering', 'computer science', 'computer', 'cse', 'cs']
    }
];

const DEFAULT_BRANCH_ID = 'cse';

BRANCHES.forEach(branch => {
    branch.normalizedKeywords = branch.keywords.map(keyword => normalizeText(keyword));
});

let allNotes = [];
const branchCardContainers = {};
const branchEmptyElements = {};
const branchSections = {};
let listContainer = null;
let currentBranchFilter = 'all';

// Load approved notes on page load
document.addEventListener('DOMContentLoaded', async () => {
    initializeBranchSections();
    showBranchLoadingState();
    await loadApprovedNotes();
});

function initializeBranchSections() {
    listContainer = document.getElementById('notesList');
    BRANCHES.forEach(branch => {
        const section = document.querySelector(`.branch-section[data-branch="${branch.id}"]`);
        if (!section) {
            console.warn(`Branch section missing for ${branch.id}`);
            return;
        }
        branchSections[branch.id] = section;
        branchCardContainers[branch.id] = section.querySelector('.branch-cards');
        branchEmptyElements[branch.id] = section.querySelector('.branch-empty');
    });
}

function showBranchLoadingState() {
    BRANCHES.forEach(branch => {
        const container = branchCardContainers[branch.id];
        const emptyEl = branchEmptyElements[branch.id];
        if (container) {
            container.innerHTML = '<div class="loading">Loading approved notes...</div>';
        }
        if (emptyEl) {
            emptyEl.style.display = 'none';
        }
    });
    removeGlobalMessage();
}

// Load all approved notes
async function loadApprovedNotes() {
    try {
        const { data: notes, error } = await supabase
            .from('notes')
            .select('*')
            .eq('status', 'approved')
            .order('approved_at', { ascending: false });

        if (error) throw error;

        allNotes = notes || [];

        displayNotes(allNotes);
    } catch (error) {
        showGlobalMessage(`Error loading notes: ${error.message}`, 'error');
    }
}

// Display notes (with optional filtering)
function displayNotes(notes) {
    const grouped = groupNotesByBranch(notes);
    const hasAnyNotes = BRANCHES.some(branch => (grouped[branch.id] || []).length > 0);
    if (!hasAnyNotes) {
        showGlobalMessage('No notes match your search.', 'info');
    } else {
        removeGlobalMessage();
    }
    
    BRANCHES.forEach(branch => {
        const container = branchCardContainers[branch.id];
        const emptyEl = branchEmptyElements[branch.id];
        if (!container || !emptyEl) {
            return;
        }

        const branchNotes = grouped[branch.id] || [];

        if (branchNotes.length === 0) {
            container.innerHTML = '';
            emptyEl.style.display = 'block';
        } else {
            const cardsHtml = branchNotes.map(createNoteCard).join('');
            container.innerHTML = `<div class="card-grid">${cardsHtml}</div>`;
            emptyEl.style.display = 'none';
        }
    });

    applyBranchFilter();
}

// Filter notes by search query
function filterNotes() {
    const searchQuery = document.getElementById('searchInput').value.toLowerCase().trim();
    
    if (!searchQuery) {
        displayNotes(allNotes);
        return;
    }

    const filtered = allNotes.filter(note => {
        const title = note.title.toLowerCase();
        const subject = note.subject ? note.subject.toLowerCase() : '';
        return title.includes(searchQuery) || subject.includes(searchQuery);
    });

    displayNotes(filtered);
}

function setBranchFilter(value) {
    currentBranchFilter = value || 'all';
    // Re-run current search to refresh groupings
    filterNotes();
}

function applyBranchFilter() {
    BRANCHES.forEach(branch => {
        const section = branchSections[branch.id];
        if (!section) return;
        const shouldShow = currentBranchFilter === 'all' || currentBranchFilter === branch.id;
        section.style.display = shouldShow ? '' : 'none';
    });
}

function groupNotesByBranch(notes) {
    const grouped = {};
    BRANCHES.forEach(branch => {
        grouped[branch.id] = [];
    });

    notes.forEach(note => {
        const branchId = resolveBranchId(note.subject);
        grouped[branchId].push(note);
    });

    return grouped;
}

function resolveBranchId(subject) {
    const normalized = normalizeText(subject);
    if (!normalized) return DEFAULT_BRANCH_ID;

    const words = normalized.split(/\s+/);

    for (const branch of BRANCHES) {
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

function createNoteCard(note) {
    const approvedDate = note.approved_at
        ? new Date(note.approved_at).toLocaleDateString()
        : 'N/A';

    return `
        <div class="card">
            <div class="card-title">${escapeHtml(note.title)}</div>
            <div class="card-meta"><strong>Branch:</strong> ${escapeHtml(note.subject || 'N/A')}</div>
            <div class="card-meta"><strong>Uploaded by:</strong> ${escapeHtml(note.uploader_name || 'Unknown')}</div>
            <div class="card-meta"><strong>Approved on:</strong> ${approvedDate}</div>
            <div class="card-actions" style="margin-top: 15px; display: flex; gap: 10px; flex-wrap: wrap;">
                <button onclick="viewPDF('${note.file_path}', '${escapeHtml(note.title)}')" class="small" title="View PDF in new tab">
                    <span>👁️</span> View PDF
                </button>
                <button onclick="downloadPDF('${note.file_path}', '${escapeHtml(note.title)}')" class="small success" title="Download PDF file">
                    <span>⬇️</span> Download PDF
                </button>
            </div>
        </div>
    `;
}

function showGlobalMessage(text, type = 'info') {
    if (!listContainer) return;
    removeGlobalMessage();
    const message = document.createElement('div');
    message.className = `message ${type} public-notes-message`;
    message.textContent = text;
    listContainer.prepend(message);
}

function removeGlobalMessage() {
    const existing = document.querySelector('.public-notes-message');
    if (existing && existing.parentNode) {
        existing.parentNode.removeChild(existing);
    }
}

function normalizeText(text) {
    return (text || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();
}

// View PDF
async function viewPDF(filePath, title) {
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

// Download PDF
async function downloadPDF(filePath, title) {
    try {
        // Show loading message
        const loadingMsg = document.createElement('div');
        loadingMsg.className = 'message info';
        loadingMsg.style.position = 'fixed';
        loadingMsg.style.top = '20px';
        loadingMsg.style.right = '20px';
        loadingMsg.style.zIndex = '9999';
        loadingMsg.textContent = 'Downloading PDF...';
        document.body.appendChild(loadingMsg);

        // Get signed URL
        const { data, error } = await supabase.storage
            .from('notes-private')
            .createSignedUrl(filePath, 60);

        if (error) throw error;

        // Fetch the PDF file
        const response = await fetch(data.signedUrl);
        if (!response.ok) throw new Error('Failed to download PDF');

        const blob = await response.blob();

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        // Clean filename (keep it readable but safe)
        const cleanTitle = (title || 'document')
            .replace(/[<>:"/\\|?*]/g, '_') // Remove invalid filename characters
            .replace(/\s+/g, '_') // Replace spaces with underscore
            .substring(0, 50); // Limit length
        link.download = `${cleanTitle}.pdf`;
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        // Remove loading message
        setTimeout(() => {
            if (loadingMsg.parentNode) {
                loadingMsg.parentNode.removeChild(loadingMsg);
            }
        }, 1000);
    } catch (error) {
        alert('Error downloading PDF: ' + error.message);
    }
}

// Utility: Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

