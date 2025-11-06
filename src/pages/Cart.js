import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUrl';
import './Cart.css';

const Cart = () => {
  const { cart, loading, error, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdating(prev => ({ ...prev, [productId]: true }));
    await updateQuantity(productId, newQuantity);
    setUpdating(prev => ({ ...prev, [productId]: false }));
  };

  const handleRemove = async (productId) => {
    if (window.confirm('Remove this item from cart?')) {
      await removeFromCart(productId);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Clear entire cart?')) {
      await clearCart();
    }
  };

  const handleCheckout = () => {
    alert('Checkout functionality coming soon!');
    // Navigate to checkout page
    // navigate('/checkout');
  };

  if (loading && !cart) {
    return <div className="cart-container"><div className="loading">Loading cart...</div></div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart-container">
        <div className="empty-cart">
          <h2>🛒 Your Cart is Empty</h2>
          <p>Add some products to get started!</p>
          <button onClick={() => navigate('/products')} className="browse-btn">
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>🛒 Shopping Cart</h1>
        <button onClick={handleClearCart} className="clear-cart-btn">
          Clear Cart
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="cart-content">
        <div className="cart-items">
          {cart.items.map((item) => (
            <div key={item.product._id} className="cart-item">
              <img 
                src={getImageUrl(item.product.image)}
                alt={item.product.name}
                className="item-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/100x100/667eea/ffffff?text=' + encodeURIComponent(item.product.name);
                }}
              />
              
              <div className="item-details">
                <h3>{item.product.name}</h3>
                <p className="item-category">{item.product.category}</p>
                <p className="item-price">₹{item.price.toFixed(2)}</p>
              </div>

              <div className="item-quantity">
                <button
                  onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                  disabled={updating[item.product._id] || item.quantity <= 1}
                  className="qty-btn"
                >
                  -
                </button>
                <span className="qty-value">{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                  disabled={updating[item.product._id] || item.quantity >= item.product.stock}
                  className="qty-btn"
                >
                  +
                </button>
              </div>

              <div className="item-total">
                <p className="total-label">Total</p>
                <p className="total-price">₹{(item.price * item.quantity).toFixed(2)}</p>
              </div>

              <button
                onClick={() => handleRemove(item.product._id)}
                className="remove-btn"
                title="Remove item"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          
          <div className="summary-row">
            <span>Subtotal ({cart.totalItems} items)</span>
            <span>₹{getCartTotal().toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span className="free">FREE</span>
          </div>

          <div className="summary-row total">
            <span>Total</span>
            <span>₹{getCartTotal().toFixed(2)}</span>
          </div>

          <button onClick={handleCheckout} className="checkout-btn">
            Proceed to Checkout
          </button>

          <button onClick={() => navigate('/products')} className="continue-shopping-btn">
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
