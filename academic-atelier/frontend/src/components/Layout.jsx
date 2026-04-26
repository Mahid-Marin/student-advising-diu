import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore, useNotificationStore } from '../context/store';

const navItems = [
  { to: '/dashboard',     icon: HomeIcon,      label: 'Dashboard'     },
  { to: '/profile',       icon: ProfileIcon,   label: 'Profile'       },
  { to: '/learning',      icon: BookIcon,      label: 'Learning'      },
  { to: '/knowledge-base',icon: LibraryIcon,   label: 'Knowledge Base'},
  { to: '/chatbot',       icon: ChatIcon,      label: 'AI Advisor'    },
];

function ProfileIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}
function BookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
    </svg>
  );
}
function LibraryIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
    </svg>
  );
}
function ChatIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
    </svg>
  );
}

export default function Layout({ children }) {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const notifications = useNotificationStore((state) => state.notifications);
  const markAsRead = useNotificationStore((state) => state.markAsRead);

  const currentPage = navItems.find(n => location.pathname.startsWith(n.to))?.label || '';

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNotificationClick = (notif) => {
    markAsRead(notif.id);
    if (notif.id === 1) {
      const link = document.createElement('a');
      link.href = '/exam-routine.xlsx';
      link.setAttribute('download', 'CIS_Final_Exam_Routine_Spring_2026.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: collapsed ? 72 : 260,
        background: '#0f1729',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        zIndex: 50,
        transition: 'width 0.25s ease',
        overflow: 'hidden',
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, fontSize: 16, fontWeight: 700, color: '#fff',
            }}>A</div>
            {!collapsed && (
              <div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 15, fontFamily: 'Plus Jakarta Sans, sans-serif', whiteSpace: 'nowrap' }}>
                  Academic Atelier
                </div>
                <div style={{ color: '#64748b', fontSize: 11, marginTop: 1 }}>Student Portal</div>
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 12px',
                borderRadius: 10,
                textDecoration: 'none',
                color: isActive ? '#fff' : '#94a3b8',
                background: isActive ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
                fontWeight: isActive ? 600 : 400,
                fontSize: 14,
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
                boxShadow: isActive ? '0 4px 14px rgba(99,102,241,0.4)' : 'none',
              })}
              onMouseEnter={e => {
                if (!e.currentTarget.style.background.includes('gradient')) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.color = '#e2e8f0';
                }
              }}
              onMouseLeave={e => {
                if (!e.currentTarget.style.background.includes('gradient')) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#94a3b8';
                }
              }}
            >
              <span style={{ flexShrink: 0 }}><Icon /></span>
              {!collapsed && label}
            </NavLink>
          ))}
        </nav>

        {/* User + Collapse */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          {!collapsed && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 10,
              background: 'rgba(255,255,255,0.05)', marginBottom: 8,
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 700, fontSize: 13, flexShrink: 0,
              }}>
                {user?.name?.charAt(0) || 'J'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.name || 'John Doe'}
                </div>
                <div style={{ color: '#64748b', fontSize: 11 }}>Student</div>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              width: '100%', padding: '8px', borderRadius: 8,
              background: 'rgba(255,255,255,0.04)', border: 'none',
              color: '#64748b', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {collapsed
                ? <path d="M9 18l6-6-6-6"/>
                : <path d="M15 18l-6-6 6-6"/>}
            </svg>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ marginLeft: collapsed ? 72 : 260, flex: 1, transition: 'margin-left 0.25s ease', display: 'flex', flexDirection: 'column' }}>
        {/* Topbar */}
        <header style={{
          height: 64, background: '#fff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 32px', position: 'sticky', top: 0, zIndex: 40,
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a' }}>{currentPage}</h2>
            <p style={{ margin: 0, fontSize: 12, color: '#94a3b8' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative' }}>
            {/* Notifications Button */}
            <div ref={notifRef} style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: '#f1f5f9', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b',
                  position: 'relative', transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
                onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
                </svg>
                {notifications.filter(n => !n.read).length > 0 && (
                  <div style={{
                    position: 'absolute', top: -2, right: -2,
                    width: 18, height: 18, borderRadius: '50%',
                    background: '#ef4444', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, border: '2px solid #fff'
                  }}>
                    {notifications.filter(n => !n.read).length}
                  </div>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div style={{
                  position: 'absolute', top: 50, right: 0,
                  background: '#fff', borderRadius: 12, boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                  width: 350, maxHeight: 500, overflowY: 'auto', zIndex: 100,
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ padding: 16, borderBottom: '1px solid #f1f5f9' }}>
                    <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Notifications</h3>
                  </div>
                  <div style={{ padding: 0 }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding: 16, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                        No notifications
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif)}
                          style={{
                            padding: 12, borderBottom: '1px solid #f1f5f9',
                            cursor: 'pointer', background: notif.read ? '#fff' : '#f0f4ff',
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = notif.read ? '#f8fafc' : '#e8ecff'}
                          onMouseLeave={e => e.currentTarget.style.background = notif.read ? '#fff' : '#f0f4ff'}
                        >
                          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                            <span style={{ fontSize: 18 }}>{notif.icon}</span>
                            <div style={{ flex: 1 }}>
                              <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 600, color: '#0f172a' }}>
                                {notif.title}
                              </p>
                              <p style={{ margin: '0 0 4px', fontSize: 11, color: '#64748b' }}>
                                {notif.description}
                              </p>
                              <span style={{ fontSize: 10, color: '#94a3b8' }}>{notif.time}</span>
                            </div>
                            {!notif.read && (
                              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', flexShrink: 0, marginTop: 6 }} />
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Button */}
            <div ref={profileRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setShowProfile(!showProfile)}
                style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
                  border: 'none', transition: 'all 0.2s',
                  boxShadow: showProfile ? '0 4px 12px rgba(99,102,241,0.3)' : 'none'
                }}
              >
                {user?.name?.charAt(0) || 'J'}
              </button>

              {/* Profile Dropdown */}
              {showProfile && (
                <div style={{
                  position: 'absolute', top: 50, right: 0,
                  background: '#fff', borderRadius: 12, boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                  width: 200, zIndex: 100, border: '1px solid #e2e8f0',
                  overflow: 'hidden'
                }}>
                  <div style={{ padding: 12, borderBottom: '1px solid #f1f5f9' }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#0f172a' }}>
                      {user?.name || 'Student'}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: 11, color: '#94a3b8' }}>
                      {user?.studentId || 'Student ID'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setShowProfile(false);
                    }}
                    style={{
                      width: '100%', padding: '10px 12px', border: 'none',
                      background: 'white', color: '#0f172a', fontSize: 13,
                      cursor: 'pointer', textAlign: 'left', fontWeight: 500,
                      borderBottom: '1px solid #f1f5f9', transition: 'all 0.15s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = 'white'}
                  >
                    📋 View Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%', padding: '10px 12px', border: 'none',
                      background: 'white', color: '#ef4444', fontSize: 13,
                      cursor: 'pointer', textAlign: 'left', fontWeight: 500,
                      transition: 'all 0.15s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                    onMouseLeave={e => e.currentTarget.style.background = 'white'}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
