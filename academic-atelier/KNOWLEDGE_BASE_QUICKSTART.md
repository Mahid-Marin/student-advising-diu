# Knowledge Base - Quick Start Guide

## 🚀 Getting Started

### 1. No Additional Setup Required!
The Knowledge Base feature works automatically:
- LocalStorage service initializes with 8 default items
- No database migration needed
- No API keys required for LocalStorage functionality

### 2. Access the Feature
```
Navigate to: http://localhost:5173/knowledge-base (after login)
```

### 3. First-Time User Experience
- You'll see 8 pre-loaded knowledge base items
- All items are editable and deletable
- Search and filter work immediately

---

## 📝 Quick Usage

### Adding New Items
```
1. Click "➕ Add New Item" button
2. Fill in the form:
   - Title: "Your Policy/FAQ/Course Name"
   - Category: Select one of 4 categories
   - Tags: "Tag1, Tag2, Tag3" (comma-separated)
   - Content: Full text of the item
3. Click "Add Item"
```

### Using AI Features
```
1. Expand any knowledge base item
2. Click "✨ Ask AI to Explain"
3. Wait for AI-generated student-friendly explanation
4. (Optional) Ask a follow-up question
5. Get personalized response
```

### Searching
```
- Type in search bar: "academic integrity"
- Results filter in real-time
- Works with titles, content, and tags
```

### Filtering by Category
```
- Click category pills: "All", "Policy", "FAQ", "Course Info", "Research"
- Combine with search for precise results
```

### Deleting Items
```
1. Expand the item
2. Click "🗑 Delete" button at bottom
3. Confirm the deletion
4. Item is removed immediately
```

---

## 🗂️ File Structure

```
frontend/src/
│
├── services/
│   ├── localstorageService.js      👈 Data storage layer
│   ├── aiService.js                👈 AI integration
│   └── api.js                       (existing)
│
├── pages/
│   └── KnowledgeBaseNew.jsx         👈 Main UI component
│
├── components/
│   └── AdminKBForm.jsx              👈 Admin form component
│
└── App.jsx                          (updated to use KnowledgeBaseNew)

backend-spring/src/main/java/com/academicatelier/
│
└── controller/
    └── AIController.java            👈 Backend AI handler
```

---

## 🔧 Configuration

### Enable AI Features (Optional)
The AI service requires backend configuration.

**Backend Setup** (`application.properties`):
```properties
groq.api.key=your_groq_api_key
groq.api.url=https://api.groq.com/openai/v1
groq.model=mixtral-8x7b-32768
```

If not configured, AI features will show error but app continues to work.

---

## 📊 Default Data Categories

### 1. **Policy** (📋 Red)
Academic policies and requirements
- Examples: Academic Integrity, Attendance Requirements

### 2. **FAQ** (❓ Amber)
Frequently asked questions
- Examples: Grade Appeals, Scholarships

### 3. **Course Info** (📚 Indigo)
Course details and syllabi
- Examples: CS101, Database Systems

### 4. **Research Protocol** (🔬 Green)
Research guidelines and requirements
- Examples: IRB Guidelines, Thesis Format

---

## 💾 LocalStorage Details

### What Gets Stored
```javascript
localStorage.getItem('knowledge_base')       // All items (JSON array)
localStorage.getItem('ai_cache')            // AI responses (JSON object)
```

### Memory Usage
- Typical: 50-100KB for 10-20 items + AI responses
- Maximum: LocalStorage usually allows 5-10MB per domain

### No Cleanup Needed
- Data persists across sessions
- AI cache automatically managed

---

## 🤖 AI Features

### Explanation Generation
```javascript
"You are an academic assistant. Explain the following clearly for a student: {content}"
```
- Takes: 2-5 seconds
- Returns: Student-friendly explanation in 2-3 paragraphs
- Cached: Subsequent requests are instant

### Follow-up Questions
```javascript
"Student asked: {question}. Original content: {content}. Answer their question..."
```
- More specific to student's concern
- Keeps context from original explanation
- Not cached (each question unique)

---

## 🔍 Search Features

### Search Scope
Searches these fields:
- ✓ Title
- ✓ Content
- ✓ Tags

### Examples
```
Search: "python"
Results: Any item with "python" in title, content, or tags

Search: "policy"
Results: All items with "policy" anywhere

Search: "CS101"
Results: Course info items
```

---

## 🎨 UI Components

### Search Bar
- Real-time filtering
- Case-insensitive
- Clears on focus for ease of typing

### Category Pills
- Click to filter by category
- "All" shows everything
- Shows count of matching articles

### Item Cards
- Click to expand/collapse
- Shows title, category badge, and tags
- Icons indicate category at a glance

### Expandable Content
- Original content always visible on expand
- AI explanation below (if available)
- Follow-up section appears after explanation

### Admin Form
- Popup form for adding items
- Form validation with error messages
- Clear and Submit buttons
- Auto-closes on success

---

## ⚡ Performance Tips

### For Many Items (100+)
- Search gets slower with many items
- Consider pagination in future
- AI caching reduces API calls

### For Large Content
- Keep individual item content under 5000 characters
- Content displays better when modular

---

## 🐛 Debugging

### Check Console
```javascript
// View all items
localStorage.getItem('knowledge_base')

// View AI cache
localStorage.getItem('ai_cache')

// Clear everything (WARNING: deletes all data)
localStorage.clear()
```

### Check LocalStorage Usage
```javascript
// Estimate storage usage
const kb = localStorage.getItem('knowledge_base');
console.log(kb.length + ' bytes');
```

---

## ✅ Browser DevTools

### In Chrome/Firefox DevTools:
1. Open DevTools (F12)
2. Go to Application → LocalStorage
3. Click your domain
4. See all stored data
5. Can edit/delete entries directly

---

## 🔐 Security Notes

- ✓ All data stored locally (no external database)
- ✓ No personal information exposed
- ✓ Requires authentication to access
- ✓ AI prompts don't include user data

---

## 📚 Next Steps

1. **Test with Default Data**: Browse the 8 default items
2. **Try AI Features**: Expand an item and click "Ask AI to Explain"
3. **Add Your Own**: Click "Add New Item" and create custom content
4. **Search & Filter**: Try various searches and categories
5. **Ask Questions**: Use the follow-up feature to test AI

---

## 🎓 Teaching Tips

### For Students
- Bookmark the page
- Use search for quick reference
- Ask AI to explain topics they don't understand
- Ask follow-up questions specific to their needs

### For Admins
- Add your institution's specific policies
- Update content as policies change
- Create course-specific syllabi
- Add FAQs from common student questions

---

## 📞 Support

If features don't work:
1. Check browser console (F12) for errors
2. Verify you're logged in
3. Ensure JavaScript is enabled
4. Try clearing cache or using incognito mode
5. Check that backend is running (if AI enabled)

