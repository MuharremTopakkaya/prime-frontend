import React from 'react';
import { useClaims } from '../contexts/ClaimsContext';

export type ClaimsMode = 'any' | 'all';

export interface ClaimsGuardOptions {
  claims?: string[];
  mode?: ClaimsMode; // 'any' (varsayılan) | 'all'
}

export function useClaimsGuard(options: ClaimsGuardOptions = {}) {
  const { hasAnyClaim, hasAllClaims } = useClaims();
  const { claims = [], mode = 'any' } = options;

  const allowed = claims.length === 0
    ? true
    : mode === 'all'
      ? hasAllClaims(claims)
      : hasAnyClaim(claims);

  return { allowed };
}

export function withClaimsGuard<P>(
  Component: React.ComponentType<P>,
  options: ClaimsGuardOptions = {}
) {
  return function GuardedComponent(props: P) {
    const { allowed } = useClaimsGuard(options);
    if (!allowed) return null;
    return <Component {...props} />;
  };
}

export const Guard: React.FC<React.PropsWithChildren<ClaimsGuardOptions>> = ({ children, claims = [], mode = 'any' }) => {
  const { allowed } = useClaimsGuard({ claims, mode });
  if (!allowed) return null;
  return <>{children}</>;
};

// Aksiyon öncesi koruma: kullanırken hook içinde çağırın
export function useEnsureHasClaims(claims: string[], mode: ClaimsMode = 'any') {
  const { hasAnyClaim, hasAllClaims } = useClaims();
  return () => (mode === 'all' ? hasAllClaims(claims) : hasAnyClaim(claims));
}


