# VibeCart Frontend 🛒

React frontend for VibeCart e-commerce platform with shopping cart, authentication, and product management.

## ✨ Features

- 🔐 **User Authentication** - Signup, Login, JWT-based auth
- 🛍️ **Product Browsing** - View all products with images and details
- 🔍 **Search & Filter** - Find products easily
- 🛒 **Shopping Cart** - Add, update, remove items
- 📊 **User Dashboard** - Order history and stats
- ➕ **Product Management** - Add, edit, delete your products
- 👤 **Profile Management** - Update user information
- 📸 **Image Upload** - Upload product images
- 💰 **Rupee Currency** - INR (₹) price display

## 🛠️ Tech Stack

- **React** 18.2.0 - UI library
- **React Router** 6.20.1 - Client-side routing
- **Axios** 1.6.2 - HTTP requests
- **Context API** - State management (Auth, Cart)
- **CSS3** - Styling

## 📁 Project Structure

```
client/
├── public/
│   ├── index.html          # HTML template
│   └── manifest.json       # PWA manifest
├── src/
│   ├── api/
│   │   └── api.js          # Axios configuration
│   ├── components/
│   │   ├── AuthModal.js    # Login/Signup modal
│   │   ├── Header.js       # Navigation bar
│   │   ├── ImageUpload.js  # Image upload component
│   │   └── PrivateRoute.js # Protected route wrapper
│   ├── context/
│   │   ├── AuthContext.js  # Authentication state
│   │   └── CartContext.js  # Shopping cart state
│   ├── pages/
│   │   ├── Home.js         # Landing page
│   │   ├── Products.js     # All products list
│   │   ├── ProductDetail.js # Single product view
│   │   ├── Cart.js         # Shopping cart page
│   │   ├── Dashboard.js    # User dashboard
│   │   ├── AddProduct.js   # Add new product
│   │   ├── EditProduct.js  # Edit product
│   │   ├── MyProducts.js   # User's products
│   │   └── Profile.js      # User profile
│   ├── App.js              # Main app component
│   ├── App.css             # App styles
│   └── index.js            # Entry point
├── .gitignore              # Git ignore rules
├── package.json            # Dependencies
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running (see backend repository)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kenil403/VibeCart-Frontend.git
   cd VibeCart-Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start the development server**
   ```bash
   npm start
   ```
   
   App will open at `http://localhost:3000`

## 🌐 Environment Variables

### Development (Local)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Production (Vercel)
```env
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
```

## 📜 Available Scripts

### `npm start`
Runs the app in development mode on [http://localhost:3000](http://localhost:3000)

### `npm run build`
Builds the app for production to the `build` folder

### `npm test`
Launches the test runner in interactive watch mode

### `npm run eject`
**Note: this is a one-way operation!** Ejects from Create React App

## 🎨 Key Features

### Authentication System
- JWT-based authentication
- Persistent login (localStorage)
- Protected routes
- Automatic token management

### Shopping Cart
- Add/remove products
- Update quantities
- Real-time total calculation
- Persistent cart (localStorage)

### Product Management
- Upload product images
- CRUD operations
- User-specific products
- Public/private product visibility

### Responsive Design
- Mobile-friendly interface
- Adaptive layouts
- Touch-optimized interactions

## 🔗 API Integration

The frontend connects to the backend API using Axios:

```javascript
// src/api/api.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

### API Endpoints Used:
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user
- `GET /products` - Get all products
- `GET /products/:id` - Get single product
- `POST /products` - Create product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product
- `GET /cart` - Get user cart
- `POST /cart/add` - Add to cart
- `PUT /cart/update/:id` - Update cart item
- `DELETE /cart/remove/:id` - Remove from cart
- `POST /upload/single` - Upload image

## 🚀 Deployment

### Deploy to Vercel

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import in Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Build Settings**
   - **Framework Preset:** Create React App
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`

4. **Add Environment Variables**
   ```
   REACT_APP_API_URL = https://your-backend.onrender.com/api
   ```

5. **Deploy!**
   - Click "Deploy"
   - Vercel will build and deploy your app

### Deploy to Netlify

1. **Build the app**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop `build` folder to Netlify
   - Or use Netlify CLI:
     ```bash
     npm install -g netlify-cli
     netlify deploy --prod
     ```

## 🔧 Configuration

### CORS Setup (Backend)
Make sure your backend allows requests from your frontend domain:

```javascript
// server.js
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-frontend.vercel.app'
  ],
  credentials: true
}));
```

### Proxy Setup (Development)
Add to `package.json` if backend runs on different port:
```json
"proxy": "http://localhost:5000"
```

## 📦 Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.1",
  "axios": "^1.6.2",
  "react-scripts": "5.0.1"
}
```

## 🔐 Security

- JWT tokens stored in localStorage
- Automatic token attachment to requests
- Protected routes for authenticated users
- Input validation on forms
- XSS protection via React

## 🐛 Troubleshooting

### API Connection Issues
```javascript
// Check if API URL is correct
console.log(process.env.REACT_APP_API_URL);
```

### CORS Errors
- Verify backend CORS configuration
- Check if backend is running
- Ensure API URL is correct

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 🤝 Backend Repository

This frontend works with the VibeCart backend API:
- **Repository:** [VibeCart-Server](https://github.com/kenil403/VibeCart-Server)
- **Tech:** Node.js, Express, MongoDB, JWT

## 📄 License

ISC

## 👤 Author

**Kenil Shah**
- GitHub: [@kenil403](https://github.com/kenil403)
- Repository: [VibeCart-Frontend](https://github.com/kenil403/VibeCart-Frontend)

## 🌟 Support

Give a ⭐️ if this project helped you!

## 📝 Notes

- Make sure backend is running before starting frontend
- Use correct API URL for your environment
- Update environment variables when deploying
- Test all features before deployment

---

**Happy Coding!** 🚀
