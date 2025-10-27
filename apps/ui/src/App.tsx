import React from "react";
import GlobalStyles from 'styles/GlobalStyles';
import { css } from "styled-components/macro"; //eslint-disable-line
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthenticationMethod } from './services/authService';

import ComponentRenderer from "./ComponentRenderer";
import MainLandingPage from "./MainLandingPage";
import ThankYouPage from "./ThankYouPage";
import SignIn from "pages/SignIn";

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

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
  const { isAuthenticated, authenticationMethod } = useAuth();

  return (
    <>
      <GlobalStyles />
      <Router>
        <Routes>
          <Route path="/components/:type/:subtype/:name" element={<ComponentRenderer />} />
          <Route path="/components/:type/:name" element={<ComponentRenderer />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
          
          {/* Auth Routes - Sadece giriş yapmamış kullanıcılar için */}
          <Route 
            path="/auth/sign-in" 
            element={
              !isAuthenticated ? <SignIn /> : <Navigate to="/" replace />
            } 
          />
          
          {/* Customer Routes - Customer authentication method'u gerektirir */}
          <Route
            path="/"
            element={
              <ProtectedRoute requiredAuthMethod="Customer">
                <MainLandingPage />
              </ProtectedRoute>
            }
          />
          
          {/* Unauthorized Page */}
          <Route 
            path="/unauthorized" 
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
        </Routes>
      </Router>
    </>
  );
}

export default function App(): JSX.Element {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

// export default EventLandingPage;
// export default HotelTravelLandingPage;
// export default AgencyLandingPage;
// export default SaaSProductLandingPage;
// export default RestaurantLandingPage;
// export default ServiceLandingPage;
// export default HostingCloudLandingPage;

// export default LoginPage;
// export default SignupPage;
// export default PricingPage;
// export default AboutUsPage;
// export default ContactUsPage;
// export default BlogIndexPage;
// export default TermsOfServicePage;
// export default PrivacyPolicyPage;

// export default MainLandingPage;
