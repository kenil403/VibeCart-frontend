import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import AuthModal from './AuthModal';
import './Header.css';

function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const { getCartCount } = useCart();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <header className="header">
      <div className="container">
        <nav className="navbar">
          <Link to="/" className="logo">
            <h1>VibeCart</h1>
          </Link>
          <ul className="nav-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/products">Products</Link>
            </li>
            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <Link to="/cart" className="cart-link">
                    🛒 Cart {getCartCount() > 0 && <span className="cart-badge">{getCartCount()}</span>}
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="profile-link">
                    👤 {user?.name}
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="logout-btn">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <button onClick={() => setShowAuthModal(true)} className="auth-btn">
                    Login / Sign Up
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </header>
  );
}

export default Header;
