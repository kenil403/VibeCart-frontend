import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './MyProducts.css';

function MyProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const fetchMyProducts = async () => {
    try {
      const response = await axios.get('/api/products/my/products');
      setProducts(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch your products');
      setLoading(false);
      console.error('Error fetching products:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await axios.delete(`/api/products/${id}`);
      setProducts(products.filter(product => product._id !== id));
    } catch (err) {
      alert('Failed to delete product');
      console.error('Error deleting product:', err);
    }
  };

  if (loading) return <div className="loading">Loading your products...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="my-products-page">
      <div className="container">
        <div className="page-header">
          <h2>My Products</h2>
          <Link to="/products/add" className="btn-add-product">
            + Add New Product
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="no-products-message">
            <p>You haven't added any products yet.</p>
            <Link to="/products/add" className="btn-get-started">
              Add Your First Product
            </Link>
          </div>
        ) : (
          <div className="my-products-grid">
            {products.map((product) => (
              <div key={product._id} className="my-product-card">
                <div className="product-card-image">
                  <img 
                    src={product.image || 'https://via.placeholder.com/300'} 
                    alt={product.name} 
                  />
                  {!product.isPublic && (
                    <span className="private-badge">Private</span>
                  )}
                </div>
                <div className="product-card-content">
                  <h3>{product.name}</h3>
                  <p className="product-category">{product.category}</p>
                  <p className="product-price">₹{product.price}</p>
                  <p className="product-stock">Stock: {product.stock}</p>
                  
                  <div className="product-actions">
                    <Link 
                      to={`/products/${product._id}`} 
                      className="btn-view"
                    >
                      View
                    </Link>
                    <Link 
                      to={`/products/edit/${product._id}`} 
                      className="btn-edit"
                    >
                      Edit
                    </Link>
                    <button 
                      onClick={() => handleDelete(product._id)}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyProducts;
