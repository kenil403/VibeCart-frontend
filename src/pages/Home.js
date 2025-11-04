import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';
import './Home.css';

function Home() {
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div className="home">
      <div className="container">
        <div className="hero-section">
          <h1>Welcome to VibeCart</h1>
          <p className="hero-subtitle">
            {isAuthenticated ? 'Your Ultimate Shopping & Selling Platform' : 'Your Ultimate Shopping Destination'}
          </p>
          <p className="hero-description">
            Discover amazing products, unbeatable prices, and the best shopping experience
          </p>
          <div className="cta-buttons">
            <Link to="/products" className="cta-button cta-primary">
              Shop Now
            </Link>
            {isAuthenticated ? (
              <Link to="/dashboard" className="cta-button cta-secondary">
                My Dashboard
              </Link>
            ) : (
              <button onClick={() => setShowAuthModal(true)} className="cta-button cta-secondary">
                Start Selling
              </button>
            )}
          </div>
        </div>

        <div className="features">
          <div className="feature-card">
            <span className="feature-icon">🚀</span>
            <h3>Fast Delivery</h3>
            <p>Get your orders delivered quickly and safely</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">💯</span>
            <h3>Quality Products</h3>
            <p>Only the best products make it to our store</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🔒</span>
            <h3>Secure Payment</h3>
            <p>Your transactions are safe and encrypted</p>
          </div>
        </div>
      </div>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}

export default Home;
