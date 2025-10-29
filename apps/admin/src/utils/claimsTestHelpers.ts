/**
 * Claims Test Helpers
 * 
 * Farklı claim kombinasyonları için test data ve mock helper'lar.
 * Unit test'ler ve development için kullanılır.
 */

import { UserClaimsGroup, UserClaim } from '../types/claims';
import {
  CompaniesOperationClaims,
  PartnersOperationClaims,
  UsersOperationClaims,
  SupportRequestsOperationClaims,
  FullControlClaim,
  ClaimGroups,
} from '../constants/OperationClaims';

/**
 * Create a single claim object
 */
function createClaim(
  id: number,
  name: string,
  description: string,
  isRequired: boolean,
  isAssigned: boolean
): UserClaim {
  return {
    id,
    name,
    description,
    isRequired,
    isAssigned,
  };
}

/**
 * Create a claims group
 */
function createClaimsGroup(group: string, claims: UserClaim[]): UserClaimsGroup {
  return {
    group,
    claims,
  };
}

/**
 * Admin User - Has FullControl claim
 */
export function createAdminUserClaims(): UserClaimsGroup[] {
  return [
    createClaimsGroup(ClaimGroups.FullControl, [
      createClaim(1, FullControlClaim, 'Tüm sistemi eksiksiz kullanabilirsiniz.', false, true),
    ]),
  ];
}

/**
 * Customer User - Limited permissions (only Read claims)
 */
export function createCustomerUserClaims(): UserClaimsGroup[] {
  return [
    createClaimsGroup(ClaimGroups.Company, [
      createClaim(5, CompaniesOperationClaims.Read, 'Şirket bilgilerini görüntüleyebilir', true, true),
    ]),
    createClaimsGroup(ClaimGroups.Partner, [
      createClaim(9, PartnersOperationClaims.Read, 'İş ortağı bilgilerini görüntüleyebilir', true, true),
    ]),
    createClaimsGroup(ClaimGroups.User, [
      createClaim(13, UsersOperationClaims.Read, 'Kullanıcı bilgilerini görüntüleyebilir', true, true),
      createClaim(16, UsersOperationClaims.UpdateFromAuth, 'Kendi profilini güncelleyebilir', true, true),
    ]),
  ];
}

/**
 * Mixed User - Some admin permissions, some read-only
 */
export function createMixedUserClaims(): UserClaimsGroup[] {
  return [
    createClaimsGroup(ClaimGroups.Company, [
      createClaim(4, CompaniesOperationClaims.Admin, 'Şirket ile ilgili tüm işlemleri yapabilir', false, false),
      createClaim(5, CompaniesOperationClaims.Read, 'Şirket bilgilerini görüntüleyebilir', true, true),
      createClaim(7, CompaniesOperationClaims.Update, 'Şirket bilgilerini güncelleyebilir', false, true),
      // Create is not assigned
      createClaim(6, CompaniesOperationClaims.Create, 'Yeni şirket oluşturabilir', false, false),
    ]),
    createClaimsGroup(ClaimGroups.User, [
      createClaim(12, UsersOperationClaims.Admin, 'Kullanıcılar ile ilgili tüm işlemleri yapabilir', false, false),
      createClaim(13, UsersOperationClaims.Read, 'Kullanıcı bilgilerini görüntüleyebilir', true, true),
      createClaim(15, UsersOperationClaims.Update, 'Kullanıcı bilgilerini güncelleyebilir', false, true),
      // Create is not assigned
      createClaim(14, UsersOperationClaims.Create, 'Yeni kullanıcı oluşturabilir', false, false),
    ]),
    createClaimsGroup(ClaimGroups.Partner, [
      createClaim(8, PartnersOperationClaims.Admin, 'İş ortakları ile ilgili tüm işlemleri yapabilir', false, false),
      createClaim(9, PartnersOperationClaims.Read, 'İş ortağı bilgilerini görüntüleyebilir', true, true),
      // Update and Create are not assigned
      createClaim(10, PartnersOperationClaims.Create, 'Yeni iş ortağı oluşturabilir', false, false),
      createClaim(11, PartnersOperationClaims.Update, 'İş ortağı bilgilerini güncelleyebilir', false, false),
    ]),
  ];
}

/**
 * Limited User - Only one resource read permission
 */
export function createLimitedUserClaims(resource: 'Companies' | 'Partners' = 'Companies'): UserClaimsGroup[] {
  if (resource === 'Companies') {
    return [
      createClaimsGroup(ClaimGroups.Company, [
        createClaim(5, CompaniesOperationClaims.Read, 'Şirket bilgilerini görüntüleyebilir', true, true),
      ]),
    ];
  } else {
    return [
      createClaimsGroup(ClaimGroups.Partner, [
        createClaim(9, PartnersOperationClaims.Read, 'İş ortağı bilgilerini görüntüleyebilir', true, true),
      ]),
    ];
  }
}

/**
 * No Permissions User - Only required claims
 */
export function createNoPermissionsUserClaims(): UserClaimsGroup[] {
  return [
    createClaimsGroup(ClaimGroups.User, [
      createClaim(13, UsersOperationClaims.Read, 'Kullanıcı bilgilerini görüntüleyebilir', true, true),
      createClaim(16, UsersOperationClaims.UpdateFromAuth, 'Kendi profilini güncelleyebilir', true, true),
    ]),
  ];
}

/**
 * Create custom user claims with specific permissions
 */
