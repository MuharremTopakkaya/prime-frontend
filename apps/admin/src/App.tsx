import './assets/css/App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import RTLLayout from './layouts/rtl';
import {
  ChakraProvider,
} from '@chakra-ui/react';
import initialTheme from './theme/theme';
import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ClaimsProvider, useClaims } from './contexts/ClaimsContext';
import { AuthenticationMethod } from './services/authService';
import CustomerDashboard from './views/customer/CustomerDashboard';
import routes from './routes';

// Claims-based Protected Route Component
const ClaimsProtectedRoute: React.FC<{ 
  children: React.ReactNode; 
  requiredClaims?: string[];
  requireAny?: boolean;
}> = ({ 
  children, 
  requiredClaims = [],
  requireAny = false
}) => {
  const { hasClaim, hasAnyClaim, hasAllClaims, loading, error, isCustomer } = useClaims();
  const { t } = useTranslation();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px',
        fontSize: '18px',
        color: '#666'
      }}>
        Yetkiler kontrol ediliyor...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        backgroundColor: '#fee',
        border: '1px solid #fcc',
        borderRadius: '8px',
        margin: '20px'
      }}>
        <h2 style={{ color: '#c33' }}>Yetki Kontrolünde Hata</h2>
        <p style={{ color: '#666' }}>{error}</p>
      </div>
    );
  }

  // If no claims required, show component
  if (requiredClaims.length === 0) {
    return <>{children}</>;
  }

  // Check if user has required claims
  const hasRequiredClaims = requireAny 
    ? hasAnyClaim(requiredClaims)
    : hasAllClaims(requiredClaims);

  if (!hasRequiredClaims) {
    // Customer kullanıcı admin sayfalarına girerse, müşteri paneline yönlendir
    if (isCustomer) {
      return <Navigate to="/customer/dashboard" replace />;
    }
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        margin: '20px'
      }}>
        <h2 style={{ color: '#495057', marginBottom: '16px' }}>{t('permissions.unauthorizedAccess')}</h2>
        <p style={{ color: '#6c757d', marginBottom: '20px' }}>
          {t('permissions.noAccessToPage')}
        </p>
        <button 
          onClick={() => window.history.back()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Geri Dön
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

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
              {/* Admin layout: giriş yapmış Owner herkes girebilir; sayfa bazında kısıtlama routes.tsx ile */}
              <ClaimsProtectedRoute requiredClaims={[]} requireAny={true}>
                <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />
              </ClaimsProtectedRoute>
            </ProtectedRoute>
          }
        />
        
        {/* Customer Routes - Customer authentication method'u gerektirir */}
        <Route
          path="customer/*"
          element={
            <ProtectedRoute requiredAuthMethod="Customer">
              {/* Customer panel sadece müşteri claimleriyle çalışır; admin ekranlarına erişemez */}
              <ClaimsProtectedRoute requiredClaims={[]} requireAny={true}>
                <CustomerDashboard />
              </ClaimsProtectedRoute>
            </ProtectedRoute>
          }
        />
        
        {/* RTL Routes */}
        <Route
          path="rtl/*"
          element={
            <ProtectedRoute>
              <ClaimsProtectedRoute requiredClaims={['FullControl']}>
                <RTLLayout theme={currentTheme} setTheme={setCurrentTheme} />
              </ClaimsProtectedRoute>
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
      <ClaimsProvider>
        <AppContent />
      </ClaimsProvider>
    </AuthProvider>
  );
}
