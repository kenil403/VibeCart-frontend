import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthModal.css';

function AuthModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    const result = await login(formData.email, formData.password);
    setLoading(false);

    if (result.success) {
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      onClose();
      // Use window.location for full page reload to ensure state is fresh
      window.location.href = '/dashboard';
    } else {
      setError(result.message || 'Login failed');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const result = await signup(formData.name, formData.email, formData.password);
    setLoading(false);

    if (result.success) {
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      onClose();
      // Use window.location for full page reload to ensure state is fresh
      window.location.href = '/dashboard';
    } else {
      setError(result.message || 'Signup failed');
    }
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setError('');
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="auth-modal-header">
          <h2>Welcome to VibeCart</h2>
          <p>Sign in to manage your products</p>
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => switchTab('login')}
          >
            Login
          </button>
          <button
            className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => switchTab('signup')}
          >
            Sign Up
          </button>
        </div>

        {error && <div className="auth-error">{error}</div>}

        {activeTab === 'login' ? (
          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <label htmlFor="login-email">Email</label>
              <input
                type="email"
                id="login-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <input
                type="password"
                id="login-password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="auth-form">
            <div className="form-group">
              <label htmlFor="signup-name">Full Name</label>
              <input
                type="text"
                id="signup-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="signup-email">Email</label>
              <input
                type="email"
                id="signup-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="signup-password">Password</label>
              <input
                type="password"
                id="signup-password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="signup-confirm-password">Confirm Password</label>
              <input
                type="password"
                id="signup-confirm-password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>
        )}

        <div className="auth-footer">
          {activeTab === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button className="link-btn" onClick={() => switchTab('signup')}>
                Sign up now
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button className="link-btn" onClick={() => switchTab('login')}>
                Login here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
