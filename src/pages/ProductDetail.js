import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/imageUrl';
import './ProductDetail.css';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`https://vibecart-backend.onrender.com/api/products/${id}`);
      setProduct(response.data.data || response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch product details.');
      setLoading(false);
      console.error('Error fetching product:', err);
    }
  };

  if (loading) return <div className="loading">Loading product details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return <div className="error">Product not found</div>;

  return (
    <div className="product-detail-page">
      <div className="container">
        <Link to="/products" className="back-link">← Back to Products</Link>
        
        <div className="product-detail">
          <div className="product-detail-image">
            <img 
              src={getImageUrl(product.image)} 
              alt={product.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/500x500/667eea/ffffff?text=' + encodeURIComponent(product.name);
              }}
            />
          </div>
          
          <div className="product-detail-info">
            <h1>{product.name}</h1>
            <p className="product-detail-category">{product.category}</p>
            
            {product.owner && (
              <p className="product-seller-info">
                Sold by: <strong>{product.owner.name}</strong>
              </p>
            )}
            
            <div className="product-detail-rating">
              {'⭐'.repeat(Math.round(product.rating || 0))}
              {product.rating > 0 && <span>({product.rating})</span>}
            </div>
            
            <p className="product-detail-price">₹{product.price}</p>
            
            <div className="product-detail-stock">
              {product.stock > 0 ? (
                <span className="in-stock">In Stock ({product.stock} available)</span>
              ) : (
                <span className="out-of-stock">Out of Stock</span>
              )}
            </div>
            
            <p className="product-detail-description">{product.description}</p>
            
            {isAuthenticated ? (
              <div className="cart-actions">
                <div className="quantity-selector">
                  <label>Quantity:</label>
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
                
                <button 
                  className="add-to-cart-btn"
                  disabled={product.stock === 0 || addingToCart}
                  onClick={async () => {
                    setAddingToCart(true);
                    const success = await addToCart(product._id, quantity);
                    setAddingToCart(false);
                    if (success) {
                      alert('Product added to cart!');
                      navigate('/cart');
                    }
                  }}
                >
                  {addingToCart ? 'Adding...' : product.stock > 0 ? '🛒 Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            ) : (
              <p className="login-prompt">
                Please <Link to="/" className="login-link">login</Link> to add items to cart
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