export function createCustomUserClaims(options: {
  companies?: {
    read?: boolean;
    create?: boolean;
    update?: boolean;
    admin?: boolean;
  };
  partners?: {
    read?: boolean;
    create?: boolean;
    update?: boolean;
    admin?: boolean;
  };
  users?: {
    read?: boolean;
    create?: boolean;
    update?: boolean;
    admin?: boolean;
    updateFromAuth?: boolean;
  };
  supportRequests?: {
    read?: boolean;
    create?: boolean;
    update?: boolean;
    delete?: boolean;
    admin?: boolean;
  };
  fullControl?: boolean;
}): UserClaimsGroup[] {
  const groups: UserClaimsGroup[] = [];

  // FullControl
  if (options.fullControl) {
    groups.push(
      createClaimsGroup(ClaimGroups.FullControl, [
        createClaim(1, FullControlClaim, 'Tüm sistemi eksiksiz kullanabilirsiniz.', false, true),
      ])
    );
    return groups; // FullControl takes precedence
  }

  // Companies
  if (options.companies) {
    const claims: UserClaim[] = [];
    if (options.companies.admin) claims.push(createClaim(4, CompaniesOperationClaims.Admin, 'Şirket ile ilgili tüm işlemleri yapabilir', false, true));
    if (options.companies.read !== false) claims.push(createClaim(5, CompaniesOperationClaims.Read, 'Şirket bilgilerini görüntüleyebilir', true, true));
    if (options.companies.create) claims.push(createClaim(6, CompaniesOperationClaims.Create, 'Yeni şirket oluşturabilir', false, true));
    if (options.companies.update) claims.push(createClaim(7, CompaniesOperationClaims.Update, 'Şirket bilgilerini güncelleyebilir', false, true));
    
    if (claims.length > 0) {
      groups.push(createClaimsGroup(ClaimGroups.Company, claims));
    }
  }

  // Partners
  if (options.partners) {
    const claims: UserClaim[] = [];
    if (options.partners.admin) claims.push(createClaim(8, PartnersOperationClaims.Admin, 'İş ortakları ile ilgili tüm işlemleri yapabilir', false, true));
    if (options.partners.read !== false) claims.push(createClaim(9, PartnersOperationClaims.Read, 'İş ortağı bilgilerini görüntüleyebilir', true, true));
    if (options.partners.create) claims.push(createClaim(10, PartnersOperationClaims.Create, 'Yeni iş ortağı oluşturabilir', false, true));
    if (options.partners.update) claims.push(createClaim(11, PartnersOperationClaims.Update, 'İş ortağı bilgilerini güncelleyebilir', false, true));
    
    if (claims.length > 0) {
      groups.push(createClaimsGroup(ClaimGroups.Partner, claims));
    }
  }

  // Users
  if (options.users) {
    const claims: UserClaim[] = [];
    if (options.users.admin) claims.push(createClaim(12, UsersOperationClaims.Admin, 'Kullanıcılar ile ilgili tüm işlemleri yapabilir', false, true));
    if (options.users.read !== false) claims.push(createClaim(13, UsersOperationClaims.Read, 'Kullanıcı bilgilerini görüntüleyebilir', true, true));
    if (options.users.create) claims.push(createClaim(14, UsersOperationClaims.Create, 'Yeni kullanıcı oluşturabilir', false, true));
    if (options.users.update) claims.push(createClaim(15, UsersOperationClaims.Update, 'Kullanıcı bilgilerini güncelleyebilir', false, true));
    if (options.users.updateFromAuth !== false) claims.push(createClaim(16, UsersOperationClaims.UpdateFromAuth, 'Kendi profilini güncelleyebilir', true, true));
    
    if (claims.length > 0) {
      groups.push(createClaimsGroup(ClaimGroups.User, claims));
    }
  }

  // Support Requests
  if (options.supportRequests) {
    const claims: UserClaim[] = [];
    if (options.supportRequests.admin) claims.push(createClaim(28, SupportRequestsOperationClaims.Admin, 'Destek talepleri ile ilgili tüm işlemleri yapabilir', false, true));
    if (options.supportRequests.read !== false) claims.push(createClaim(29, SupportRequestsOperationClaims.Read, 'Destek taleplerini görüntüleyebilir', true, true));
    if (options.supportRequests.create) claims.push(createClaim(30, SupportRequestsOperationClaims.Create, 'Yeni destek talebi oluşturabilir', false, true));
    if (options.supportRequests.update) claims.push(createClaim(31, SupportRequestsOperationClaims.Update, 'Destek taleplerini güncelleyebilir', false, true));
    if (options.supportRequests.delete) claims.push(createClaim(32, SupportRequestsOperationClaims.Delete, 'Destek taleplerini silebilir', false, true));
    
    if (claims.length > 0) {
      groups.push(createClaimsGroup(ClaimGroups.SupportRequest, claims));
    }
  }

  return groups;
}

/**
 * Get all mock user profiles for testing
 */
export const MockUserProfiles = {
  admin: createAdminUserClaims(),
  customer: createCustomerUserClaims(),
  mixed: createMixedUserClaims(),
  limitedCompanies: createLimitedUserClaims('Companies'),
  limitedPartners: createLimitedUserClaims('Partners'),
  noPermissions: createNoPermissionsUserClaims(),
} as const;

/**
 * Helper to check if claims include specific claim name
 */
export function hasClaimInGroups(groups: UserClaimsGroup[], claimName: string): boolean {
  return groups.some(group =>
    group.claims.some(claim => claim.name === claimName && claim.isAssigned)
  );
}

