  import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Dashboard from './pages/Dashboard';
import MyProducts from './pages/MyProducts';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="App">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route 
                  path="/cart" 
                  element={
                    <PrivateRoute>
                      <Cart />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/dashboard" 
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/my-products" 
                  element={
                    <PrivateRoute>
                      <MyProducts />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/add-product" 
                  element={
                    <PrivateRoute>
                      <AddProduct />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/edit-product/:id" 
                  element={
                    <PrivateRoute>
                      <EditProduct />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  } 
                />
              </Routes>
            </main>
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
