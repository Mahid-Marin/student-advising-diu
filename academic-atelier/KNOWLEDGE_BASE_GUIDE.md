# Knowledge Base Feature - Complete Implementation Guide

## Overview
The Knowledge Base feature provides:
- **LocalStorage-backed data persistence** - All data stored in browser
- **AI-powered explanations** - Integration with Groq/OpenAI for student-friendly content
- **Response caching** - Reduces API calls by caching AI responses
- **Admin management** - Add, edit, delete knowledge base items
- **Search & filtering** - Find content by keywords and categories
- **Follow-up questions** - Students can ask clarifying questions with AI responses

---

## Architecture

### Frontend Structure

```
src/
├── services/
│   ├── localstorageService.js      # LocalStorage CRUD operations
│   ├── aiService.js                # AI API integration
│   └── api.js                       # Existing API client (unchanged)
├── pages/
│   ├── KnowledgeBaseNew.jsx        # Main Knowledge Base UI
│   └── KnowledgeBase.jsx           # Old component (deprecated, can be removed)
├── components/
│   └── AdminKBForm.jsx             # Admin form for adding/editing items
└── styles/
    └── (existing styles)
```

### Data Storage (LocalStorage)

#### Knowledge Base Items Key: `"knowledge_base"`
```json
[
  {
    "id": 1,
    "title": "Academic Integrity Policy",
    "category": "POLICY",
    "tags": ["Policy", "Ethics"],
    "content": "Full policy text...",
    "created_at": "2024-04-18T10:30:00Z",
    "updated_at": "2024-04-18T10:30:00Z"
  }
  // ... more items
]
```

#### AI Response Cache Key: `"ai_cache"`
```json
{
  "1": "AI-generated explanation for item 1",
  "2": "AI-generated explanation for item 2"
}
```

---

## Service Documentation

### 1. LocalStorage Service (`localstorageService.js`)

#### Initialization
```javascript
// Automatically initializes with default data on first load
const items = getAllItems(); // Returns all items or creates defaults
```

#### Core Functions

**getAllItems()**
- Returns all knowledge base items from LocalStorage
- Auto-initializes with default data if empty

**getItemById(id)**
- Returns a specific item by ID
- Returns `null` if not found

**addItem(data)**
- Adds new item to LocalStorage with auto-incremented ID
- Auto-generates timestamps
```javascript
const newItem = addItem({
  title: "New Policy",
  category: "POLICY",
  tags: ["Policy"],
  content: "Full content..."
});
```

**updateItem(id, data)**
- Updates an existing item
- Auto-updates `updated_at` timestamp
```javascript
updateItem(1, {
  title: "Updated Title",
  content: "Updated content..."
});
```

**deleteItem(id)**
- Deletes an item and its cached AI response
- Returns boolean success status

**searchItems(query)**
- Searches across title, content, and tags
- Case-insensitive matching

**getByCategory(category)**
- Returns items for a specific category
- Pass `"all"` to get all items

#### Caching Functions

**getCachedResponse(itemId)**
- Retrieves cached AI response for an item
- Returns `null` if not cached

**cacheResponse(itemId, response)**
- Stores AI response in cache
- Prevents redundant API calls

**deleteCachedResponse(itemId)**
- Removes cached response for an item

**clearAllCache()**
- Clears all AI responses

#### Data Import/Export

**exportData()**
- Returns JSON string of all knowledge base items
- Useful for backups

**importData(jsonData)**
- Imports knowledge base from JSON string
- Returns boolean success status

---

### 2. AI Service (`aiService.js`)

#### generateExplanation(itemId, content, title)
- **Purpose**: Generate AI explanation for knowledge base content
- **Behavior**: Checks cache first, generates if not cached
- **Returns**: Promise<string> - AI-generated explanation
- **Example**:
```javascript
const explanation = await generateExplanation(
  1,
  "Academic integrity policy content...",
  "Academic Integrity Policy"
);
```

#### askFollowUp(itemId, question, content, title)
- **Purpose**: Answer student follow-up questions
- **Returns**: Promise<string> - AI-generated answer
- **Example**:
```javascript
const answer = await askFollowUp(
  1,
  "What happens if I accidentally plagiarize?",
  "policy content",
  "Academic Integrity"
);
```

#### checkAIAvailability()
- **Purpose**: Verify AI service health
- **Returns**: Promise<boolean>

#### generateSummary(items)
- **Purpose**: Generate summary of multiple items
- **Returns**: Promise<string> - Summary text

---

### 3. Admin Form Component (`AdminKBForm.jsx`)

#### Props
```javascript
<AdminKBForm 
  onSuccess={handleSuccess}      // Callback after save
  initialData={null}             // For editing (pass item object for edit mode)
/>
```

#### Form Fields
- **Title** (required)
- **Category** (required) - 4 categories: Policy, FAQ, Course Info, Research Protocol
- **Tags** (required) - Comma-separated list
- **Content** (required) - Full text content

#### Validation
- All fields are required
- At least one tag needed
- Real-time error display
- Clear and Submit buttons

---

### 4. Main Knowledge Base Component (`KnowledgeBaseNew.jsx`)

#### Features

**Search** 
- Real-time search across title, content, and tags

**Category Filtering**
- All, Policy, FAQ, Course Info, Research Protocol

