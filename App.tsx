import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // ubah di sini
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductFormPage from './pages/admin/AdminProductFormPage';
import NotFoundPage from './pages/NotFoundPage';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter> {/* ubah di sini */}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <PrivateRoute>
              <AdminDashboardPage />
            </PrivateRoute>
          } />
          <Route path="/admin/new" element={
            <PrivateRoute>
              <AdminProductFormPage />
            </PrivateRoute>
          } />
          <Route path="/admin/edit/:id" element={
            <PrivateRoute>
              <AdminProductFormPage />
            </PrivateRoute>
          } />

          {/* Not Found Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        <Routes>{/* ... */}</Routes>
        <Toaster position="top-right" toastOptions={{ duration: 2500 }} />
        
      </BrowserRouter>
    </AuthProvider>
    
  );
  
}

export default App;
