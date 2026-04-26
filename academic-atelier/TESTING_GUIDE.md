# Knowledge Base Feature - Testing Guide

## 🧪 Pre-Testing Checklist

- [ ] Development server running on `http://localhost:5173`
- [ ] Backend server running
- [ ] You are logged in
- [ ] Browser Developer Tools available (F12)
- [ ] JavaScript console accessible

---

## ✅ Test Suite 1: Initialization & Default Data

### Test 1.1: Default Items Load
```
Steps:
1. Navigate to http://localhost:5173/knowledge-base
2. Verify page loads
3. Count visible items (should see 8)

Expected:
✓ Page loads without errors
✓ All 8 items visible
✓ Items show title, category badge, tags
✓ Proper category icons (📋 ❓ 📚 🔬)
```

### Test 1.2: Default Data in LocalStorage
```
Steps:
1. Open DevTools (F12)
2. Go to Application → LocalStorage
3. Find your domain
4. Locate 'knowledge_base' key
5. Click to view value

Expected:
✓ JSON array with 8 items visible
✓ Each item has: id, title, category, tags, content, created_at, updated_at
✓ All categories present (POLICY, FAQ, COURSE_INFO, RESEARCH_PROTOCOL)
```

### Test 1.3: LocalStorage Persistence
```
Steps:
1. Reload the page (F5)
2. Count items again
3. Expand an item
4. Reload page again
5. Item should still be expanded (if caching works)

Expected:
✓ Data persists across page reloads
✓ Item expansion state maintained
✓ No data loss
```

---

## ✅ Test Suite 2: Search Functionality

### Test 2.1: Title Search
```
Steps:
1. Type "policy" in search bar
2. Wait for results to filter

Expected:
✓ Results show only items with "policy" in title
✓ Should show: "Academic Integrity Policy", "Attendance Requirements"
✓ Other items hidden
✓ Count shows "2 articles"
```

### Test 2.2: Content Search
```
Steps:
1. Clear search
2. Type "plagiarism"
3. Observe results

Expected:
✓ Shows "Academic Integrity Policy" (content contains "plagiarism")
✓ Item count: 1
```

### Test 2.3: Tag Search
```
Steps:
1. Clear search
2. Type "research"
3. Observe results

Expected:
✓ Shows items tagged with "research"
✓ Should show research protocol items
✓ Case-insensitive matching
```

### Test 2.4: No Results
```
Steps:
1. Search for "xyz123" (non-existent term)

Expected:
✓ Shows "No articles found" message
✓ Shows search icon (🔍)
✓ Item count: 0
```

### Test 2.5: Clear Search
```
Steps:
1. Type something in search
2. Clear the text
3. Observe all items return

Expected:
✓ All 8 items visible again
```

---

## ✅ Test Suite 3: Category Filtering

### Test 3.1: Filter by Policy
```
Steps:
1. Click "Policy" pill

Expected:
✓ Shows only Policy items (2 items)
✓ Only red (#ef4444) badges visible
✓ Count: "2 articles"
✓ Active pill is highlighted red
```

### Test 3.2: Filter by FAQ
```
Steps:
1. Click "FAQ" pill

Expected:
✓ Shows only FAQ items (2 items)
✓ Only amber (#f59e0b) badges visible
✓ Count: "2 articles"
✓ Active pill is highlighted amber
```

### Test 3.3: Filter by Course Info
```
Steps:
1. Click "Course Info" pill

Expected:
✓ Shows 2 course items
✓ Indigo (#6366f1) badges
✓ Icons show 📚
```

### Test 3.4: Filter by Research
```
Steps:
1. Click "Research" pill

Expected:
✓ Shows 2 research items
✓ Emerald (#10b981) badges
✓ Icons show 🔬
```

### Test 3.5: Show All
```
Steps:
1. Click "All" pill

Expected:
✓ All 8 items visible
✓ All categories shown
✓ "All" pill is highlighted gradient
```

### Test 3.6: Combine Search + Filter
```
Steps:
1. Click "Policy" filter
2. Search "attendance"
3. Observe results

Expected:
✓ Shows only "Attendance Requirements" (1 item)
✓ Demonstrates both filters work together
```

---

## ✅ Test Suite 4: Expand/Collapse Functionality

### Test 4.1: Expand Single Item
```
Steps:
1. Click "Academic Integrity Policy" card
2. Observe expansion

Expected:
✓ Content appears below
✓ Chevron icon rotates 180°
✓ Card border color changes to slightly red
✓ Smooth animation
✓ Original content visible
```

