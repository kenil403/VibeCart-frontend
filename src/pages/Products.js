import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getImageUrl } from '../utils/imageUrl';
import './Products.css';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://vibecart-backend.onrender.com/api/products');
      setProducts(response.data.data || response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch products. Make sure the server is running.');
      setLoading(false);
      console.error('Error fetching products:', err);
    }
  };

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="products-page">
      <div className="container">
        <h2>Our Products</h2>
        {products.length === 0 ? (
          <div className="no-products">
            <p>No products available yet. Add some products to get started!</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <div key={product._id} className="product-card">
                <div className="product-image">
                  <img 
                    src={getImageUrl(product.image)} 
                    alt={product.name} 
                  />
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-category">{product.category}</p>
                  {product.owner && (
                    <p className="product-seller">By: {product.owner.name}</p>
                  )}
                  <p className="product-price">₹{product.price}</p>
                  <div className="product-rating">
                    {'⭐'.repeat(Math.round(product.rating || 0))}
                    {product.rating > 0 && <span>({product.rating})</span>}
                  </div>
                  <Link to={`/products/${product._id}`} className="view-details-btn">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;