**Expandable Cards**
- Click to expand and view full content

**AI Explanation**
- "Ask AI to Explain" button
- Shows loading spinner while generating
- Caches responses automatically

**Follow-up Questions**
- Ask clarifying questions about the content
- Responses cached for future access

**Admin Management**
- Add new items (admin form popup)
- Delete items (with confirmation)
- Edit items (click delete, then add again with updated data)

#### State Management
```javascript
- search: string              // Current search query
- activeCategory: string      // Selected category filter
- expanded: number            // Currently expanded item ID
- aiLoading: number|string    // Loading state for AI requests
- aiResponses: object         // Cached AI responses
- showAdminForm: boolean      // Admin form visibility
- articles: array             // All knowledge base items
- followUpQuestion: object    // Follow-up questions per item
```

---

## Categories & Icons

| Key | Label | Color | Icon |
|-----|-------|-------|------|
| POLICY | Policy | #ef4444 (Red) | 📋 |
| FAQ | FAQ | #f59e0b (Amber) | ❓ |
| COURSE_INFO | Course Info | #6366f1 (Indigo) | 📚 |
| RESEARCH_PROTOCOL | Research | #10b981 (Emerald) | 🔬 |

---

## Backend Integration

### New Endpoint: POST `/api/ai/explain`

**Request Body**
```json
{
  "content": "Knowledge base content",
  "title": "Item title",
  "prompt": "Full AI prompt",
  "question": "Optional follow-up question"
}
```

**Response**
```json
{
  "explanation": "AI-generated text",
  "success": "true"
}
```

**Error Response**
```json
{
  "error": "Error message",
  "success": "false"
}
```

### Controller: `AIController.java`
- Handles AI explain requests
- Delegates to `GroqService`
- Includes health check endpoint

---

## Example Data (Default)

The system initializes with 8 example items:

1. **Academic Integrity Policy** (POLICY)
   - Tags: Policy, Ethics
   
2. **Grade Appeal Process** (FAQ)
   - Tags: Grades, Process
   
3. **CS101 Course Overview** (COURSE_INFO)
   - Tags: CS, Python
   
4. **Research Protocol Guidelines** (RESEARCH_PROTOCOL)
   - Tags: Research, IRB
   
5. **Scholarship Application Guide** (FAQ)
   - Tags: Scholarship, Finance
   
6. **Attendance Requirements** (POLICY)
   - Tags: Attendance, Policy
   
7. **Database Systems Syllabus** (COURSE_INFO)
   - Tags: DB, SQL
   
8. **Thesis Submission Format** (RESEARCH_PROTOCOL)
   - Tags: Thesis, Format

---

## Usage Guide

### For Students

1. **Browse Knowledge Base**
   - Visit `/knowledge-base` route
   - Browse by category or search

2. **Get AI Explanation**
   - Expand any item
   - Click "Ask AI to Explain"
   - Wait for response (shows "AI is generating...")

3. **Ask Follow-up Questions**
   - After getting explanation, enter a question
   - Click 💬 button
   - Get personalized answer

### For Admins

1. **Add New Item**
   - Click "➕ Add New Item" button
   - Fill form (Title, Category, Tags, Content)
   - Click "Add Item"

2. **Delete Item**
   - Expand item
   - Click "🗑 Delete" button
   - Confirm deletion

3. **Search/Filter**
   - Use search bar for keywords
   - Click category pills to filter

---

## API Calls Flow

### Getting AI Explanation

```javascript
// Frontend
1. User clicks "Ask AI to Explain"
2. generateExplanation() checks cache
3. If cached, returns immediately
4. If not cached, calls POST /api/ai/explain
5. Backend calls Groq API
6. Response cached in LocalStorage
7. Displayed to user
```

### Follow-up Questions

```javascript
// Frontend
1. User submits follow-up question
2. askFollowUp() prepares context
3. Calls POST /api/ai/explain with question
4. Backend generates contextualized response
5. Response displayed
```

---

## Browser Compatibility

- **LocalStorage Support**: All modern browsers
- **Tested on**: Chrome, Firefox, Safari, Edge
- **Mobile**: Full responsive support

---

## Performance Notes

- **Initial Load**: ~50ms (reading LocalStorage)
- **Search**: Real-time, instant
- **AI Generation**: 2-5 seconds (depends on API)
- **Caching**: Eliminates redundant API calls
- **Storage Limit**: LocalStorage typically 5-10MB per domain

---

## Security Considerations

1. **Data Privacy**: All data stored locally in browser
2. **API Keys**: Keep Groq API keys in backend (.env)
3. **CORS**: Frontend can only access CORS-enabled endpoints
4. **Authentication**: Knowledge base requires login

---

## Troubleshooting

### AI Not Working
- Check network tab for failed `/api/ai/explain` requests
- Verify backend has Groq API configured
- Check that application.properties has GROQ_API_KEY

### Data Not Persisting
- Check browser console for errors
- Verify LocalStorage is enabled
- Clear browser cache if needed

### Search Not Finding Results
- Search is case-insensitive
- Searches title, content, and tags
- Use exact words for best results

---

## Future Enhancements

- PDF export of knowledge base
- Bulk edit/delete operations
- Version history and rollback
- Multi-language support
- Advanced analytics on AI usage
- Knowledge base recommendations based on learning progress