### Test 4.2: Collapse Item
```
Steps:
1. Click same expanded item again

Expected:
✓ Content collapses
✓ Chevron rotates back
✓ Smooth animation
✓ Border returns to normal
```

### Test 4.3: Single Item Open At Once
```
Steps:
1. Expand item 1
2. Expand item 2 without closing item 1
3. Observe item 1

Expected:
✓ Item 1 collapses automatically
✓ Item 2 expands
✓ Only one item expanded at a time
```

### Test 4.4: Expand Shows Correct Content
```
Steps:
1. Expand "Grade Appeal Process"
2. Read content

Expected:
✓ Content starts with "Students may appeal grades..."
✓ Content is accurate to original data
✓ No truncation or missing text
```

---

## ✅ Test Suite 5: AI Features (If Configured)

### Test 5.1: Ask AI to Explain
```
Steps:
1. Expand an item (e.g., "Academic Integrity Policy")
2. Click "✨ Ask AI to Explain" button
3. Wait 2-5 seconds

Expected:
✓ Loading spinner appears
✓ Text says "AI is generating explanation..."
✓ Spinner visible for 2-5 seconds
✓ Response appears in blue box (indigo background)
✓ Response is 2-3 paragraphs
✓ Response is student-friendly and clear
```

### Test 5.2: AI Caching Works
```
Steps:
1. Ask AI to explain item 1
2. Collapse the item
3. Expand item 1 again
4. Look for "Ask AI to Explain" button

Expected:
✓ On second expand, AI response is still there
✓ "Ask AI to Explain" button may be gone or disabled
✓ Response loaded instantly (no spinner)
```

### Test 5.3: Different Items Have Different Responses
```
Steps:
1. Get AI explanation for item 1
2. Collapse item 1
3. Expand item 2
4. Get AI explanation for item 2
5. Compare responses

Expected:
✓ Each response is unique to the item
✓ Item 1 response talks about Academic Integrity
✓ Item 2 response talks about Grade Appeals
✓ Both are in blue boxes
```

### Test 5.4: Follow-up Questions
```
Steps:
1. After getting AI explanation
2. Type "What happens if I plagiarize?" in the question field
3. Click 💬 button

Expected:
✓ Loading spinner appears
✓ Response appears in green box
✓ Response answers the specific question
✓ Response relates to original content
```

### Test 5.5: Follow-up Question Cache Not Cached
```
Steps:
1. Ask a follow-up question (get response)
2. Collapse item
3. Expand item again
4. Ask different follow-up question

Expected:
✓ New question field is empty
✓ Previous response is cleared
✓ Can ask new questions
✓ Each question gets new response
```

### Test 5.6: Empty Question Validation
```
Steps:
1. Get AI explanation
2. Leave question field empty
3. Click 💬 button

Expected:
✓ Nothing happens
✓ No error message (graceful)
✓ Can type and try again
```

### Test 5.7: AI Cache in LocalStorage
```
Steps:
1. Ask AI to explain one item
2. Open DevTools → Application → LocalStorage
3. Look for 'ai_cache' key
4. Click to view value

Expected:
✓ JSON object visible
✓ Key "1" (or item id) with cached response
✓ Value is the full AI response text
```

### Test 5.8: AI Not Available (Without Backend)
```
Steps:
1. Close/stop backend server
2. Ask AI to explain
3. Wait 5+ seconds

Expected:
✓ Either error message OR graceful handling
✓ App doesn't crash
✓ User sees informative message
```

---

## ✅ Test Suite 6: Admin Form (Add Items)

### Test 6.1: Open Admin Form
```
Steps:
1. Click "➕ Add New Item" button
2. Observe form appearance

Expected:
✓ Form popup appears
✓ Shows title "Add New Knowledge Base Item"
✓ 4 input fields visible
✓ "Add Item" button ready
```

### Test 6.2: Form Validation - Empty Title
```
Steps:
1. Leave Title empty
2. Fill other fields
3. Click "Add Item"

Expected:
✓ Error message: "Title is required"
✓ Form doesn't submit
✓ Data not saved
```

### Test 6.3: Form Validation - No Tags
```
Steps:
1. Fill Title, Category, Content
2. Leave Tags empty
3. Click "Add Item"

Expected:
✓ Error message: "At least one tag is required"
✓ Form doesn't submit
```

### Test 6.4: Form Validation - Empty Content
```
Steps:
1. Fill Title, Category, Tags
2. Leave Content empty
3. Click "Add Item"

Expected:
✓ Error message: "Content is required"
✓ Form doesn't submit
```

