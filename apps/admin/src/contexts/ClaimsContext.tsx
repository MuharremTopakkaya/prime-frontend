import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { userService, UserClaimsGroup } from '../services/userService';
import { ClaimsState, ClaimsContextMethods, ClaimsContextType as IClaimsContextType } from '../types/claims';
import {
  createClaimsErrorFromResponse,
  createClaimsErrorFromNetwork,
  createClaimsErrorFromInvalidResponse,
  handleClaimsError,
  shouldLogoutOnError,
} from '../utils/claimsErrors';
import { FullControlClaim } from '../constants/OperationClaims';

export interface ClaimsContextType extends IClaimsContextType {}

const ClaimsContext = createContext<ClaimsContextType | undefined>(undefined);

export const useClaims = (): ClaimsContextType => {
  const context = useContext(ClaimsContext);
  if (!context) {
    throw new Error('useClaims must be used within a ClaimsProvider');
  }
  return context;
};

interface ClaimsProviderProps {
  children: ReactNode;
}

export const ClaimsProvider: React.FC<ClaimsProviderProps> = ({ children }) => {
  const [userClaims, setUserClaims] = useState<UserClaimsGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchedAt, setLastFetchedAt] = useState<number | undefined>();
  const [cacheExpiry, setCacheExpiry] = useState<number | undefined>();
  
  // Cache duration: 5 minutes (300000 ms)
  const CACHE_DURATION = 5 * 60 * 1000;

  // Check if user has FullControl claim
  const isAdmin = userClaims.some(group => 
    group.group === 'FullControl' && 
    group.claims.some(claim => claim.name === 'FullControl' && claim.isAssigned)
  );

  // Check if user is customer (has only Read claims, no Admin claims)
  const isCustomer = !isAdmin && userClaims.some(group => 
    group.claims.some(claim => 
      claim.isAssigned && 
      (claim.name.includes('.Read') || claim.name.includes('Companies.Read') || claim.name.includes('Partners.Read')) &&
      !claim.name.includes('.Admin') && 
      !claim.name.includes('.Update') && 
      !claim.name.includes('.Create') && 
      !claim.name.includes('.Delete')
    )
  );

  const hasClaim = (claimName: string): boolean => {
    // If user has FullControl, they can do everything
    if (isAdmin) {
      return true;
    }
    
    return userClaims.some(group => 
      group.claims.some(claim => 
        claim.name === claimName && claim.isAssigned
      )
    );
  };

  const hasAnyClaim = (claimNames: string[]): boolean => {
    return claimNames.some(claimName => hasClaim(claimName));
  };

  const hasAllClaims = (claimNames: string[]): boolean => {
    return claimNames.every(claimName => hasClaim(claimName));
  };

  /**
   * Refresh claims from API
   * 
   * TODO: Backend API entegrasyonu sonrası şu değişiklikler yapılacak:
   * 1. Replace userService.getUserClaims(userId) with real API call
   * 2. Use /api/UserOperationClaims/GetFromAuth endpoint (JWT'den user ID alınacak)
   * 3. Implement proper error handling with ClaimsError
   * 4. Add response validation
   * 5. Update cache timestamps
   */
  const refreshClaims = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // Get current user ID from localStorage or token
      const token = localStorage.getItem('authToken') || localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // TODO: Replace with real API call
      // const response = await fetch('/api/UserOperationClaims/GetFromAuth', {
      //   method: 'GET',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json',
      //   },
      // });
      //
      // if (!response.ok) {
      //   const claimsError = createClaimsErrorFromResponse(response);
      //   if (shouldLogoutOnError(claimsError)) {
      //     // Trigger logout
      //     window.location.href = '/auth/sign-in';
      //     return;
      //   }
      //   throw claimsError;
      // }
      //
      // const data: UserClaimsGroup[] = await response.json();
      // 
      // // Validate response format
      // if (!Array.isArray(data)) {
      //   throw createClaimsErrorFromInvalidResponse('Response is not an array', data);
      // }

      // For testing different user profiles, you can change this
      // In real implementation, decode user ID from JWT token
      const userId = localStorage.getItem('testUserId') || 'mock-user-id';
      const claims = await userService.getUserClaims(userId);
      
      // Validate claims structure
      if (!Array.isArray(claims)) {
        throw createClaimsErrorFromInvalidResponse('Claims response is not an array', claims);
      }
      
      setUserClaims(claims);
      setLastFetchedAt(Date.now());
      setCacheExpiry(Date.now() + CACHE_DURATION);
    } catch (err) {
      console.error('Error fetching user claims:', err);
      const errorMessage = handleClaimsError(err);
      setError(errorMessage);
      
      // TODO: Handle logout if needed
      // if (shouldLogoutOnError(err)) {
      //   // Trigger logout
      // }
    } finally {
      setLoading(false);
    }
  }, [CACHE_DURATION]);

  /**
   * Invalidate cache and force refresh
   */
  const invalidateCache = useCallback(() => {
    setLastFetchedAt(undefined);
    setCacheExpiry(undefined);
    refreshClaims();
  }, [refreshClaims]);

  /**
   * Check if claims are stale and need refresh
   */
  const shouldRefresh = useCallback((): boolean => {
    if (!lastFetchedAt || !cacheExpiry) {
      return true; // Never fetched or no expiry set
    }
    
    return Date.now() >= cacheExpiry;
  }, [lastFetchedAt, cacheExpiry]);

  // Auto-refresh on mount
  useEffect(() => {
    // Check if we need to refresh (cache expired or never fetched)
    if (shouldRefresh()) {
      refreshClaims();
    }
  }, [refreshClaims, shouldRefresh]);

  // TODO: Auto-refresh on token refresh (when auth context refreshes token)
  // useEffect(() => {
  //   // Listen to auth token refresh events
  //   const handleTokenRefresh = () => {
  //     invalidateCache();
  //   };
  //   
  //   // Subscribe to auth events (implement based on your auth system)
  //   // authService.onTokenRefresh(handleTokenRefresh);
  //   
  //   // return () => {
  //   //   authService.offTokenRefresh(handleTokenRefresh);
  //   // };
  // }, [invalidateCache]);

  const value: ClaimsContextType = {
    userClaims,
    hasClaim,
    hasAnyClaim,
    hasAllClaims,
    isAdmin,
    isCustomer,
    loading,
    error,
    lastFetchedAt,
    cacheExpiry,
    refreshClaims,
    invalidateCache,
    shouldRefresh,
  };

  return (
    <ClaimsContext.Provider value={value}>
      {children}
    </ClaimsContext.Provider>
  );
};

export default ClaimsContext;
