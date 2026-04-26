# Knowledge Base - Developer Reference Card

## 📋 Quick API Reference

### LocalStorage Service (`localstorageService.js`)

#### Initialize (Automatic)
```javascript
import { getAllItems } from '../services/localstorageService';

// On first load, 8 default items are created automatically
const items = getAllItems(); // Returns array of default items
```

#### Get Data
```javascript
import { 
  getAllItems, 
  getItemById, 
  searchItems, 
  getByCategory 
} from '../services/localstorageService';

const allItems = getAllItems();           // All 8 items
const item = getItemById(1);              // Specific item or null
const results = searchItems('policy');    // Search results
const policies = getByCategory('POLICY'); // By category
```

#### Create Item
```javascript
import { addItem } from '../services/localstorageService';

const newItem = addItem({
  title: 'New Title',
  category: 'POLICY',
  tags: ['tag1', 'tag2'],
  content: 'Full content...'
});

// Returns: { id: 9, title, category, tags, content, created_at, updated_at }
```

#### Update Item
```javascript
import { updateItem } from '../services/localstorageService';

const updated = updateItem(1, {
  title: 'Updated Title',
  content: 'Updated content'
  // Other fields preserved, updated_at auto-set
});
```

#### Delete Item
```javascript
import { deleteItem } from '../services/localstorageService';

const success = deleteItem(1); // Returns true/false
```

#### AI Response Caching
```javascript
import { 
  getCachedResponse, 
  cacheResponse, 
  deleteCachedResponse,
  clearAllCache 
} from '../services/localstorageService';

const cached = getCachedResponse(1);      // Get cached response
cacheResponse(1, 'AI response text');     // Store response
deleteCachedResponse(1);                  // Delete for item 1
clearAllCache();                          // Clear all cache
```

#### Import/Export
```javascript
import { importData, exportData } from '../services/localstorageService';

const json = exportData();                // Get JSON string
const success = importData(json);         // Import from JSON (true/false)
```

---

### AI Service (`aiService.js`)

#### Generate Explanation
```javascript
import { generateExplanation } from '../services/aiService';

const explanation = await generateExplanation(
  1,                                      // itemId
  'Academic integrity policy content...', // content
  'Academic Integrity Policy'             // title
);
// Returns: "Student-friendly explanation..."
```

#### Ask Follow-up Question
```javascript
import { askFollowUp } from '../services/aiService';

const answer = await askFollowUp(
  1,                              // itemId
  'What if I paraphrase?',        // question
  'policy content...',            // content
  'Academic Integrity'            // title
);
// Returns: "Contextualized answer..."
```

#### Check AI Availability
```javascript
import { checkAIAvailability } from '../services/aiService';

const isAvailable = await checkAIAvailability();
// Returns: true/false
```

#### Generate Summary
```javascript
import { generateSummary } from '../services/aiService';

const summary = await generateSummary([item1, item2, item3]);
// Returns: "Summary of all items..."
```

---

## 🗂️ Component Props

### AdminKBForm Component
```javascript
import AdminKBForm from '../components/AdminKBForm';

// For adding new item
<AdminKBForm 
  onSuccess={() => {
    // Called after successful save
    // Refresh data here
  }}
/>

// For editing (not yet implemented, ready for future use)
<AdminKBForm 
  onSuccess={() => {}}
  initialData={{
    id: 1,
    title: 'Current Title',
    category: 'POLICY',
    tags: ['tag1'],
    content: 'Current content'
  }}
/>
```

### KnowledgeBase Component
```javascript
import KnowledgeBase from '../pages/KnowledgeBaseNew';

<KnowledgeBase />
```

No props needed. Component is self-contained.

---

## 📊 Data Structures

### Knowledge Base Item
```javascript
{
  id: 1,                                  // Auto-generated number
  title: string,                          // Max 200 chars recommended
  category: 'POLICY'|'FAQ'|'COURSE_INFO'|'RESEARCH_PROTOCOL',
  tags: string[],                         // Array of strings
  content: string,                        // Max 5000 chars recommended
  created_at: "2024-04-18T08:00:00Z",    // ISO 8601 timestamp
  updated_at: "2024-04-18T08:00:00Z"     // ISO 8601 timestamp
}
```

### AI Response
```javascript
{
  explanation: string,  // AI-generated text (2-3 paragraphs)
  success: "true"       // String literal
}
```

### AI Cache (LocalStorage)
```javascript
{
  "1": "AI explanation for item 1",
  "2": "AI explanation for item 2",
  // ... etc
}
```

---

## 🔌 API Endpoints

### Backend AI Endpoint
```
POST /api/ai/explain
Content-Type: application/json

Request:
{
  "content": "Item content to explain",
  "title": "Item title",
  "prompt": "Full prompt for AI",
  "question": "Optional follow-up question"
}

Response:
{
  "explanation": "AI-generated text",
  "success": "true"
}

Error:
{
  "error": "Error message",
  "success": "false"
}
```

### Health Check
```
GET /api/ai/health

Response:
{
  "status": "available"
}

Error:
{
  "status": "unavailable",
  "error": "Error details"
}
```

---

## 🎨 Component States

### KnowledgeBase Component State
```javascript
const [search, setSearch] = useState('');           // Current search query
const [activeCategory, setActiveCategory] = useState('all'); // Filter
const [expanded, setExpanded] = useState(null);     // Expanded item ID
const [aiLoading, setAiLoading] = useState(null);   // Loading: itemId or null
const [aiResponses, setAiResponses] = useState({}); // { itemId: response }
const [showAdminForm, setShowAdminForm] = useState(false);
const [articles, setArticles] = useState([]);       // All items
const [followUpQuestion, setFollowUpQuestion] = useState({}); // { itemId: question }
```

---

## 🎯 Common Tasks

