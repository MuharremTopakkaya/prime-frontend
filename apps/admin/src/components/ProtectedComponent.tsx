import React, { ReactNode } from 'react';
import { useClaims } from '../contexts/ClaimsContext';
import { useTranslation } from 'react-i18next';
import { Box, Text, Spinner, VStack } from '@chakra-ui/react';

interface ProtectedComponentProps {
  children: ReactNode;
  requiredClaims?: string[];
  requireAny?: boolean; // If true, user needs ANY of the claims. If false, user needs ALL claims
  fallback?: ReactNode;
  showLoading?: boolean;
}

export const ProtectedComponent: React.FC<ProtectedComponentProps> = ({
  children,
  requiredClaims = [],
  requireAny = false,
  fallback,
  showLoading = true,
}) => {
  const { hasClaim, hasAnyClaim, hasAllClaims, loading, error } = useClaims();
  const { t } = useTranslation();

  if (loading && showLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="200px">
        <VStack spacing={4}>
          <Spinner size="lg" />
          <Text color="gray.500">{t('permissions.checkingPermissions')}</Text>
        </VStack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4} bg="red.50" borderRadius="md" border="1px solid" borderColor="red.200">
        <Text color="red.600">{t('permissions.permissionCheckError')}: {error}</Text>
      </Box>
    );
  }

  // If no claims required, show component
  if (requiredClaims.length === 0) {
    return <>{children}</>;
  }

  // Check if user has required claims
  const hasRequiredClaims = requireAny 
    ? hasAnyClaim(requiredClaims)
    : hasAllClaims(requiredClaims);

  if (!hasRequiredClaims) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <Box p={4} bg="gray.50" borderRadius="md" border="1px solid" borderColor="gray.200">
        <Text color="gray.600" textAlign="center">
          {t('permissions.noPermissionForAction')}
        </Text>
      </Box>
    );
  }

  return <>{children}</>;
};

// Convenience components for common use cases
export const AdminOnly: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <ProtectedComponent 
    requiredClaims={['FullControl']} 
    fallback={fallback}
  >
    {children}
  </ProtectedComponent>
);

export const CustomerOnly: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({ 
  children, 
  fallback 
}) => {
  const { isCustomer } = useClaims();
  
  if (!isCustomer) {
    return fallback ? <>{fallback}</> : null;
  }
  
  return <>{children}</>;
};

export const ReadOnlyMode: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isCustomer } = useClaims();
  
  if (isCustomer) {
    return (
      <Box opacity={0.7} pointerEvents="none">
        {children}
      </Box>
    );
  }
  
  return <>{children}</>;
};

export default ProtectedComponent;
