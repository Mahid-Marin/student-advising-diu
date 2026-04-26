import React, { useState, useEffect } from 'react';
import {
  getAllItems,
  getByCategory,
  searchItems,
  getCachedResponse,
  deleteItem,
} from '../services/localstorageService';
import { generateExplanation, askFollowUp } from '../services/aiService';
import AdminKBForm from '../components/AdminKBForm';

const catMeta = {
  POLICY: { label: 'Policy', color: '#ef4444', bg: '#fef2f2', icon: '📋' },
  FAQ: { label: 'FAQ', color: '#f59e0b', bg: '#fffbeb', icon: '❓' },
  COURSE_INFO: { label: 'Course Info', color: '#6366f1', bg: '#eef2ff', icon: '📚' },
  RESEARCH_PROTOCOL: { label: 'Research', color: '#10b981', bg: '#ecfdf5', icon: '🔬' },
};

export default function KnowledgeBase() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expanded, setExpanded] = useState(null);
  const [aiLoading, setAiLoading] = useState(null);
  const [aiResponses, setAiResponses] = useState({});
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [articles, setArticles] = useState([]);
  const [followUpQuestion, setFollowUpQuestion] = useState({});

  // Initialize data from localStorage
  useEffect(() => {
    const data = getAllItems();
    setArticles(data);
  }, []);

  // Filter articles based on search and category
  const filtered = articles.filter(a => {
    const matchCat = activeCategory === 'all' || a.category === activeCategory;
    const matchSearch = !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.content.toLowerCase().includes(search.toLowerCase()) ||
      a.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  const categories = ['all', ...Object.keys(catMeta)];

  const handleExpandItem = (id) => {
    setExpanded(expanded === id ? null : id);
    // Load cached AI response if available
    if (!aiResponses[id]) {
      const cached = getCachedResponse(id);
      if (cached) {
        setAiResponses(prev => ({ ...prev, [id]: cached }));
      }
    }
  };

  const handleAskAI = async (article) => {
    setAiLoading(article.id);
    try {
      const response = await generateExplanation(article.id, article.content, article.title);
      setAiResponses(prev => ({ ...prev, [article.id]: response }));
    } catch (error) {
      console.error('AI error:', error);
      setAiResponses(prev => ({
        ...prev,
        [article.id]: 'Error generating explanation. Please try again.',
      }));
    } finally {
      setAiLoading(null);
    }
  };

  const handleFollowUp = async (article) => {
    const question = followUpQuestion[article.id];
    if (!question.trim()) return;

    setAiLoading(`${article.id}-followup`);
    try {
      const response = await askFollowUp(
        article.id,
        question,
        article.content,
        article.title
      );
      setAiResponses(prev => ({
        ...prev,
        [`${article.id}-followup`]: response,
      }));
      setFollowUpQuestion(prev => ({ ...prev, [article.id]: '' }));
    } catch (error) {
      console.error('Follow-up error:', error);
    } finally {
      setAiLoading(null);
    }
  };

  const handleDeleteItem = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteItem(id);
      setArticles(articles.filter(a => a.id !== id));
    }
  };

  const handleAdminSuccess = () => {
    const updated = getAllItems();
    setArticles(updated);
    setShowAdminForm(false);
  };

  return (
    <div className="fade-in">
      {/* Admin Toggle Button */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={() => setShowAdminForm(!showAdminForm)}
          style={{
            padding: '10px 18px',
            background: showAdminForm ? '#ef4444' : '#6366f1',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            e.target.style.opacity = '0.9';
          }}
          onMouseLeave={e => {
            e.target.style.opacity = '1';
          }}
        >
          {showAdminForm ? '✕ Close Admin' : '➕ Add New Item'}
        </button>
      </div>

      {/* Admin Form */}
      {showAdminForm && (
        <div style={{ marginBottom: 24 }}>
          <AdminKBForm onSuccess={handleAdminSuccess} />
        </div>
      )}

      {/* Search bar */}
      <div style={{
        background: '#fff',
        borderRadius: 16,
        padding: '20px 24px',
        marginBottom: 24,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        border: '1px solid #f1f5f9',
      }}>
        <div style={{ position: 'relative' }}>
          <svg
            style={{
              position: 'absolute',
              left: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8',
            }}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search policies, FAQs, course info..."
            style={{
              width: '100%',
              padding: '12px 16px 12px 48px',
              border: '1.5px solid #e2e8f0',
              borderRadius: 12,
              fontSize: 14,
              outline: 'none',
              color: '#1e293b',
              transition: 'border-color 0.15s',
              boxSizing: 'border-box',
            }}
            onFocus={e => (e.target.style.borderColor = '#6366f1')}
            onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
          />
        </div>
      </div>

      {/* Category pills */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {categories.map(cat => {
          const meta = catMeta[cat];
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '8px 18px',
                borderRadius: 20,
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 13,
                transition: 'all 0.15s',
                background: isActive
                  ? meta
                    ? meta.color
                    : 'linear-gradient(135deg,#6366f1,#8b5cf6)'
                  : '#fff',
                color: isActive ? '#fff' : meta ? meta.color : '#64748b',
                boxShadow: isActive
                  ? `0 4px 14px ${meta ? meta.color + '40' : 'rgba(99,102,241,0.35)'}`
                  : '0 1px 3px rgba(0,0,0,0.06)',
              }}
            >
              {cat === 'all' ? 'All' : meta.label}
            </button>
          );
        })}
        <span
          style={{
            marginLeft: 'auto',
            fontSize: 13,
            color: '#94a3b8',
            alignSelf: 'center',
          }}
        >
          {filtered.length} article{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Articles */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <p style={{ fontSize: 15 }}>No articles found</p>
          </div>
        ) : (
          filtered.map(article => {
            const meta = catMeta[article.category];
            const isOpen = expanded === article.id;
            const aiResponse = aiResponses[article.id];
            const followUpResponse = aiResponses[`${article.id}-followup`];
            const isAiLoading = aiLoading === article.id;
            const isFollowUpLoading = aiLoading === `${article.id}-followup`;

            return (
              <div
                key={article.id}
                style={{
                  background: '#fff',
                  borderRadius: 16,
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  border: `1px solid ${isOpen ? meta.color + '40' : '#f1f5f9'}`,
                  transition: 'border-color 0.2s',
                }}
              >
                {/* Header */}
                <button
                  onClick={() => handleExpandItem(article.id)}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: meta.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: 20,
                    }}
                  >
                    {meta.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        marginBottom: 4,
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          fontSize: 15,
                          fontWeight: 700,
                          color: '#0f172a',
                        }}
                      >
                        {article.title}
                      </h3>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: 99,
                          background: meta.bg,
                          color: meta.color,
                        }}
                      >
                        {meta.label}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {article.tags.map(t => (
                        <span
                          key={t}
                          style={{
                            fontSize: 11,
                            color: '#94a3b8',
                            background: '#f8fafc',
                            padding: '2px 8px',
                            borderRadius: 99,
                          }}
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="2.5"
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s',
                      flexShrink: 0,
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {/* Expanded Content */}
                {isOpen && (
                  <div
                    style={{
                      padding: '0 24px 20px 80px',
                      borderTop: `1px solid ${meta.color}20`,
                    }}
                  >
                    {/* Original Content */}
                    <p
                      style={{
                        margin: '16px 0',
                        fontSize: 14,
                        color: '#475569',
                        lineHeight: 1.7,
                      }}
                    >
                      {article.content}
                    </p>

                    {/* AI Explanation Section */}
                    <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #e2e8f0' }}>
                      {!aiResponse && !isAiLoading ? (
                        <button
                          onClick={() => handleAskAI(article)}
                          style={{
                            padding: '10px 16px',
                            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 8,
                            fontWeight: 600,
                            fontSize: 13,
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={e => {
                            e.target.style.opacity = '0.9';
                          }}
                          onMouseLeave={e => {
                            e.target.style.opacity = '1';
                          }}
                        >
                          ✨ Ask AI to Explain
                        </button>
                      ) : isAiLoading ? (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            color: '#6366f1',
                          }}
                        >
                          <div
                            style={{
                              width: 20,
                              height: 20,
                              border: '2px solid #e2e8f0',
                              borderTop: '2px solid #6366f1',
                              borderRadius: '50%',
                              animation: 'spin 1s linear infinite',
                            }}
                          />
                          <span style={{ fontSize: 14, fontWeight: 600 }}>
                            AI is generating explanation...
                          </span>
                        </div>
                      ) : aiResponse ? (
                        <div
                          style={{
                            background: '#eef2ff',
                            border: '1px solid #c7d2fe',
                            borderRadius: 8,
                            padding: 16,
                            marginBottom: 16,
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                              marginBottom: 12,
                            }}
                          >
                            <span style={{ fontSize: 16 }}>✨</span>
                            <span
                              style={{
                                fontSize: 12,
                                fontWeight: 700,
                                color: '#6366f1',
                              }}
                            >
                              AI Explanation
                            </span>
                          </div>
                          <p
                            style={{
                              margin: 0,
                              fontSize: 14,
                              color: '#4338ca',
                              lineHeight: 1.7,
                            }}
                          >
                            {aiResponse}
                          </p>
                        </div>
                      ) : null}

                      {/* Follow-up Question Section */}
                      {aiResponse && (
                        <div style={{ marginTop: 16 }}>
                          <div
                            style={{
                              display: 'flex',
                              gap: 8,
                              marginBottom: 8,
                            }}
                          >
                            <input
                              type="text"
                              value={followUpQuestion[article.id] || ''}
                              onChange={e =>
                                setFollowUpQuestion(prev => ({
                                  ...prev,
                                  [article.id]: e.target.value,
                                }))
                              }
                              placeholder="Ask a follow-up question..."
                              style={{
                                flex: 1,
                                padding: '10px 12px',
                                border: '1.5px solid #e2e8f0',
                                borderRadius: 8,
                                fontSize: 14,
                                outline: 'none',
                                transition: 'border-color 0.15s',
                              }}
                              onFocus={e => (e.target.style.borderColor = '#6366f1')}
                              onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
                            />
                            <button
                              onClick={() => handleFollowUp(article)}
                              disabled={isFollowUpLoading}
                              style={{
                                padding: '10px 14px',
                                background: '#6366f1',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 8,
                                fontWeight: 600,
                                cursor: isFollowUpLoading ? 'not-allowed' : 'pointer',
                                opacity: isFollowUpLoading ? 0.7 : 1,
                                transition: 'all 0.15s',
                              }}
                              onMouseEnter={e => !isFollowUpLoading && (e.target.style.opacity = '0.9')}
                              onMouseLeave={e => !isFollowUpLoading && (e.target.style.opacity = '1')}
                            >
                              {isFollowUpLoading ? '⏳' : '💬'}
                            </button>
                          </div>

                          {followUpResponse && (
                            <div
                              style={{
                                background: '#f0fdf4',
                                border: '1px solid #bbf7d0',
                                borderRadius: 8,
                                padding: 12,
                                marginTop: 8,
                              }}
                            >
                              <p
                                style={{
                                  margin: 0,
                                  fontSize: 14,
                                  color: '#166534',
                                  lineHeight: 1.6,
                                }}
                              >
                                {followUpResponse}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Delete Button */}
                    <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleDeleteItem(article.id)}
                        style={{
                          padding: '8px 12px',
                          background: '#fee2e2',
                          color: '#dc2626',
                          border: 'none',
                          borderRadius: 6,
                          fontWeight: 600,
                          fontSize: 12,
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => (e.target.style.background = '#fecaca')}
                        onMouseLeave={e => (e.target.style.background = '#fee2e2')}
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* CSS for spinner animation */}
      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
