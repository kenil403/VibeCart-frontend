import React, { useState } from 'react';
import axios from 'axios';
import './ImageUpload.css';

function ImageUpload({ onImageUpload, multiple = false, maxFiles = 5 }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(multiple ? [] : null);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    const invalidFiles = files.filter(file => file.size > maxSize);
    
    if (invalidFiles.length > 0) {
      setError('Some files exceed 5MB limit');
      return;
    }

    // Validate file count
    if (multiple && files.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setError('');
    setUploading(true);

    try {
      const formData = new FormData();
      
      if (multiple) {
        files.forEach(file => {
          formData.append('images', file);
        });
      } else {
        formData.append('image', files[0]);
      }

      const token = localStorage.getItem('token');
      const endpoint = multiple ? '/api/upload/multiple' : '/api/upload/single';
      
      const response = await axios.post(`http://localhost:5000${endpoint}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        const uploadedUrls = multiple 
          ? response.data.data.map(file => `http://localhost:5000${file.url}`)
          : `http://localhost:5000${response.data.data.url}`;
        
        // Set preview
        if (multiple) {
          setPreview(uploadedUrls);
        } else {
          setPreview(uploadedUrls);
        }
        
        // Call parent callback
        onImageUpload(uploadedUrls);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    if (multiple) {
      const newPreview = preview.filter((_, i) => i !== index);
      setPreview(newPreview);
      onImageUpload(newPreview);
    } else {
      setPreview(null);
      onImageUpload(null);
    }
  };

  return (
    <div className="image-upload">
      <div className="upload-area">
        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          multiple={multiple}
          onChange={handleFileChange}
          id="file-input"
          className="file-input"
          disabled={uploading}
        />
        <label htmlFor="file-input" className="upload-label">
          {uploading ? (
            <div className="uploading">
              <div className="spinner"></div>
              <span>Uploading...</span>
            </div>
          ) : (
            <>
              <span className="upload-icon">📤</span>
              <span>Click to upload {multiple ? 'images' : 'an image'}</span>
              <span className="upload-info">
                {multiple ? `Max ${maxFiles} files, ` : ''}Max 5MB per file
              </span>
              <span className="upload-formats">JPG, PNG, GIF, WEBP</span>
            </>
          )}
        </label>
      </div>

      {error && <div className="upload-error">{error}</div>}

      {/* Preview */}
      {preview && (
        <div className={`preview-container ${multiple ? 'multiple' : 'single'}`}>
          {multiple ? (
            preview.map((url, index) => (
              <div key={index} className="preview-item">
                <img src={url} alt={`Preview ${index + 1}`} />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="remove-btn"
                >
                  ✕
                </button>
              </div>
            ))
          ) : (
            <div className="preview-item">
              <img src={preview} alt="Preview" />
              <button
                type="button"
                onClick={() => removeImage(0)}
                className="remove-btn"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
