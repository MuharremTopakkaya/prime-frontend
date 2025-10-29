/**
 * Claims Type Definitions
 * 
 * Backend response types ile eşleşen TypeScript interface'leri.
 * 
 * Backend Response Types:
 * - GetUserOperationClaimsResponse
 * - ClaimDetailDto
 */

/**
 * Single Claim Detail
 * Backend: Application.Features.UserOperationClaims.Queries.GetUserOperationClaimsByUserId.ClaimDetailDto
 */
export interface UserClaim {
  /** Operation Claim ID */
  id: number;
  
  /** Claim name (e.g., "Companies.Admin", "Partners.Read") */
  name: string;
  
  /** Human-readable description */
  description: string;
  
  /** Is this claim required for the user? */
  isRequired: boolean;
  
  /** Is this claim assigned to the user? */
  isAssigned: boolean;
}

/**
 * Grouped Claims
 * Backend: Application.Features.UserOperationClaims.Queries.GetUserOperationClaimsByUserId.GetUserOperationClaimsResponse
 */
export interface UserClaimsGroup {
  /** Claim group name (e.g., "Company", "Partner", "FullControl") */
  group: string;
  
  /** List of claims in this group */
  claims: UserClaim[];
}

/**
 * Claims Context State
 */
export interface ClaimsState {
  /** All user claims grouped by category */
  userClaims: UserClaimsGroup[];
  
  /** Is claims data currently loading? */
  loading: boolean;
  
  /** Error message if claims fetch failed */
  error: string | null;
  
  /** Last successful fetch timestamp */
  lastFetchedAt?: number;
  
  /** Cache expiration time (ms) */
  cacheExpiry?: number;
}

/**
 * Claims Context Methods
 */
export interface ClaimsContextMethods {
  /** Check if user has a specific claim */
  hasClaim: (claimName: string) => boolean;
  
  /** Check if user has any of the specified claims */
  hasAnyClaim: (claimNames: string[]) => boolean;
  
  /** Check if user has all of the specified claims */
  hasAllClaims: (claimNames: string[]) => boolean;
  
  /** Refresh claims from API */
  refreshClaims: () => Promise<void>;
  
  /** Clear claims cache and force refresh */
  invalidateCache: () => void;
  
  /** Check if claims are stale and need refresh */
  shouldRefresh: () => boolean;
}

/**
 * Full Claims Context Type
 */
export interface ClaimsContextType extends ClaimsState, ClaimsContextMethods {
  /** Is user admin (has FullControl)? */
  isAdmin: boolean;
  
  /** Is user customer (limited permissions)? */
  isCustomer: boolean;
}

/**
 * Claim Check Result
 */
export interface ClaimCheckResult {
  /** Has the required claim(s) */
  hasAccess: boolean;
  
  /** Missing claims */
  missingClaims: string[];
  
  /** Suggested action message */
  message?: string;
}

/**
 * Protected Component Props
 */
export interface ProtectedComponentProps {
  /** Required claims (at least one if requireAny=true, all if requireAny=false) */
  requiredClaims?: string[];
  
  /** If true, user needs ANY of the claims. If false, user needs ALL claims */
  requireAny?: boolean;
  
  /** Show component even without claims? (disabled/readonly mode) */
  showWithoutClaims?: boolean;
  
  /** Custom fallback component */
  fallback?: React.ReactNode;
  
  /** Show loading state? */
  showLoading?: boolean;
}

/**
 * Protected Button Props
 */
export interface ProtectedButtonProps extends ProtectedComponentProps {
  /** Button content */
  children: React.ReactNode;
  
  /** onClick handler */
  onClick?: () => void | Promise<void>;
  
  /** Show disabled button instead of hiding? */
  showDisabled?: boolean;
  
  /** Disabled button tooltip */
  disabledTooltip?: string;
  
  /** Chakra UI Button props */
  [key: string]: any;
}

/**
 * Claim Group Name Type
 */
export type ClaimGroupName =
  | 'FullControl'
  | 'Auth'
  | 'Company'
  | 'User'
  | 'Partner'
  | 'UserOperationClaims'
  | 'SupportRequest'
  | 'SupportRequestComment';

