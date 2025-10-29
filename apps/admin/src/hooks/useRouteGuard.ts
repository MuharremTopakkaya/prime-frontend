/**
 * Route Guard Hook
 * 
 * Route seviyesinde claim kontrolü için hook.
 * Yetki yoksa redirect yapar veya erişim engellenir.
 * 
 * NOTE: Bu hook şu an skeleton durumda. Backend API entegrasyonu
 * tamamlandıktan sonra tam implementasyon yapılacak.
 * 
 * @example
 * ```tsx
 * const RouteComponent = () => {
 *   useRouteGuard('/admin/companies');
 *   return <CompaniesPage />;
 * };
 * ```
 */

import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useClaims } from '../contexts/ClaimsContext';
import { useClaimCheck } from './useClaimCheck';
import { getRouteClaims } from '../config/claimsMapping';
import { FullControlClaim } from '../constants/OperationClaims';

interface UseRouteGuardOptions {
  /** Route path to check */
  routePath?: string;
  
  /** Required claims (overrides routePath claims if provided) */
  requiredClaims?: string[];
  
  /** Redirect to this path if no access (default: '/admin/default' or '/auth/sign-in') */
  redirectTo?: string;
  
  /** Show error message instead of redirecting? */
  showError?: boolean;
  
  /** Custom error message */
  errorMessage?: string;
}

/**
 * Route Guard Hook
 * 
 * TODO: Backend API entegrasyonu sonrası tam implementasyon:
 * - Loading state kontrolü
 * - Error handling iyileştirmesi
 * - Cache kontrolü (stale claims kontrolü)
 * - Auto-refresh mekanizması
 */
export function useRouteGuard(options: UseRouteGuardOptions = {}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasAnyClaim, loading, error } = useClaims();
  const { isAdmin } = useClaimCheck();
  
  const {
    routePath,
    requiredClaims,
    redirectTo,
    showError = false,
    errorMessage,
  } = options;

  useEffect(() => {
    // Wait for claims to load
    if (loading) {
      return;
    }

    // If error loading claims, redirect to login
    if (error) {
      navigate(redirectTo || '/auth/sign-in', { replace: true });
      return;
    }

    // Determine required claims
    const claims = requiredClaims || (routePath ? getRouteClaims(routePath) : []);

    // If no claims required, allow access
    if (claims.length === 0) {
      return;
    }

    // Check if user has required claims
    const hasAccess = hasAnyClaim(claims);

    if (!hasAccess) {
      if (showError) {
        // TODO: Show error toast/notification
        console.warn(errorMessage || 'Bu sayfaya erişim yetkiniz bulunmamaktadır.');
      }

      // Redirect to default dashboard or login
      const fallbackRoute = isAdmin ? '/admin/default' : '/auth/sign-in';
      navigate(redirectTo || fallbackRoute, { 
        replace: true,
        state: { 
          from: location.pathname,
          reason: 'insufficient_permissions',
        },
      });
    }
  }, [loading, error, hasAnyClaim, isAdmin, navigate, location.pathname, routePath, requiredClaims, redirectTo, showError, errorMessage]);
}

/**
 * Higher Order Component for route protection
 * 
 * TODO: Backend API entegrasyonu sonrası kullanılabilir
 */
export function withRouteGuard<P extends object>(
  Component: React.ComponentType<P>,
  requiredClaims?: string[],
  redirectTo?: string
) {
  return function ProtectedRouteComponent(props: P) {
    useRouteGuard({
      requiredClaims,
      redirectTo,
    });

    return <Component {...props} />;
  };
}

export default useRouteGuard;

