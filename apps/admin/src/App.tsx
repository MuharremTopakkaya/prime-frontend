import './assets/css/App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import RTLLayout from './layouts/rtl';
import {
  ChakraProvider,
} from '@chakra-ui/react';
import initialTheme from './theme/theme';
import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthenticationMethod } from './services/authService';
import CustomerDashboard from './views/customer/CustomerDashboard';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; requiredAuthMethod?: AuthenticationMethod }> = ({ 
  children, 
  requiredAuthMethod 
}) => {
  const { isAuthenticated, authenticationMethod, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Burada loading spinner ekleyebilirsiniz
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  // Eğer belirli bir authentication method gerekiyorsa kontrol et
  if (requiredAuthMethod && authenticationMethod !== requiredAuthMethod) {
    // Yanlış panel'e erişim denemesi
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

// Main App Component
function AppContent() {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  const { isAuthenticated, authenticationMethod } = useAuth();

  return (
    <ChakraProvider theme={currentTheme}>
      <Routes>
        {/* Auth Routes - Sadece giriş yapmamış kullanıcılar için */}
        <Route 
          path="auth/*" 
          element={
            !isAuthenticated ? <AuthLayout /> : <Navigate to="/admin/default" replace />
          } 
        />
        
        {/* Admin Routes - Owner authentication method'u gerektirir */}
        <Route
          path="admin/*"
          element={
            <ProtectedRoute requiredAuthMethod="Owner">
              <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />
            </ProtectedRoute>
          }
        />
        
        {/* Customer Routes - Customer authentication method'u gerektirir */}
        <Route
          path="customer/*"
          element={
            <ProtectedRoute requiredAuthMethod="Customer">
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        
        {/* RTL Routes */}
        <Route
          path="rtl/*"
          element={
            <ProtectedRoute>
              <RTLLayout theme={currentTheme} setTheme={setCurrentTheme} />
            </ProtectedRoute>
          }
        />
        
        {/* Unauthorized Page */}
        <Route 
          path="unauthorized" 
          element={
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <h1>Yetkisiz Erişim</h1>
              <p>Bu sayfaya erişim yetkiniz bulunmamaktadır.</p>
              <button onClick={() => window.location.href = '/auth/sign-in'}>
                Giriş Sayfasına Dön
              </button>
            </div>
          } 
        />
        
        {/* Root redirect - Authentication method'a göre yönlendir */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              authenticationMethod === 'Owner' ? (
                <Navigate to="/admin/default" replace />
              ) : (
                <Navigate to="/customer/dashboard" replace />
              )
            ) : (
              <Navigate to="/auth/sign-in" replace />
            )
          } 
        />
      </Routes>
    </ChakraProvider>
  );
}

export default function Main() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
