import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    publicProducts: 0,
    privateProducts: 0,
    totalValue: 0,
    lowStock: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user) {
      fetchDashboardData();
    } else if (!authLoading && !user) {
      setLoading(false);
      setError('Please login to view dashboard');
    }
  }, [user, authLoading]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to view dashboard');
        setLoading(false);
        return;
      }

      const response = await axios.get('/api/products/my/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const userProducts = response.data.data || [];
      setProducts(userProducts);
      
      // Calculate statistics
      const totalProducts = userProducts.length;
      const publicProducts = userProducts.filter(p => p.isPublic).length;
      const privateProducts = userProducts.filter(p => !p.isPublic).length;
      const totalValue = userProducts.reduce((sum, p) => sum + (p.price * p.stock), 0);
      const lowStock = userProducts.filter(p => p.stock < 5).length;

      setStats({
        totalProducts,
        publicProducts,
        privateProducts,
        totalValue,
        lowStock
      });

      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard:', err);
      if (err.response?.status === 401) {
        setError('Please login to view dashboard');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch dashboard data');
      }
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await axios.delete(`/api/products/${id}`);
      setProducts(products.filter(product => product._id !== id));
      // Recalculate stats
      fetchDashboardData();
    } catch (err) {
      alert('Failed to delete product: ' + (err.response?.data?.message || err.message));
      console.error('Error deleting product:', err);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-product/${id}`);
  };

  if (authLoading || loading) {
    return (
      <div className="dashboard-page">
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="container">
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => navigate('/products')} className="btn-primary">
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div>
            <h1>My Dashboard</h1>
            <p className="welcome-text">Welcome back, <strong>{user?.name}</strong>!</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card stat-primary">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <h3>{stats.totalProducts}</h3>
              <p>Total Products</p>
            </div>
          </div>

          <div className="stat-card stat-success">
            <div className="stat-icon">👁️</div>
            <div className="stat-content">
              <h3>{stats.publicProducts}</h3>
              <p>Public Products</p>
            </div>
          </div>

          <div className="stat-card stat-warning">
            <div className="stat-icon">🔒</div>
            <div className="stat-content">
              <h3>{stats.privateProducts}</h3>
              <p>Private Products</p>
            </div>
          </div>

          <div className="stat-card stat-info">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>₹{stats.totalValue.toFixed(2)}</h3>
              <p>Inventory Value</p>
            </div>
          </div>

          {stats.lowStock > 0 && (
            <div className="stat-card stat-danger">
              <div className="stat-icon">⚠️</div>
              <div className="stat-content">
                <h3>{stats.lowStock}</h3>
                <p>Low Stock Items</p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <Link to="/products/add" className="action-btn">
              <span className="action-icon">➕</span>
              <span>Add Product</span>
            </Link>
            <Link to="/products" className="action-btn">
              <span className="action-icon">🛍️</span>
              <span>Browse All</span>
            </Link>
            <Link to="/profile" className="action-btn">
              <span className="action-icon">👤</span>
              <span>My Profile</span>
            </Link>
          </div>
        </div>

        {/* Products Table */}
        <div className="products-section">
          <div className="section-header">
            <h2>My Products</h2>
            <Link to="/my-products" className="view-all-link">View All →</Link>
          </div>

          {products.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No products yet</h3>
              <p>Start by adding your first product to get started!</p>
              <Link to="/products/add" className="btn-get-started">
                Add Your First Product
              </Link>
            </div>
          ) : (
            <div className="products-table-container">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.slice(0, 5).map((product) => (
                    <tr key={product._id}>
                      <td>
                        <div className="product-cell">
                          <img 
                            src={product.image || 'https://via.placeholder.com/50'} 
                            alt={product.name}
                            className="product-thumb"
                          />
                          <span className="product-name">{product.name}</span>
                        </div>
                      </td>
                      <td>
                        <span className="category-badge">{product.category}</span>
                      </td>
                      <td className="price-cell">₹{product.price}</td>
                      <td>
                        <span className={`stock-badge ${product.stock < 5 ? 'low-stock' : ''}`}>
                          {product.stock} units
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${product.isPublic ? 'public' : 'private'}`}>
                          {product.isPublic ? '👁️ Public' : '🔒 Private'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons-cell">
                          <button 
                            className="btn-icon btn-edit"
                            onClick={() => handleEdit(product._id)}
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <Link 
                            to={`/products/${product._id}`}
                            className="btn-icon btn-view"
                            title="View"
                          >
                            👁️
                          </Link>
                          <button 
                            className="btn-icon btn-delete"
                            onClick={() => handleDelete(product._id)}
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
