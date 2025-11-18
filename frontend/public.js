// public.js
// Logic to fetch and display approved PDFs (public page)

let allNotes = [];

// Load approved notes on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadApprovedNotes();
});

// Load all approved notes
async function loadApprovedNotes() {
    const listDiv = document.getElementById('notesList');
    listDiv.innerHTML = '<div class="loading">Loading approved notes...</div>';

    try {
        const { data: notes, error } = await supabase
            .from('notes')
            .select('*')
            .eq('status', 'approved')
            .order('approved_at', { ascending: false });

        if (error) throw error;

        allNotes = notes || [];

        if (allNotes.length === 0) {
            listDiv.innerHTML = '<div class="empty-state"><p>No approved notes available yet.</p></div>';
            return;
        }

        displayNotes(allNotes);
    } catch (error) {
        listDiv.innerHTML = `<div class="message error">Error loading notes: ${error.message}</div>`;
    }
}

// Display notes (with optional filtering)
function displayNotes(notes) {
    const listDiv = document.getElementById('notesList');

    if (notes.length === 0) {
        listDiv.innerHTML = '<div class="empty-state"><p>No notes match your search.</p></div>';
        return;
    }

    // Create card grid
    let html = '<div class="card-grid">';

    notes.forEach(note => {
        const approvedDate = note.approved_at 
            ? new Date(note.approved_at).toLocaleDateString()
            : 'N/A';
        
        html += `
            <div class="card">
                <div class="card-title">${escapeHtml(note.title)}</div>
                <div class="card-meta"><strong>Branch:</strong> ${escapeHtml(note.subject)}</div>
                <div class="card-meta"><strong>Uploaded by:</strong> ${escapeHtml(note.uploader_name)}</div>
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
    });

    html += '</div>';
    listDiv.innerHTML = html;
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

