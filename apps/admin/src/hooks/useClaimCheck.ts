import { useClaims } from '../contexts/ClaimsContext';
import {
  CompaniesOperationClaims,
  PartnersOperationClaims,
  UsersOperationClaims,
  SupportRequestsOperationClaims,
  FullControlClaim,
} from '../constants/OperationClaims';

// Custom hook for easier claim checking
export const useClaimCheck = () => {
  const { hasClaim, hasAnyClaim, hasAllClaims, isAdmin, isCustomer, userClaims } = useClaims();

  // Common claim checks
  // Şirket izinleri: ilgili claim'i olan müşteri de görebilir
  const canViewCompanies = hasAnyClaim([CompaniesOperationClaims.Read, CompaniesOperationClaims.Admin, FullControlClaim]);
  const canEditCompanies = hasAnyClaim([CompaniesOperationClaims.Update, CompaniesOperationClaims.Admin, FullControlClaim]);
  const canCreateCompanies = hasAnyClaim([CompaniesOperationClaims.Create, CompaniesOperationClaims.Admin, FullControlClaim]);
  const canDeleteCompanies = hasAnyClaim([CompaniesOperationClaims.Admin, FullControlClaim]); // Delete claim doesn't exist in backend, using Admin

  // Partner izinleri: ilgili claim'i olan müşteri de görebilir
  const canViewPartners = hasAnyClaim([PartnersOperationClaims.Read, PartnersOperationClaims.Admin, FullControlClaim]);
  const canEditPartners = hasAnyClaim([PartnersOperationClaims.Update, PartnersOperationClaims.Admin, FullControlClaim]);
  const canCreatePartners = hasAnyClaim([PartnersOperationClaims.Create, PartnersOperationClaims.Admin, FullControlClaim]);
  const canDeletePartners = hasAnyClaim([PartnersOperationClaims.Admin, FullControlClaim]); // Delete claim doesn't exist in backend, using Admin

  // User izinleri
  const canViewUsers = hasAnyClaim([UsersOperationClaims.Read, UsersOperationClaims.Admin, FullControlClaim]);
  const canEditUsers = hasAnyClaim([UsersOperationClaims.Update, UsersOperationClaims.Admin, FullControlClaim]);
  const canCreateUsers = hasAnyClaim([UsersOperationClaims.Create, UsersOperationClaims.Admin, FullControlClaim]);
  const canDeleteUsers = hasAnyClaim([UsersOperationClaims.Admin, FullControlClaim]); // Delete claim doesn't exist in backend, using Admin
  const canUpdateProfile = hasAnyClaim([UsersOperationClaims.UpdateFromAuth, UsersOperationClaims.Admin, FullControlClaim]);

  // Permission management
  const canManagePermissions = hasAnyClaim([UsersOperationClaims.Admin, FullControlClaim]);

  // Evrak Kayıt (Document Records) - Only FullControl
  const canViewEvrakKayit = hasClaim(FullControlClaim);
  const canDownloadExcel = hasClaim(FullControlClaim); // EvrakKayitPage Excel download
  const canViewEvrakDetails = hasClaim(FullControlClaim); // EvrakKayitPage view details

  // Support Requests
  const canViewSupportRequests = hasAnyClaim([SupportRequestsOperationClaims.Read, SupportRequestsOperationClaims.Admin, FullControlClaim]);
  const canCreateSupportRequests = hasAnyClaim([SupportRequestsOperationClaims.Create, SupportRequestsOperationClaims.Admin, FullControlClaim]);
  const canUpdateSupportRequests = hasAnyClaim([SupportRequestsOperationClaims.Update, SupportRequestsOperationClaims.Admin, FullControlClaim]);
  const canDeleteSupportRequests = hasAnyClaim([SupportRequestsOperationClaims.Delete, SupportRequestsOperationClaims.Admin, FullControlClaim]);

  // Generic helper: Check if user can access a feature by resource name
  const canAccessFeature = (resource: 'Companies' | 'Partners' | 'Users' | 'SupportRequests', action: 'Read' | 'Create' | 'Update' | 'Delete' | 'Admin'): boolean => {
    const claimMap: Record<string, string> = {
      'Companies.Read': CompaniesOperationClaims.Read,
      'Companies.Create': CompaniesOperationClaims.Create,
      'Companies.Update': CompaniesOperationClaims.Update,
      'Companies.Admin': CompaniesOperationClaims.Admin,
      'Partners.Read': PartnersOperationClaims.Read,
      'Partners.Create': PartnersOperationClaims.Create,
      'Partners.Update': PartnersOperationClaims.Update,
      'Partners.Admin': PartnersOperationClaims.Admin,
      'Users.Read': UsersOperationClaims.Read,
      'Users.Create': UsersOperationClaims.Create,
      'Users.Update': UsersOperationClaims.Update,
      'Users.Admin': UsersOperationClaims.Admin,
      'SupportRequests.Read': SupportRequestsOperationClaims.Read,
      'SupportRequests.Create': SupportRequestsOperationClaims.Create,
      'SupportRequests.Update': SupportRequestsOperationClaims.Update,
      'SupportRequests.Delete': SupportRequestsOperationClaims.Delete,
      'SupportRequests.Admin': SupportRequestsOperationClaims.Admin,
    };

    const claim = claimMap[`${resource}.${action}`];
    if (!claim) return false;

    return hasAnyClaim([claim, FullControlClaim]);
  };

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
    canUpdateProfile,
    canManagePermissions,
    
    // Evrak Kayıt permissions
    canViewEvrakKayit,
    canDownloadExcel,
    canViewEvrakDetails,
    
    // Support Requests permissions
    canViewSupportRequests,
    canCreateSupportRequests,
    canUpdateSupportRequests,
    canDeleteSupportRequests,
    
    // Route access
    canAccessRoute,
    
    // Utility functions
    getAssignedClaims,
    hasAdminClaims,
    canAccessFeature,
  };
};

export default useClaimCheck;
