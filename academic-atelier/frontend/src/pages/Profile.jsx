import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../context/store';

export default function Profile() {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [saved, setSaved] = useState(false);

  // Initialize form data when user data loads
  useEffect(() => {
    if (user) {
      setFormData(user);
      setPhotoPreview(user.photo || '');
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (event) => setPhotoPreview(event.target?.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCancel = () => {
    setFormData(user);
    setPhotoFile(null);
    setPhotoPreview(user?.photo || '');
    setIsEditing(false);
  };

  const profileFields = [
    { label: 'Full Name', name: 'name', type: 'text' },
    { label: 'Email', name: 'email', type: 'email' },
    { label: 'Student ID', name: 'studentId', type: 'text' },
    { label: 'Department', name: 'department', type: 'text' },
    { label: 'Batch', name: 'batch', type: 'text' },
    { label: 'Current Semester', name: 'semester', type: 'text' },
    { label: 'Major', name: 'major', type: 'text' },
    { label: 'Year', name: 'year', type: 'text' },
  ];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '20px 0' }} className="fade-in">
      {/* Save notification */}
      {saved && (
        <div style={{
          position: 'fixed', top: 20, right: 20, background: '#10b981',
          color: '#fff', padding: '12px 20px', borderRadius: 8,
          boxShadow: '0 4px 12px rgba(16,185,129,0.3)', zIndex: 1000,
        }}>
          ✓ Profile updated successfully
        </div>
      )}

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0f1729 0%, #1e1b4b 100%)',
        borderRadius: 20, padding: '32px 36px', marginBottom: 28,
        color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <h1 style={{ margin: '0 0 8px', fontSize: 28, fontWeight: 800 }}>My Profile</h1>
          <p style={{ color: '#a5b4fc', margin: 0, fontSize: 14 }}>Manage your account information</p>
        </div>
        <button
          onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
          style={{
            padding: '10px 20px', borderRadius: 10, border: 'none',
            background: isEditing ? '#ef4444' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 14,
            boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
          }}
        >
          {isEditing ? '✕ Cancel' : '✎ Edit Profile'}
        </button>
      </div>

      {/* Main content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 28 }}>
        {/* Photo section */}
        <div style={{
          background: '#fff', borderRadius: 16, padding: 24,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9',
        }}>
          <div style={{ marginBottom: 20 }}>
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Student"
                style={{
                  width: '100%', height: 200, borderRadius: 12,
                  objectFit: 'cover', background: '#f1f5f9',
                }}
              />
            ) : (
              <div style={{
                width: '100%', height: 200, borderRadius: 12,
                background: '#f1f5f9', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 60, color: '#cbd5e1',
              }}>
                📷
              </div>
            )}
          </div>

          {isEditing && (
            <label style={{
              display: 'block', padding: '12px 16px', borderRadius: 10,
              border: '2px dashed #6366f1', background: '#f0f4ff',
              cursor: 'pointer', textAlign: 'center', color: '#6366f1',
              fontWeight: 600, fontSize: 14, marginBottom: 20,
            }}>
              📷 Change Photo
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ display: 'none' }}
              />
            </label>
          )}

          {/* Quick stats */}
          <div style={{ display: 'grid', gap: 12 }}>
            <div style={{ padding: 12, background: '#f8fafc', borderRadius: 10 }}>
              <p style={{ margin: '0 0 4px', fontSize: 12, color: '#64748b', fontWeight: 600 }}>GPA</p>
              <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a' }}>3.8</p>
            </div>
            <div style={{ padding: 12, background: '#f8fafc', borderRadius: 10 }}>
              <p style={{ margin: '0 0 4px', fontSize: 12, color: '#64748b', fontWeight: 600 }}>Attendance</p>
              <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a' }}>92%</p>
            </div>
            <div style={{ padding: 12, background: '#f8fafc', borderRadius: 10 }}>
              <p style={{ margin: '0 0 4px', fontSize: 12, color: '#64748b', fontWeight: 600 }}>Courses</p>
              <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a' }}>12 / 15</p>
            </div>
          </div>
        </div>

        {/* Form section */}
        <div style={{
          background: '#fff', borderRadius: 16, padding: 24,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {profileFields.map((field) => (
              <div key={field.name} style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{
                  fontSize: 12, fontWeight: 600, color: '#64748b',
                  marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5,
                }}>
                  {field.label}
                </label>
                {isEditing ? (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    style={{
                      padding: '10px 12px', border: '1.5px solid #e2e8f0',
                      borderRadius: 8, fontSize: 14, color: '#0f172a',
                      outline: 'none', transition: 'border-color 0.15s',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                    onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
                  />
                ) : (
                  <p style={{
                    margin: 0, padding: '10px 12px', background: '#f8fafc',
                    borderRadius: 8, fontSize: 14, color: '#0f172a', fontWeight: 500,
                  }}>
                    {formData[field.name] || '—'}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Save button */}
          {isEditing && (
            <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
              <button
                onClick={handleSave}
                style={{
                  flex: 1, padding: '12px 20px', borderRadius: 10, border: 'none',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: '#fff', cursor: 'pointer', fontWeight: 600,
                  boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
                }}
              >
                ✓ Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Additional info section */}
      <div style={{
        background: '#fff', borderRadius: 16, padding: 24,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9',
        marginTop: 28,
      }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
          Account Overview
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <div style={{ padding: 16, background: '#f8fafc', borderRadius: 12 }}>
            <p style={{ margin: '0 0 8px', fontSize: 12, color: '#64748b', fontWeight: 600 }}>Account Status</p>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#10b981 ' }}>✓ Active</p>
          </div>
          <div style={{ padding: 16, background: '#f8fafc', borderRadius: 12 }}>
            <p style={{ margin: '0 0 8px', fontSize: 12, color: '#64748b', fontWeight: 600 }}>Member Since</p>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>2024</p>
          </div>
          <div style={{ padding: 16, background: '#f8fafc', borderRadius: 12 }}>
            <p style={{ margin: '0 0 8px', fontSize: 12, color: '#64748b', fontWeight: 600 }}>Last Login</p>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Today</p>
          </div>
        </div>
      </div>
    </div>
  );
}
