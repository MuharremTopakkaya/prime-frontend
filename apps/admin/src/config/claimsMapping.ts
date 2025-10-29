/**
 * Claims Mapping Configuration
 * 
 * Bu dosya tüm menu item'ları, butonlar, route'lar ve feature'lar için
 * claim mapping'lerini içerir. Tek yerden yönetilebilir hale getirir.
 * 
 * Bu dosya runtime'da değil, development-time'da referans olarak kullanılır.
 * Gerçek kontroller routes.tsx, useClaimCheck hook ve component'lerde yapılır.
 */

import {
  CompaniesOperationClaims,
  PartnersOperationClaims,
  UsersOperationClaims,
  SupportRequestsOperationClaims,
  FullControlClaim,
} from '../constants/OperationClaims';

/**
 * Route Claims Mapping
 * routes.tsx'teki route'lar için gerekli claim'ler
 */
export const RouteClaimsMapping: Record<string, string[]> = {
  '/admin/default': [
    CompaniesOperationClaims.Read,
    PartnersOperationClaims.Read,
    FullControlClaim,
  ],
  '/admin/companies': [
    CompaniesOperationClaims.Read,
    CompaniesOperationClaims.Admin,
    FullControlClaim,
  ],
  '/admin/companies/:id': [
    CompaniesOperationClaims.Read,
    CompaniesOperationClaims.Admin,
    FullControlClaim,
  ],
  '/admin/partners': [
    PartnersOperationClaims.Read,
    PartnersOperationClaims.Admin,
    FullControlClaim,
  ],
  '/admin/evrak-kayit': [
    FullControlClaim, // Sadece admin
  ],
  '/admin/data-tables': [
    FullControlClaim, // Sadece admin
  ],
  '/admin/nft-marketplace': [
    FullControlClaim, // Sadece admin
  ],
  '/admin/profile': [], // Herkes erişebilir
  '/admin/rtl-default': [
    FullControlClaim, // Sadece admin
  ],
};

/**
 * Menu Item Claims Mapping
 * Sidebar menü item'ları için gerekli claim'ler
 */
export const MenuClaimsMapping: Record<string, string[]> = {
  'Main Dashboard': [], // Herkes görebilir
  'Companies': [
    CompaniesOperationClaims.Read,
    CompaniesOperationClaims.Admin,
    FullControlClaim,
  ],
  'Company Detail': [
    CompaniesOperationClaims.Read,
    CompaniesOperationClaims.Admin,
    FullControlClaim,
  ],
  'Partners': [
    PartnersOperationClaims.Read,
    PartnersOperationClaims.Admin,
    FullControlClaim,
  ],
  'Document Records': [
    FullControlClaim,
  ],
  'NFT Marketplace': [
    FullControlClaim,
  ],
  'Data Tables': [
    FullControlClaim,
  ],
  'Profile': [], // Herkes görebilir
  'RTL Admin': [
    FullControlClaim,
  ],
};

/**
 * Button/Action Claims Mapping
 * Sayfalardaki butonlar ve action'lar için gerekli claim'ler
 */
export const ButtonClaimsMapping: Record<string, string[]> = {
  // CompaniesPage
  'CompaniesPage.AddCompany': [
    CompaniesOperationClaims.Create,
    CompaniesOperationClaims.Admin,
    FullControlClaim,
  ],
  'CompaniesPage.EditCompany': [
    CompaniesOperationClaims.Update,
    CompaniesOperationClaims.Admin,
    FullControlClaim,
  ],
  'CompaniesPage.ViewCompanyDetails': [
    CompaniesOperationClaims.Read,
    CompaniesOperationClaims.Admin,
    FullControlClaim,
  ],
  'CompaniesPage.DeleteCompany': [
    CompaniesOperationClaims.Admin,
    FullControlClaim,
  ],

  // PartnersPage
  'PartnersPage.AddPartner': [
    PartnersOperationClaims.Create,
    PartnersOperationClaims.Admin,
    FullControlClaim,
  ],
  'PartnersPage.EditPartner': [
    PartnersOperationClaims.Update,
    PartnersOperationClaims.Admin,
    FullControlClaim,
  ],
  'PartnersPage.DeletePartner': [
    PartnersOperationClaims.Admin,
    FullControlClaim,
  ],
  'PartnersPage.CopyApiKey': [
    PartnersOperationClaims.Read,
    PartnersOperationClaims.Admin,
    FullControlClaim,
  ],
  'PartnersPage.CopyApiToken': [
    PartnersOperationClaims.Read,
    PartnersOperationClaims.Admin,
    FullControlClaim,
  ],

  // CompanyDetailPage
  'CompanyDetailPage.AddUser': [
    UsersOperationClaims.Create,
    UsersOperationClaims.Admin,
    FullControlClaim,
  ],
  'CompanyDetailPage.EditUser': [
    UsersOperationClaims.Update,
    UsersOperationClaims.Admin,
    FullControlClaim,
  ],
  'CompanyDetailPage.ManagePermissions': [
    UsersOperationClaims.Admin,
    FullControlClaim,
  ],

  // EvrakKayitPage
  'EvrakKayitPage.DownloadExcel': [
    FullControlClaim,
  ],
  'EvrakKayitPage.ViewDetails': [
    FullControlClaim,
  ],

  // ProfilePage
  'ProfilePage.UpdateProfile': [
    UsersOperationClaims.UpdateFromAuth,
    UsersOperationClaims.Admin,
    FullControlClaim,
  ],

  // Support Requests (future)
  'SupportRequestsPage.Create': [
    SupportRequestsOperationClaims.Create,
    SupportRequestsOperationClaims.Admin,
    FullControlClaim,
  ],
  'SupportRequestsPage.Edit': [
    SupportRequestsOperationClaims.Update,
    SupportRequestsOperationClaims.Admin,
    FullControlClaim,
  ],
  'SupportRequestsPage.Delete': [
    SupportRequestsOperationClaims.Delete,
    SupportRequestsOperationClaims.Admin,
    FullControlClaim,
  ],
};