### Test 6.5: Add Valid Item
```
Steps:
1. Fill form:
   - Title: "Test Policy"
   - Category: "POLICY"
   - Tags: "Test, Important"
   - Content: "This is test content"
2. Click "Add Item"

Expected:
✓ Form closes
✓ Admin button text changes back to "➕ Add New Item"
✓ New item appears in list
✓ Item has correct data
✓ Item has UUID (9 items now total)
✓ New item appears at bottom
```

### Test 6.6: Tab Key Navigation
```
Steps:
1. Open admin form
2. Press Tab key through all fields
3. Tab should move: Title → Category → Tags → Content → Buttons

Expected:
✓ Smooth navigation
✓ Focus visible on each field
✓ All fields reachable via keyboard
```

### Test 6.7: Clear Button
```
Steps:
1. Fill all form fields
2. Click "Clear" button
3. Observe form

Expected:
✓ All fields cleared
✓ Title field focused
✓ Form ready for new entry
```

### Test 6.8: Category Selection Buttons
```
Steps:
1. Open admin form
2. Click each category button

Expected:
✓ Clicking highlights the button
✓ Only one category selected at a time
✓ Visual feedback (color change)
✓ Selected category has different border
```

### Test 6.9: Tags Parsing
```
Steps:
1. Enter tags: "Python, Programming, CS"
2. Add item
3. Check the new item's tags

Expected:
✓ Tags split correctly by comma
✓ Whitespace trimmed ("Programming" not " Programming")
✓ Shows as 3 separate tags
✓ Display shows #Python #Programming #CS
```

### Test 6.10: Timestamps on New Item
```
Steps:
1. Add new item
2. Open DevTools
3. Check LocalStorage knowledge_base
4. Find newly added item
5. Verify created_at and updated_at

Expected:
✓ Both timestamps exist
✓ Times are current (recent)
✓ Format is ISO 8601 (2024-04-18T...)
```

---

## ✅ Test Suite 7: Delete Functionality

### Test 7.1: Delete Button Visibility
```
Steps:
1. Expand any item
2. Scroll to bottom of expanded content
3. Look for delete button

Expected:
✓ "🗑 Delete" button visible
✓ Button is at bottom right
✓ Red color (#dc2626)
```

### Test 7.2: Delete with Confirmation
```
Steps:
1. Expand an item
2. Click "🗑 Delete"
3. Confirm deletion in popup

Expected:
✓ Browser confirms: "Are you sure you want to delete this item?"
✓ Confirm dialog appears
✓ Item disappears after confirmation
✓ Item count decreases by 1
```

### Test 7.3: Delete Cancellation
```
Steps:
1. Expand an item
2. Click "🗑 Delete"
3. Click "Cancel" in confirmation

Expected:
✓ Item remains in list
✓ Item still expanded
✓ Item count unchanged
✓ No data lost
```

### Test 7.4: Deleted Item Removed from List
```
Steps:
1. Count items (8)
2. Delete one item
3. Count items again

Expected:
✓ Count is now 7
✓ Deleted item not visible
✓ Other items unaffected
✓ Search/filter still work
```

### Test 7.5: Delete Clears AI Cache
```
Steps:
1. Ask AI for explanation on item 1
2. Delete item 1
3. Open DevTools → LocalStorage → ai_cache
4. Look for key "1"

Expected:
✓ Key "1" no longer in cache
✓ Cache cleaned up
✓ No orphaned cache entries
```

### Test 7.6: Deleted Item Not in New Additions
```
Steps:
1. Delete item with ID 2
2. Add new item
3. Check new item's ID

Expected:
✓ New item gets ID 9
✓ Deleted ID not reused
✓ Always increments highest ID
```

---

## ✅ Test Suite 8: UI/UX & Styling

### Test 8.1: Responsive Design
```
Steps:
1. Open in desktop browser (1920px)
2. Resize to tablet (768px)
3. Resize to mobile (375px)

Expected:
✓ Layout adapts gracefully
✓ All elements readable
✓ Buttons clickable on mobile
✓ No horizontal scrolling
✓ Cards stack properly
```

### Test 8.2: Color Consistency
```
Steps:
1. Look at all Policy items
2. Look at all FAQ items
3. Look at Category buttons

Expected:
✓ All Policy items have red badge
✓ All FAQ items have amber badge
✓ Category buttons match badges
✓ Consistent color scheme
```

### Test 8.3: Animations Smooth
```
Steps:
1. Click to expand card
2. Observe chevron rotation
3. Observe border color change

Expected:
✓ Animations are smooth (not jerky)
✓ Transitions take ~0.2 seconds
✓ No flashing or flickering
```

