import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { userService, UserClaimsGroup } from '../services/userService';

export interface ClaimsContextType {
  userClaims: UserClaimsGroup[];
  hasClaim: (claimName: string) => boolean;
  hasAnyClaim: (claimNames: string[]) => boolean;
  hasAllClaims: (claimNames: string[]) => boolean;
  isAdmin: boolean;
  isCustomer: boolean;
  loading: boolean;
  error: string | null;
  refreshClaims: () => Promise<void>;
}

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

  const refreshClaims = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // Get current user ID from localStorage or token
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // For testing different user profiles, you can change this
      // In real implementation, decode user ID from JWT token
      const userId = localStorage.getItem('testUserId') || 'mock-user-id';
      const claims = await userService.getUserClaims(userId);
      setUserClaims(claims);
    } catch (err) {
      console.error('Error fetching user claims:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch claims');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshClaims();
  }, []);

  const value: ClaimsContextType = {
    userClaims,
    hasClaim,
    hasAnyClaim,
    hasAllClaims,
    isAdmin,
    isCustomer,
    loading,
    error,
    refreshClaims,
  };

  return (
    <ClaimsContext.Provider value={value}>
      {children}
    </ClaimsContext.Provider>
  );
};

export default ClaimsContext;