/**
 * Feature Claims Mapping
 * Feature bazlı claim mapping'leri
 */
export const FeatureClaimsMapping: Record<string, string[]> = {
  'Companies.View': [
    CompaniesOperationClaims.Read,
    CompaniesOperationClaims.Admin,
    FullControlClaim,
  ],
  'Companies.Create': [
    CompaniesOperationClaims.Create,
    CompaniesOperationClaims.Admin,
    FullControlClaim,
  ],
  'Companies.Update': [
    CompaniesOperationClaims.Update,
    CompaniesOperationClaims.Admin,
    FullControlClaim,
  ],
  'Companies.Delete': [
    CompaniesOperationClaims.Admin,
    FullControlClaim,
  ],
  'Companies.Admin': [
    CompaniesOperationClaims.Admin,
    FullControlClaim,
  ],

  'Partners.View': [
    PartnersOperationClaims.Read,
    PartnersOperationClaims.Admin,
    FullControlClaim,
  ],
  'Partners.Create': [
    PartnersOperationClaims.Create,
    PartnersOperationClaims.Admin,
    FullControlClaim,
  ],
  'Partners.Update': [
    PartnersOperationClaims.Update,
    PartnersOperationClaims.Admin,
    FullControlClaim,
  ],
  'Partners.Delete': [
    PartnersOperationClaims.Admin,
    FullControlClaim,
  ],
  'Partners.Admin': [
    PartnersOperationClaims.Admin,
    FullControlClaim,
  ],

  'Users.View': [
    UsersOperationClaims.Read,
    UsersOperationClaims.Admin,
    FullControlClaim,
  ],
  'Users.Create': [
    UsersOperationClaims.Create,
    UsersOperationClaims.Admin,
    FullControlClaim,
  ],
  'Users.Update': [
    UsersOperationClaims.Update,
    UsersOperationClaims.Admin,
    FullControlClaim,
  ],
  'Users.UpdateProfile': [
    UsersOperationClaims.UpdateFromAuth,
    UsersOperationClaims.Admin,
    FullControlClaim,
  ],
  'Users.Admin': [
    UsersOperationClaims.Admin,
    FullControlClaim,
  ],

  'SupportRequests.View': [
    SupportRequestsOperationClaims.Read,
    SupportRequestsOperationClaims.Admin,
    FullControlClaim,
  ],
  'SupportRequests.Create': [
    SupportRequestsOperationClaims.Create,
    SupportRequestsOperationClaims.Admin,
    FullControlClaim,
  ],
  'SupportRequests.Update': [
    SupportRequestsOperationClaims.Update,
    SupportRequestsOperationClaims.Admin,
    FullControlClaim,
  ],
  'SupportRequests.Delete': [
    SupportRequestsOperationClaims.Delete,
    SupportRequestsOperationClaims.Admin,
    FullControlClaim,
  ],

  'EvrakKayit.View': [
    FullControlClaim,
  ],
  'EvrakKayit.Export': [
    FullControlClaim,
  ],
};

/**
 * Get required claims for a button/action
 */
export function getButtonClaims(buttonKey: string): string[] {
  return ButtonClaimsMapping[buttonKey] || [];
}

/**
 * Get required claims for a route
 */
export function getRouteClaims(routePath: string): string[] {
  return RouteClaimsMapping[routePath] || [];
}

/**
 * Get required claims for a menu item
 */
export function getMenuClaims(menuName: string): string[] {
  return MenuClaimsMapping[menuName] || [];
}

/**
 * Get required claims for a feature
 */
export function getFeatureClaims(featureKey: string): string[] {
  return FeatureClaimsMapping[featureKey] || [];
}

