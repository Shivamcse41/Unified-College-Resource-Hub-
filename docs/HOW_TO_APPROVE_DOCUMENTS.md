# ✅ How to Approve Documents as Admin

This guide explains how to review and approve/reject PDF documents uploaded by users.

---

## 🚀 Step-by-Step Process

### Step 1: Access Admin Dashboard

1. **Make sure you're logged in** to your app
2. **Click "Admin Panel"** link (or go to `admin.html`)
3. **You should see the Admin Dashboard** with "Pending PDFs" section

> **Note:** If you see "Access Denied", you need to add yourself as admin first. See `HOW_TO_BECOME_ADMIN.md`

### Step 2: View Pending Documents

1. **The admin dashboard automatically loads** all pending PDFs
2. **Each pending document shows:**
   - **Title** - The title of the note
   - **Subject** - The subject/category
   - **Uploaded by** - Email of the user who uploaded it
   - **Uploaded at** - Date and time of upload
   - **Three buttons:**
     - **Preview** - View the PDF before approving
     - **Approve** - Approve the document (green button)
     - **Reject** - Reject the document (red button)

### Step 3: Review the Document (Optional but Recommended)

1. **Click the "Preview" button** on any pending document
2. **The PDF opens in a new tab** (signed URL, valid for 60 seconds)
3. **Review the content** to ensure it's appropriate
4. **Close the preview tab** when done

### Step 4: Approve or Reject

#### To Approve a Document:

1. **Click the green "Approve" button**
2. **Confirm the action** in the popup dialog
3. **The document is approved!** ✅
   - Status changes from `pending` to `approved`
   - Document becomes visible on the public notes page
   - User sees status change in "My Uploads"
   - Document is removed from pending list automatically

#### To Reject a Document:

1. **Click the red "Reject" button**
2. **Confirm the action** in the popup dialog
3. **The document is rejected!** ❌
   - Status changes from `pending` to `rejected`
   - User sees "rejected" status in "My Uploads"
   - Document is removed from pending list automatically
   - Document does NOT appear on public page

---

## 📋 What Happens After Approval

### For the User:
- ✅ Status changes from "pending" to "approved" in their "My Uploads" tab
- ✅ They can now view the PDF using the "View" button
- ✅ The document appears on the public notes page

### For the Public:
- ✅ The document becomes visible on `public.html` (All Notes page)
- ✅ Anyone can search and view the approved document
- ✅ The document shows: title, subject, uploader name, approval date

### For the Admin:
- ✅ The document is removed from the pending list
- ✅ You can see it on the public notes page
- ✅ The document shows your admin ID in `approved_by` field

---

## 🎯 Admin Dashboard Features

### What You Can See:
- **All pending uploads** - Documents waiting for review
- **Document details** - Title, subject, uploader, date
- **Quick actions** - Preview, Approve, Reject buttons

### What Happens Automatically:
- **List refreshes** after approve/reject (document disappears from pending)
- **Success message** appears after each action
- **Error messages** if something goes wrong

---

## 🔍 Troubleshooting

### No Pending Documents Showing?

**Possible reasons:**
- No users have uploaded documents yet
- All documents have been approved/rejected
- You're not logged in as an admin

**Solution:**
- Ask a user to upload a test PDF
- Check that you're added to the `admins` table
- Refresh the page

### Can't Preview PDF?

**Possible reasons:**
- File doesn't exist in storage
- Storage policies not set up correctly
- Network error

**Solution:**
- Check browser console (F12) for errors
- Verify storage bucket `notes-private` exists
- Make sure storage policies are set up (run `FIXED_ULTIMATE_FIX_RLS.sql`)

### Approve/Reject Not Working?

**Possible reasons:**
- RLS policies not set up correctly
- Not logged in as admin
- Database connection issue

**Solution:**
- Check browser console (F12) for error messages
- Verify you're in the `admins` table
- Make sure database policies are set up correctly

### Documents Not Appearing on Public Page After Approval?

**Possible reasons:**
- Public page not refreshing
- RLS policy issue for public access
- Document status not updated correctly

**Solution:**
- Refresh the public page
- Check that the document status is `approved` in database
- Verify public RLS policy exists (should be in `FIXED_ULTIMATE_FIX_RLS.sql`)

---

## 💡 Best Practices

### Before Approving:
1. ✅ **Preview the PDF** to check content quality
2. ✅ **Verify the title and subject** are appropriate
3. ✅ **Check file size** (should be reasonable)
4. ✅ **Ensure content is relevant** to the platform

### After Approving:
1. ✅ **Document is immediately public** - make sure it's appropriate
2. ✅ **User gets notified** via status change
3. ✅ **Document is searchable** on public page

### Rejection Guidelines:
- ❌ **Reject if:** Content is inappropriate, spam, or irrelevant
- ❌ **Reject if:** File is corrupted or unreadable
- ❌ **Reject if:** Title/subject is misleading

---

## 📊 Admin Workflow Summary

```
User Uploads PDF
    ↓
PDF Status: "pending"
    ↓
Appears in Admin Dashboard
    ↓
Admin Reviews (Preview)
    ↓
Admin Approves or Rejects
    ↓
If Approved:
  - Status: "approved"
  - Visible on public page
  - User can view it
  
If Rejected:
  - Status: "rejected"
  - Not visible on public page
  - User sees rejection
```

---

## 🎯 Quick Reference

| Action | Button | Result |
|--------|--------|--------|
| View PDF | **Preview** | Opens PDF in new tab |
| Approve | **Approve** (green) | Document becomes public |
| Reject | **Reject** (red) | Document is rejected |

---

## ✅ Checklist for Admins

When reviewing documents, check:
- [ ] PDF opens and is readable
- [ ] Title is clear and appropriate
- [ ] Subject is relevant
- [ ] Content is suitable for sharing
- [ ] File size is reasonable
- [ ] No spam or inappropriate content

---

## 🆘 Need Help?

If you encounter issues:
1. Check browser console (F12) for errors
2. Verify you're logged in as admin
3. Check that RLS policies are set up
4. Make sure storage bucket exists
5. Review the troubleshooting section above

---

**That's it! You're ready to approve documents.** 🎉


