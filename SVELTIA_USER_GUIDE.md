# 📝 Sveltia CMS User Guide - Simple Newsletter Management

## 🎯 **What This Does**

This system lets you upload newsletter PDFs and add searchable information (like keywords and topics) through a simple web form. Once you save, your newsletter becomes instantly searchable on the website.

---

## 🚀 **Getting Started (5 Minutes)**

### **Step 1: Open the CMS**
- Go to: `http://localhost:5000/admin/index.html` in your web browser
- You'll see a clean, modern interface (not the messy HTML code you saw)

### **Step 2: Access Newsletter Management**
- Look for "Newsletter Issues" in the left sidebar
- Click it to see all your newsletters
- Click the "+" button or "New Newsletter Issue" to create a new one

---

## 📄 **Creating a New Newsletter (The Simple Way)**

When you click "New Newsletter Issue", you'll see a form with these sections:

### **✅ Required Fields (Must Fill Out):**

The form is now organized in order of importance:

**1. Title**
- Example: "March 2025 Fire Department Legal Updates"
- Just type the newsletter title

**2. Volume & Edition**
- Volume: The year-based number (like 23 for 2025)
- Edition: The issue number for that year (1-12)
- Use the +/- buttons or type the numbers

**3. Publication Month & Year**
- Click the date field and select the month and year
- Much simpler - just pick the month and year when it was published
- Example: March 2025

**4. Summary**
- Write 1-2 sentences about what's in this newsletter
- Example: "Updates on fire department employment law and public records requirements"

**5. Newsletter PDF** ⭐ **MOST IMPORTANT**
- This appears early in the form now since it's the main thing you're uploading
- Click "Upload the newsletter PDF file - drag and drop or click to browse"
- Select your PDF file from your computer
- It will upload automatically

**6. Keywords**
- Type search terms people might use, one per line
- Examples: "SCOTUS", "Public Records", "RCW 42.56", "Employment Law"
- Think about what lawyers would search for

**7. Topics** 
- Click the dropdown and select 2-3 categories
- Options include: Employment Law, Public Records, Emergency Services, etc.

---

## 📋 **Optional Fields (Nice to Have):**

**Legal Cases**
- Add any court cases mentioned in the newsletter
- Format: "Smith v. Fire District (2025)"

**Legal Statutes**
- Add any laws referenced
- Format: "RCW 42.56.280"

**Key Findings**
- Main legal conclusions from the newsletter
- Example: "Fire departments must comply with new public records timeline"

**Recommendations**
- Actionable advice for fire departments
- Example: "Update your public records policies by March 2025"

---

## 💾 **Saving Your Work**

- **Save Draft**: Saves your work but doesn't publish
- **Publish**: Makes it searchable on the website immediately
- **Preview**: Shows how it will look on the website

---

## 🔧 **Managing Existing Newsletters**

### **To Edit Old Newsletters:**
1. Go to `http://localhost:5000/admin/newsletters` (the admin page)
2. You'll see a list of all 159 newsletters currently in the system
3. Look for ones marked "(Corrupted)" - these need fixing
4. Click "Migrate to CMS" button to make old newsletters editable
5. Return to the main CMS to edit them

### **Understanding the Status:**
- **Green numbers**: Good newsletters (Vol 22 Ed 7)
- **Red "Corrupted" tags**: Missing important information
- **"Data Issues" badges**: Problems that need fixing

---

## 🎯 **Quick Start Checklist**

For your first newsletter upload:

- [ ] 1. Open `http://localhost:5000/admin/index.html`
- [ ] 2. Click "Newsletter Issues" in the sidebar
- [ ] 3. Click "New Newsletter Issue"
- [ ] 4. Upload your PDF file
- [ ] 5. Fill in Title, Volume, Edition, Date
- [ ] 6. Write a brief summary
- [ ] 7. Add 3-5 keywords
- [ ] 8. Select 2-3 topics
- [ ] 9. Click "Publish"
- [ ] 10. Check that it appears in search results

**Time needed**: 5-10 minutes per newsletter

---

## ❗ **Common Issues & Solutions**

### **"I can't find the upload button"**
- Look for a box that says "Drop a file here or click to browse"
- It's in the "Newsletter PDF" section

### **"My PDF won't upload"**
- Make sure the file is actually a PDF (.pdf extension)
- Try a smaller file if it's very large
- Check that you have internet connection

### **"I don't know what Volume/Edition to use"**
- Look at the PDF filename - it often contains this info
- Volume usually matches the year (2025 = Volume 23)
- Edition is usually the month number (March = Edition 3)

### **"I saved it but can't find it on the website"**
- Make sure you clicked "Publish" not just "Save Draft"
- Wait 30 seconds and try searching for it
- Check the keywords you used are what people would search for

### **"The interface looks broken or messy"**
- Refresh the page (F5 or Ctrl+R)
- Make sure you're using a modern browser (Chrome, Firefox, Safari)
- Clear your browser cache if needed

---

## 🏆 **Tips for Success**

### **Good Keywords:**
- ✅ "Public Records Act"
- ✅ "RCW 42.56"
- ✅ "FLSA overtime"
- ❌ "stuff about laws"
- ❌ "legal things"

### **Good Summaries:**
- ✅ "Supreme Court ruling on fire department employment practices and new public records timeline requirements"
- ❌ "Legal stuff for fire departments"

### **Good Topics Selection:**
- Pick 2-3 most relevant topics
- Don't select everything - be specific
- Think about what category lawyers would look under

---

## 🆘 **When You Need Help**

### **Something's Not Working?**
1. Refresh the page first
2. Check the admin interface at `/admin/newsletters` for error messages
3. Try a different browser
4. Contact your tech support with the specific error message

### **Can't Remember How to Do Something?**
- This guide has everything you need
- The interface has hints under each field
- When in doubt, fill out the required fields and publish - you can always edit later

---

## 🎉 **You're Ready!**

The system is designed to be simple:
1. **Upload PDF**
2. **Fill out form** 
3. **Publish**
4. **It becomes searchable**

No technical knowledge needed - just think like someone who would be searching for legal information and fill out the form accordingly.

**Start with one newsletter to get comfortable, then you can batch-process the rest!**

---

*This guide covers everything a non-technical user needs to manage newsletter content through Sveltia CMS. No HTML, no code, just simple form-filling.*