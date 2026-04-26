import React, { useState } from 'react';
import { addItem, updateItem } from '../services/localstorageService';

const categories = [
  { key: 'POLICY', label: 'Policy', color: '#ef4444', bg: '#fef2f2' },
  { key: 'FAQ', label: 'FAQ', color: '#f59e0b', bg: '#fffbeb' },
  { key: 'COURSE_INFO', label: 'Course Info', color: '#6366f1', bg: '#eef2ff' },
  { key: 'RESEARCH_PROTOCOL', label: 'Research', color: '#10b981', bg: '#ecfdf5' },
];

export default function AdminKBForm({ onSuccess, initialData = null }) {
  const [formData, setFormData] = useState(initialData || {
    title: '',
    category: 'POLICY',
    tags: '',
    content: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate form
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }
      if (!formData.category) {
        throw new Error('Category is required');
      }
      if (!formData.content.trim()) {
        throw new Error('Content is required');
      }

      // Parse tags
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);

      if (tagsArray.length === 0) {
        throw new Error('At least one tag is required');
      }

      const itemData = {
        title: formData.title.trim(),
        category: formData.category,
        tags: tagsArray,
        content: formData.content.trim(),
      };

      if (initialData?.id) {
        // Update existing item
        updateItem(initialData.id, itemData);
      } else {
        // Add new item
        addItem(itemData);
      }

      // Reset form
      setFormData({
        title: '',
        category: 'POLICY',
        tags: '',
        content: '',
      });

      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = categories.find(c => c.key === formData.category);

  return (
    <div style={{
      background: '#fff',
      borderRadius: 16,
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      border: '1px solid #f1f5f9',
    }}>
      <h2 style={{ margin: '0 0 20px', fontSize: 20, fontWeight: 700, color: '#0f172a' }}>
        {initialData ? 'Edit Knowledge Base Item' : 'Add New Knowledge Base Item'}
      </h2>

      {error && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          padding: '12px 14px',
          borderRadius: 8,
          fontSize: 14,
          marginBottom: 16,
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Title Field */}
        <div style={{ marginBottom: 20 }}>
          <label style={{
            display: 'block',
            fontSize: 14,
            fontWeight: 600,
            color: '#475569',
            marginBottom: 8,
          }}>
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Academic Integrity Policy"
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1.5px solid #e2e8f0',
              borderRadius: 8,
              fontSize: 14,
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.15s',
            }}
            onFocus={e => e.target.style.borderColor = '#6366f1'}
            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
          />
        </div>

        {/* Category Field */}
        <div style={{ marginBottom: 20 }}>
          <label style={{
            display: 'block',
            fontSize: 14,
            fontWeight: 600,
            color: '#475569',
            marginBottom: 8,
          }}>
            Category *
          </label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, category: cat.key }))}
                style={{
                  padding: '8px 14px',
                  borderRadius: 8,
                  border: `2px solid ${formData.category === cat.key ? cat.color : '#e2e8f0'}`,
                  background: formData.category === cat.key ? cat.bg : '#fff',
                  color: cat.color,
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tags Field */}
        <div style={{ marginBottom: 20 }}>
          <label style={{
            display: 'block',
            fontSize: 14,
            fontWeight: 600,
            color: '#475569',
            marginBottom: 8,
          }}>
            Tags * (comma-separated)
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g., Ethics, Policy, Important"
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1.5px solid #e2e8f0',
              borderRadius: 8,
              fontSize: 14,
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.15s',
            }}
            onFocus={e => e.target.style.borderColor = '#6366f1'}
            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
          />
          <p style={{ fontSize: 12, color: '#94a3b8', margin: '6px 0 0' }}>
            Separate multiple tags with commas
          </p>
        </div>

        {/* Content Field */}
        <div style={{ marginBottom: 20 }}>
          <label style={{
            display: 'block',
            fontSize: 14,
            fontWeight: 600,
            color: '#475569',
            marginBottom: 8,
          }}>
            Content *
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Enter the full content for this knowledge base item..."
            rows="8"
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1.5px solid #e2e8f0',
              borderRadius: 8,
              fontSize: 14,
              outline: 'none',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
              resize: 'vertical',
              transition: 'border-color 0.15s',
            }}
            onFocus={e => e.target.style.borderColor = '#6366f1'}
            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
          />
        </div>

        {/* Submit Buttons */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => {
              setFormData({
                title: '',
                category: 'POLICY',
                tags: '',
                content: '',
              });
              setError('');
            }}
            style={{
              padding: '10px 18px',
              border: '1.5px solid #e2e8f0',
              background: '#fff',
              color: '#64748b',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              e.target.style.borderColor = '#cbd5e1';
              e.target.style.background = '#f8fafc';
            }}
            onMouseLeave={e => {
              e.target.style.borderColor = '#e2e8f0';
              e.target.style.background = '#fff';
            }}
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 18px',
              background: '#6366f1',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 14,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => !loading && (e.target.style.background = '#4f46e5')}
            onMouseLeave={e => !loading && (e.target.style.background = '#6366f1')}
          >
            {loading ? 'Saving...' : initialData ? 'Update Item' : 'Add Item'}
          </button>
        </div>
      </form>
    </div>
  );
}