### Add Item Programmatically
```javascript
import { addItem } from '../services/localstorageService';

const response = addItem({
  title: 'New FAQ',
  category: 'FAQ',
  tags: ['common', 'question'],
  content: 'The answer to a common question...'
});

console.log(response.id); // New ID
```

### Update Multiple Items
```javascript
import { updateItem } from '../services/localstorageService';

const updates = [
  { id: 1, title: 'Updated 1' },
  { id: 2, title: 'Updated 2' },
  { id: 3, title: 'Updated 3' }
];

updates.forEach(({ id, ...data }) => updateItem(id, data));
```

### Get Items by Tag
```javascript
import { getAllItems } from '../services/localstorageService';

const items = getAllItems();
const byTag = items.filter(item => 
  item.tags.includes('Important')
);
```

### Batch AI Explanations
```javascript
import { generateExplanation } from '../services/aiService';

const items = getAllItems();
const explanations = await Promise.all(
  items.map(item => 
    generateExplanation(item.id, item.content, item.title)
  )
);
```

### Export and Backup
```javascript
import { exportData } from '../services/localstorageService';

const json = exportData();
// Save to file or send to server
const blob = new Blob([json], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'knowledge_base_backup.json';
a.click();
```

### Restore from Backup
```javascript
import { importData } from '../services/localstorageService';

// File input change handler
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    const json = e.target.result;
    const success = importData(json);
    if (success) {
      console.log('Data restored successfully');
    }
  };
  reader.readAsText(file);
};
```

---

## 🔍 Debugging Tips

### Check All Data
```javascript
// In browser console
localStorage.getItem('knowledge_base')
```

### Check AI Cache
```javascript
localStorage.getItem('ai_cache')
```

### Clear Everything
```javascript
localStorage.clear() // WARNING: Deletes all data!
```

### Log on State Change
```javascript
useEffect(() => {
  console.log('Articles updated:', articles);
}, [articles]);
```

### Monitor API Calls
```javascript
// In browser DevTools Network tab
// Look for POST /api/ai/explain requests
```

### Check Item Count
```javascript
const { getAllItems } from '../services/localstorageService';
getAllItems().length
```

---

## 🚨 Error Handling

### AI Service Errors
```javascript
try {
  const response = await generateExplanation(id, content, title);
} catch (error) {
  console.error('AI Error:', error);
  // Show user-friendly message
}

// Or use async/await with error handling
const response = await generateExplanation(id, content, title)
  .catch(error => {
    console.error('Failed:', error);
    return 'Unable to generate explanation';
  });
```

---

## 📈 Performance Considerations

### Optimization Ideas
```javascript
// Memoize expensive operations
const memoizedItems = useMemo(() => 
  getAllItems().filter(...), 
  [dependencies]
);

// Debounce search input
const [search, setSearch] = useState('');
const debounched = useCallback(
  debounce((value) => setSearch(value), 300),
  []
);

// Lazy load AI explanations
const [loadedExplanations, setLoadedExplanations] = useState({});
// Only generate when needed
```

---

## 🔐 Security Notes

### Safe Data Handling
```javascript
// All data stored locally (no API exposure)
// Never include sensitive user data in items

// Safe string handling
const safeTitle = title.trim();
const safeTags = tags.split(',').map(t => t.trim());

// Validate inputs
if (!title || title.length === 0) {
  throw new Error('Title required');
}
```

---

## 📶 Network Request Flow

```
Frontend
  ↓
POST /api/ai/explain
  ↓
Backend AIController
  ↓
Groq API
  ↓
AI Response
  ↓
Backend returns response
  ↓
Frontend caches in LocalStorage
  ↓
Display to user
```

---

## 🧪 Testing Examples

```javascript
// Test adding item
const item = addItem({
  title: 'Test',
  category: 'FAQ',
  tags: ['test'],
  content: 'Test content'
});
console.assert(item.id === 9, 'ID should be 9');

// Test search
const results = searchItems('policy');
console.assert(results.length > 0, 'Should find items');

// Test caching
cacheResponse(1, 'Test response');
const cached = getCachedResponse(1);
console.assert(cached === 'Test response', 'Cache should work');
```

---

## 🔗 Related Files

- **LocalStorage Service**: `frontend/src/services/localstorageService.js`
- **AI Service**: `frontend/src/services/aiService.js`
- **Main Component**: `frontend/src/pages/KnowledgeBaseNew.jsx`
- **Admin Form**: `frontend/src/components/AdminKBForm.jsx`
- **Backend Controller**: `backend-spring/.../AIController.java`
- **Documentation**: `KNOWLEDGE_BASE_GUIDE.md`
- **Quick Start**: `KNOWLEDGE_BASE_QUICKSTART.md`
- **Testing**: `TESTING_GUIDE.md`

---

## 📞 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Data not saving | Check LocalStorage enabled in browser |
| AI not working | Verify backend is running and AI API key configured |
| Items not loading | Check browser console for errors, try F5 refresh |
| Search not working | Ensure localStorage data exists, check search query |
| Form validation fails | All fields required, tags need at least one |
| Cache not working | Clear LocalStorage, manually cache responses |
| Performance slow | Check number of items, optimize filter logic |

---

## 🎓 Learning Resources

1. **LocalStorage API**: [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
2. **React Hooks**: [React Docs](https://react.dev/reference/react)
3. **REST API Design**: [REST Best Practices](https://restfulapi.net/)
4. **JSON Format**: [JSON.org](https://www.json.org/)

---

## 📝 Notes

- All data persists in browser LocalStorage
- No database required
- 8 items initialized on first load
- AI caching enabled by default
- Component is self-contained (no external dependencies)
- Fully responsive design

---

**Last Updated**: April 18, 2024
**Version**: 1.0
**Stable**: Yes