### Test 8.4: Loading Spinner
```
Steps:
1. Ask AI to explain (with delay)
2. Observe spinner

Expected:
✓ Spinner rotates smoothly
✓ Text shows "AI is generating..."
✓ Spinner positioned clearly
✓ No overlap with other content
```

### Test 8.5: Error Display
```
Steps:
1. Close backend server
2. Ask AI to explain
3. Wait for error

Expected:
✓ Error message appears
✓ Message is helpful
✓ User knows what happened
✓ Can try again
```

### Test 8.6: Button Hover Effects
```
Steps:
1. Hover over "Add New Item" button
2. Hover over category pills
3. Hover over delete button

Expected:
✓ Buttons change appearance on hover
✓ Cursor is pointer
✓ Visual feedback clear
✓ Disabled buttons don't change
```

### Test 8.7: Focus States
```
Steps:
1. Press Tab to navigate
2. Tab to input fields and buttons

Expected:
✓ Focus ring visible on form fields
✓ Focus ring visible on buttons
✓ Accessible keyboard navigation
```

---

## ✅ Test Suite 9: Data Integrity

### Test 9.1: Data Survives Page Reload
```
Steps:
1. Add new item (item 9)
2. Press F5 (reload page)
3. Count items

Expected:
✓ Item 9 still there
✓ Count is 9
✓ Data persists
✓ Timestamps preserved
```

### Test 9.2: Edited Item Preserves ID
```
Steps:
1. Get new item ID
2. Update title manually in LocalStorage

Expected:
✓ ID doesn't change
✓ created_at doesn't change
✓ updated_at updates
```

### Test 9.3: Multiple Categories Mix
```
Steps:
1. Add items to different categories
2. Filter by "All"
3. Verify all items show

Expected:
✓ All items mixed together
✓ Categories correctly assigned
✓ Filtering works correctly with mix
```

### Test 9.4: Duplicate Title Allowed
```
Steps:
1. Item 1: "Test"
2. Add new item: "Test"
3. Both should exist

Expected:
✓ Both items in list
✓ Different IDs
✓ No uniqueness constraint
✓ Both visible when searching "Test"
```

### Test 9.5: Special Characters in Content
```
Steps:
1. Add item with special chars: 
   "First & Last, @mention, #hashtag, 50% off"

Expected:
✓ All special characters preserved
✓ Displayed correctly
✓ Searchable
✓ No encoding issues
```

---

## ✅ Test Suite 10: Performance

### Test 10.1: Initial Load Speed
```
Steps:
1. Clear browser cache
2. Navigate to /knowledge-base
3. Time page load

Expected:
✓ Page loads in < 1 second
✓ All 8 items visible immediately
✓ No loading spinners
```

### Test 10.2: Search Response Time
```
Steps:
1. Type in search bar
2. Notice time to results

Expected:
✓ Results update instantly (< 100ms)
✓ No noticeable lag
✓ Smooth typing experience
```

### Test 10.3: Many Items Performance
```
Steps:
1. (Optional) Add 50+ items
2. Try searching
3. Try filtering

Expected:
✓ Still responsive (< 500ms)
✓ No freezing
✓ Smooth scrolling
```

### Test 10.4: Memory Usage
```
Steps:
1. Open DevTools → Memory
2. Take heap snapshot
3. Do actions for 1 minute
4. Take another snapshot
5. Compare sizes

Expected:
✓ Memory relatively stable
✓ No memory leaks
✓ Reasonable usage (< 50MB)
```

---

## 🐛 Bug Report Template

If you find an issue:

```
Title: [Short description]
Severity: Critical / High / Medium / Low

Steps to Reproduce:
1. [First step]
2. [Second step]
3. [etc.]

Expected Behavior:
[What should happen]

Actual Behavior:
[What actually happened]

Browser: [Chrome/Firefox/Safari/Edge]
OS: [Windows/Mac/Linux]
Device: [Desktop/Tablet/Mobile]

Console Errors:
[Any errors visible in F12 console]

Screenshots:
[If applicable]
```

---

## ✅ Sign-Off Checklist

After completing all tests:

- [ ] All search tests pass
- [ ] All filter tests pass
- [ ] All expand/collapse tests pass
- [ ] AI features work (or gracefully fail)
- [ ] Admin form works
- [ ] Delete functionality works
- [ ] Data persists across reloads
- [ ] UI looks good and is responsive
- [ ] No console errors
- [ ] No console warnings
- [ ] Performance is good
- [ ] Keyboard navigation works
- [ ] Color scheme is consistent
- [ ] Animations are smooth

---

## 🎉 You're Done!

If all tests pass, the Knowledge Base feature is ready for production use!

