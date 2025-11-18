/**
 * Operation Claims Constants
 * 
 * Bu dosya backend'deki OperationClaims constant'ları ile eşleşir.
 * Type-safe claim kontrolü için kullanılır.
 * 
 * Backend Location: src/Application/Features/[FeatureName]/Constants/[FeatureName]OperationClaims.cs
 */

/**
 * General Operation Claims
 * Backend: Domain.Constants.GeneralOperationClaims
 */
export const GeneralOperationClaims = {
  Admin: 'Admin',
  Owner: 'Owner',
  Customer: 'Customer',
  Partner: 'Partner',
} as const;

/**
 * FullControl Claim
 * Sadece bu claim'e sahip kullanıcılar tüm sistem yetkilerine sahiptir.
 */
export const FullControlClaim = 'FullControl';

/**
 * Companies Operation Claims
 * Backend: Application.Features.Companies.Constants.CompaniesOperationClaims
 */
export const CompaniesOperationClaims = {
  Admin: 'Companies.Admin',
  Read: 'Companies.Read',
  Create: 'Companies.Create',
  Update: 'Companies.Update',
  Delete: 'Companies.Delete',
} as const;

/**
 * Partners Operation Claims
 * Backend: Application.Features.Partners.Constants.PartnersOperationClaims
 */
export const PartnersOperationClaims = {
  Admin: 'Partners.Admin',
  Read: 'Partners.Read',
  Create: 'Partners.Create',
  Update: 'Partners.Update',
  Delete: 'Partners.Delete',
} as const;

/**
 * Users Operation Claims
 * Backend: Application.Features.Users.Constants.UsersOperationClaims
 */
export const UsersOperationClaims = {
  Admin: 'Users.Admin',
  Read: 'Users.Read',
  Create: 'Users.Create',
  Update: 'Users.Update',
  UpdateFromAuth: 'Users.UpdateFromAuth',
} as const;

/**
 * Auth Operation Claims
 * Backend: Application.Features.Auth.Constants.AuthOperationClaims
 */
export const AuthOperationClaims = {
  Admin: 'Auth.Admin',
  RevokeToken: 'Auth.RevokeToken',
} as const;

/**
 * UserOperationClaims Operation Claims
 * Backend: Application.Features.UserOperationClaims.Constants.UserOperationClaimsOperationClaims
 */
export const UserOperationClaimsOperationClaims = {
  Admin: 'UserOperationClaims.Admin',
  Read: 'UserOperationClaims.Read',
  Update: 'UserOperationClaims.Update',
} as const;

/**
 * SupportRequests Operation Claims
 * Backend: Application.Features.SupportRequests.Constants.SupportRequestsOperationClaims
 */
export const SupportRequestsOperationClaims = {
  Admin: 'SupportRequests.Admin',
  Read: 'SupportRequests.Read',
  Create: 'SupportRequests.Create',
  Update: 'SupportRequests.Update',
  Delete: 'SupportRequests.Delete',
} as const;

/**
 * SupportRequestComments Operation Claims
 * Backend: Application.Features.SupportRequestComments.Constants.SupportRequestCommentsOperationClaims
 */
export const SupportRequestCommentsOperationClaims = {
  Admin: 'SupportRequestComments.Admin',
  Create: 'SupportRequestComments.Create',
  Update: 'SupportRequestComments.Update',
  Delete: 'SupportRequestComments.Delete',
} as const;

/**
 * Claim Groups
 * Backend: Domain.Constants.ClaimGroups
 */
export const ClaimGroups = {
  FullControl: 'FullControl',
  Auth: 'Auth',
  Company: 'Company',
  User: 'User',
  Partner: 'Partner',
  UserOperationClaims: 'UserOperationClaims',
  SupportRequest: 'SupportRequest',
  SupportRequestComment: 'SupportRequestComment',
} as const;

/**
 * Type helpers for type-safe claim checking
 */
export type OperationClaimName =
  | typeof FullControlClaim
  | typeof CompaniesOperationClaims[keyof typeof CompaniesOperationClaims]
  | typeof PartnersOperationClaims[keyof typeof PartnersOperationClaims]
  | typeof UsersOperationClaims[keyof typeof UsersOperationClaims]
  | typeof AuthOperationClaims[keyof typeof AuthOperationClaims]
  | typeof UserOperationClaimsOperationClaims[keyof typeof UserOperationClaimsOperationClaims]
  | typeof SupportRequestsOperationClaims[keyof typeof SupportRequestsOperationClaims]
  | typeof SupportRequestCommentsOperationClaims[keyof typeof SupportRequestCommentsOperationClaims];

/**
 * All claims as flat array (for validation, testing, etc.)
 */
export const AllOperationClaims = {
  FullControl: FullControlClaim,
  ...CompaniesOperationClaims,
  ...PartnersOperationClaims,
  ...UsersOperationClaims,
  ...AuthOperationClaims,
  ...UserOperationClaimsOperationClaims,
  ...SupportRequestsOperationClaims,
  ...SupportRequestCommentsOperationClaims,
} as const;

