import { useClaims } from '../contexts/ClaimsContext';

// Custom hook for easier claim checking
export const useClaimCheck = () => {
  const { hasClaim, hasAnyClaim, hasAllClaims, isAdmin, isCustomer, userClaims } = useClaims();

  // Common claim checks
  const canViewCompanies = hasAnyClaim(['Companies.Read', 'Companies.Admin', 'FullControl']);
  const canEditCompanies = hasAnyClaim(['Companies.Update', 'Companies.Admin', 'FullControl']);
  const canCreateCompanies = hasAnyClaim(['Companies.Create', 'Companies.Admin', 'FullControl']);
  const canDeleteCompanies = hasAnyClaim(['Companies.Delete', 'Companies.Admin', 'FullControl']);

  const canViewPartners = hasAnyClaim(['Partners.Read', 'Partners.Admin', 'FullControl']);
  const canEditPartners = hasAnyClaim(['Partners.Update', 'Partners.Admin', 'FullControl']);
  const canCreatePartners = hasAnyClaim(['Partners.Create', 'Partners.Admin', 'FullControl']);
  const canDeletePartners = hasAnyClaim(['Partners.Delete', 'Partners.Admin', 'FullControl']);

  const canViewUsers = hasAnyClaim(['Users.Read', 'Users.Admin', 'FullControl']);
  const canEditUsers = hasAnyClaim(['Users.Update', 'Users.Admin', 'FullControl']);
  const canCreateUsers = hasAnyClaim(['Users.Create', 'Users.Admin', 'FullControl']);
  const canDeleteUsers = hasAnyClaim(['Users.Delete', 'Users.Admin', 'FullControl']);

  const canManagePermissions = hasAnyClaim(['Users.Admin', 'FullControl']);

  // Check if user can access specific routes
  const canAccessRoute = (routePath: string): boolean => {
    const routeClaims: { [key: string]: string[] } = {
      '/admin/default': ['Companies.Read', 'Partners.Read', 'FullControl'],
      '/admin/companies': ['Companies.Read', 'Companies.Admin', 'FullControl'],
      '/admin/partners': ['Partners.Read', 'Partners.Admin', 'FullControl'],
      '/admin/data-tables': ['FullControl'], // Only admins can see data tables
      '/admin/profile': [], // Everyone can access their profile
    };

    const requiredClaims = routeClaims[routePath] || [];
    return requiredClaims.length === 0 || hasAnyClaim(requiredClaims);
  };

  // Get user's assigned claims as flat array
  const getAssignedClaims = (): string[] => {
    return userClaims.flatMap(group => 
      group.claims.filter(claim => claim.isAssigned).map(claim => claim.name)
    );
  };

  // Check if user has any admin-level claims
  const hasAdminClaims = (): boolean => {
    return hasAnyClaim([
      'Companies.Admin',
      'Partners.Admin', 
      'Users.Admin',
      'FullControl'
    ]);
  };

  return {
    // Basic claim checks
    hasClaim,
    hasAnyClaim,
    hasAllClaims,
    isAdmin,
    isCustomer,
    
    // Company permissions
    canViewCompanies,
    canEditCompanies,
    canCreateCompanies,
    canDeleteCompanies,
    
    // Partner permissions
    canViewPartners,
    canEditPartners,
    canCreatePartners,
    canDeletePartners,
    
    // User permissions
    canViewUsers,
    canEditUsers,
    canCreateUsers,
    canDeleteUsers,
    canManagePermissions,
    
    // Route access
    canAccessRoute,
    
    // Utility functions
    getAssignedClaims,
    hasAdminClaims,
  };
};

export default useClaimCheck;
