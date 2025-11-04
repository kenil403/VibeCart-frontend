import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const result = await updateProfile(formData.name, formData.email);

    if (result.success) {
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } else {
      setError(result.message || 'Update failed');
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || ''
    });
    setIsEditing(false);
    setError('');
    setMessage('');
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-container">
          <h2>My Profile</h2>

          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}

          <div className="profile-info">
            <div className="profile-avatar">
              <div className="avatar-circle">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>

            {!isEditing ? (
              <div className="profile-details">
                <div className="detail-item">
                  <label>Full Name:</label>
                  <p>{user?.name}</p>
                </div>
                <div className="detail-item">
                  <label>Email:</label>
                  <p>{user?.email}</p>
                </div>
                <div className="detail-item">
                  <label>Role:</label>
                  <p className="role-badge">{user?.role}</p>
                </div>
                <div className="detail-item">
                  <label>Member Since:</label>
                  <p>{new Date(user?.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="profile-actions">
                  <button 
                    className="btn-edit"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                  <button 
                    className="btn-logout"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="profile-edit-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="btn-save"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button 
                    type="button" 
                    className="btn-cancel"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
