// Utility function to get the full image URL
const BACKEND_URL = 'https://vibecart-backend.onrender.com';

export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return 'https://via.placeholder.com/300';
  }
  
  // If it's a Base64 data URI, return as is
  if (imagePath.startsWith('data:image/')) {
    return imagePath;
  }
  
  // If it's already a full URL (http/https), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    // Replace localhost:5000 with the Render URL if present
    return imagePath.replace('http://localhost:5000', BACKEND_URL);
  }
  
  // If it's a relative path, prepend the backend URL
  if (imagePath.startsWith('/')) {
    return `${BACKEND_URL}${imagePath}`;
  }
  
  // If it doesn't start with /, add both / and backend URL
  return `${BACKEND_URL}/${imagePath}`;
};
