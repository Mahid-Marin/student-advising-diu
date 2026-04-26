/**
 * LocalStorage Service for Knowledge Base Management
 * Handles CRUD operations for knowledge base items stored in browser LocalStorage
 */

const KB_KEY = 'knowledge_base';
const AI_CACHE_KEY = 'ai_cache';

// Initialize default data if not exists
const initializeDefaultData = () => {
  const existing = localStorage.getItem(KB_KEY);
  if (!existing) {
    const defaultData = [
      {
        id: 1,
        title: 'Academic Integrity Policy',
        category: 'POLICY',
        tags: ['Policy', 'Ethics'],
        content: 'All submitted work must be original. Plagiarism results in academic penalties. Students are required to cite all sources properly using APA or MLA format. Direct copying from sources without proper attribution is strictly prohibited. Paraphrasing must be properly cited.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 2,
        title: 'Grade Appeal Process',
        category: 'FAQ',
        tags: ['Grades', 'Process'],
        content: 'Students may appeal grades within 14 days of release. Submit a written request to your department head with supporting evidence for your appeal. Include a clear explanation of why you believe the grade is incorrect. The appeals committee will review your request within 10 business days.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 3,
        title: 'CS101 Course Overview',
        category: 'COURSE_INFO',
        tags: ['CS', 'Python'],
        content: 'Introduction to Python programming. Topics include variables, control flow, functions, and basic data structures. Prerequisites: None. This course provides hands-on experience with Python and prepares students for advanced programming courses.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 4,
        title: 'Research Protocol Guidelines',
        category: 'RESEARCH_PROTOCOL',
        tags: ['Research', 'IRB'],
        content: 'All research involving human subjects requires IRB approval. Submit forms at least 4 weeks before data collection begins. Your research proposal must include objectives, methodology, informed consent forms, and risk assessment.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 5,
        title: 'Scholarship Application Guide',
        category: 'FAQ',
        tags: ['Scholarship', 'Finance'],
        content: 'Merit scholarships are awarded based on GPA and extracurricular activities. Apply before March 31 each year through the student portal. Maintain a minimum 3.0 GPA to retain your scholarship. Multiple scholarships can be stacked.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 6,
        title: 'Attendance Requirements',
        category: 'POLICY',
        tags: ['Attendance', 'Policy'],
        content: 'Students must attend at least 75% of classes to be eligible for examinations. Medical absences require documentation within 3 days. Excessive unexcused absences may result in course withdrawal.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 7,
        title: 'Database Systems Syllabus',
        category: 'COURSE_INFO',
        tags: ['DB', 'SQL'],
        content: 'Covers relational databases, SQL, normalization, transactions, and indexing. Includes a semester-long project building a full-stack application. Students will gain practical experience with modern database systems.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 8,
        title: 'Thesis Submission Format',
        category: 'RESEARCH_PROTOCOL',
        tags: ['Thesis', 'Format'],
        content: 'Thesis must follow department formatting guidelines: 12pt Times New Roman, double-spaced, 1-inch margins. Submit digitally and one hard copy. Ensure all citations follow the required academic citation format.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
    localStorage.setItem(KB_KEY, JSON.stringify(defaultData));
    return defaultData;
  }
  return JSON.parse(existing);
};

/**
 * Get all knowledge base items
 * @returns {Array} Array of knowledge base items
 */
export const getAllItems = () => {
  const data = localStorage.getItem(KB_KEY);
  return data ? JSON.parse(data) : initializeDefaultData();
};

/**
 * Get a specific item by ID
 * @param {number} id - Item ID
 * @returns {Object|null} Knowledge base item or null if not found
 */
export const getItemById = (id) => {
  const items = getAllItems();
  return items.find(item => item.id === id) || null;
};

/**
 * Add a new knowledge base item
 * @param {Object} data - Item data (title, category, tags, content)
 * @returns {Object} Created item with ID and timestamps
 */
export const addItem = (data) => {
  const items = getAllItems();
  const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
  const newItem = {
    id: newId,
    ...data,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  items.push(newItem);
  localStorage.setItem(KB_KEY, JSON.stringify(items));
  return newItem;
};

/**
 * Update an existing knowledge base item
 * @param {number} id - Item ID
 * @param {Object} data - Updated data
 * @returns {Object|null} Updated item or null if not found
 */
export const updateItem = (id, data) => {
  const items = getAllItems();
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return null;

  items[index] = {
    ...items[index],
    ...data,
    updated_at: new Date().toISOString(),
  };
  localStorage.setItem(KB_KEY, JSON.stringify(items));
  return items[index];
};

/**
 * Delete a knowledge base item
 * @param {number} id - Item ID
 * @returns {boolean} True if deleted, false if not found
 */
export const deleteItem = (id) => {
  const items = getAllItems();
  const filtered = items.filter(item => item.id !== id);
  if (filtered.length === items.length) return false;

  localStorage.setItem(KB_KEY, JSON.stringify(filtered));
  // Also delete cached AI response for this item
  deleteCachedResponse(id);
  return true;
};

/**
 * Search items by title and tags
 * @param {string} query - Search query
 * @returns {Array} Matching items
 */
export const searchItems = (query) => {
  if (!query) return getAllItems();
  const lowerQuery = query.toLowerCase();
  return getAllItems().filter(item =>
    item.title.toLowerCase().includes(lowerQuery) ||
    item.content.toLowerCase().includes(lowerQuery) ||
    item.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

/**
 * Filter items by category
 * @param {string} category - Category name
 * @returns {Array} Items in category
 */
export const getByCategory = (category) => {
  if (category === 'all') return getAllItems();
  return getAllItems().filter(item => item.category === category);
};

/**
 * Get cached AI response for an item
 * @param {number} itemId - Item ID
 * @returns {string|null} Cached response or null
 */
export const getCachedResponse = (itemId) => {
  const cache = localStorage.getItem(AI_CACHE_KEY);
  if (!cache) return null;
  const cacheObj = JSON.parse(cache);
  return cacheObj[itemId] || null;
};

/**
 * Cache an AI response for an item
 * @param {number} itemId - Item ID
 * @param {string} response - AI response text
 */
export const cacheResponse = (itemId, response) => {
  let cache = {};
  const existing = localStorage.getItem(AI_CACHE_KEY);
  if (existing) {
    cache = JSON.parse(existing);
  }
  cache[itemId] = response;
  localStorage.setItem(AI_CACHE_KEY, JSON.stringify(cache));
};

/**
 * Delete cached AI response for an item
 * @param {number} itemId - Item ID
 */
export const deleteCachedResponse = (itemId) => {
  const cache = localStorage.getItem(AI_CACHE_KEY);
  if (!cache) return;
  const cacheObj = JSON.parse(cache);
  delete cacheObj[itemId];
  localStorage.setItem(AI_CACHE_KEY, JSON.stringify(cacheObj));
};

/**
 * Clear all AI cache
 */
export const clearAllCache = () => {
  localStorage.removeItem(AI_CACHE_KEY);
};

/**
 * Export knowledge base as JSON
 * @returns {string} JSON string of all items
 */
export const exportData = () => {
  return JSON.stringify(getAllItems(), null, 2);
};

/**
 * Import knowledge base from JSON
 * @param {string} jsonData - JSON string of items
 * @returns {boolean} True if import successful
 */
export const importData = (jsonData) => {
  try {
    const data = JSON.parse(jsonData);
    if (Array.isArray(data)) {
      localStorage.setItem(KB_KEY, JSON.stringify(data));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Import failed:', error);
    return false;
  }
};
