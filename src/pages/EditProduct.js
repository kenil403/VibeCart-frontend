import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ImageUpload from '../components/ImageUpload';
import './ProductForm.css';

function EditProduct() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    images: [],
    stock: '',
    isPublic: true
  });
  const [error, setError] = useState('');
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/products/${id}`);
      const product = response.data.data;
      
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        image: product.image || '',
        images: product.images || [],
        stock: product.stock,
        isPublic: product.isPublic
      });
      setFetchLoading(false);
    } catch (err) {
      setError('Failed to fetch product details');
      setFetchLoading(false);
      console.error('Error fetching product:', err);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
    setError('');
    setErrors([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setErrors([]);

    try {
      const response = await axios.put(`/api/products/${id}`, {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      });

      if (response.data.success) {
        navigate('/my-products');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product');
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <div className="loading">Loading product...</div>;

  return (
    <div className="product-form-page">
      <div className="container">
        <div className="product-form-container">
          <h2>Edit Product</h2>

          {error && <div className="error-message">{error}</div>}
          
          {errors.length > 0 && (
            <div className="error-message">
              <ul>
                {errors.map((err, index) => (
                  <li key={index}>{err.msg}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-group">
              <label htmlFor="name">Product Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter product name"
                maxLength="100"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Enter product description"
                rows="5"
                maxLength="1000"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price (₹) *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="stock">Stock Quantity *</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Home & Garden">Home & Garden</option>
                <option value="Sports">Sports</option>
                <option value="Books">Books</option>
                <option value="Toys">Toys</option>
                <option value="Food">Food</option>
                <option value="Beauty">Beauty</option>
                <option value="Automotive">Automotive</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Product Images</label>
              <ImageUpload 
                onImageUpload={(urls) => {
                  if (Array.isArray(urls)) {
                    setFormData({
                      ...formData,
                      image: urls[0] || '',
                      images: urls
                    });
                  } else {
                    setFormData({
                      ...formData,
                      image: urls || '',
                      images: urls ? [urls] : []
                    });
                  }
                }}
                multiple={true}
                maxFiles={5}
              />
              <small style={{ color: '#666', fontSize: '14px' }}>
                Upload up to 5 product images (Max 5MB each)
              </small>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleChange}
                />
                <span>Make this product public (visible to all users)</span>
              </label>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn-submit"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Product'}
              </button>
              <button 
                type="button" 
                className="btn-cancel"
                onClick={() => navigate('/my-products')}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProduct;
