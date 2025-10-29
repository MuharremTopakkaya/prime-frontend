import React from 'react';
import { Button, ButtonProps, Tooltip, useColorModeValue } from '@chakra-ui/react';
import { useClaims } from '../contexts/ClaimsContext';
import { ProtectedComponentProps } from '../types/claims';
import { useTranslation } from 'react-i18next';

/**
 * ProtectedButton Component
 * 
 * Butonlarda otomatik claim kontrolü yapan wrapper component.
 * Claim yoksa otomatik olarak disabled yapar ve tooltip gösterir.
 * 
 * @example
 * ```tsx
 * <ProtectedButton
 *   requiredClaims={[CompaniesOperationClaims.Create]}
 *   colorScheme="blue"
 *   onClick={handleCreate}
 * >
 *   Yeni Şirket Ekle
 * </ProtectedButton>
 * ```
 */
export interface ProtectedButtonProps extends Omit<ButtonProps, 'onClick'>, ProtectedComponentProps {
  /** onClick handler - only called if user has required claims */
  onClick?: () => void | Promise<void>;
  
  /** Show disabled button instead of hiding? (default: true) */
  showDisabled?: boolean;
  
  /** Custom disabled tooltip message */
  disabledTooltip?: string;
  
  /** Show loading state while checking claims? */
  showLoadingState?: boolean;
}

export const ProtectedButton: React.FC<ProtectedButtonProps> = ({
  requiredClaims = [],
  requireAny = false,
  showWithoutClaims = false,
  fallback,
  showLoading = false,
  onClick,
  showDisabled = true,
  disabledTooltip,
  showLoadingState = false,
  children,
  isDisabled: externalDisabled,
  ...buttonProps
}) => {
  const { hasClaim, hasAnyClaim, hasAllClaims, loading } = useClaims();
  const { t } = useTranslation();
  
  // Show loading state
  if ((loading && showLoadingState) || (loading && showLoading)) {
    return (
      <Button {...buttonProps} isLoading disabled>
        {children}
      </Button>
    );
  }
  
  // If no claims required, show button normally
  if (requiredClaims.length === 0) {
    return (
      <Button {...buttonProps} onClick={onClick} isDisabled={externalDisabled}>
        {children}
      </Button>
    );
  }
  
  // Check if user has required claims
  const hasRequiredClaims = requireAny
    ? hasAnyClaim(requiredClaims)
    : hasAllClaims(requiredClaims);
  
  // Handle click - only call if has access
  const handleClick = () => {
    if (hasRequiredClaims && !externalDisabled && onClick) {
      onClick();
    }
  };
  
  // If user has claims, show enabled button
  if (hasRequiredClaims || showWithoutClaims) {
    return (
      <Button
        {...buttonProps}
        onClick={handleClick}
        isDisabled={externalDisabled || (!hasRequiredClaims && showWithoutClaims)}
      >
        {children}
      </Button>
    );
  }
  
  // User doesn't have required claims
  // Option 1: Show disabled button with tooltip
  if (showDisabled) {
    const defaultTooltip = disabledTooltip || t('permissions.noPermissionForAction', 'Bu işlem için yetkiniz bulunmamaktadır.');
    
    return (
      <Tooltip label={defaultTooltip} placement="top" hasArrow>
        <Button
          {...buttonProps}
          isDisabled
          _disabled={{
            cursor: 'not-allowed',
            opacity: 0.6,
          }}
        >
          {children}
        </Button>
      </Tooltip>
    );
  }
  
  // Option 2: Show custom fallback
  if (fallback) {
    return <>{fallback}</>;
  }
  
  // Option 3: Hide button completely
  return null;
};

export default ProtectedButton;

