import React from 'react';
import { Tooltip } from '@chakra-ui/react';
import { useClaims } from '../contexts/ClaimsContext';

type Mode = 'any' | 'all';

interface Props {
  claims: string[];
  mode?: Mode;
  reason?: string;
  children: React.ReactElement;
}

export const DisableIfNoClaim: React.FC<Props> = ({ claims, mode = 'any', reason = 'Yetkiniz yok', children }) => {
  const { hasAnyClaim, hasAllClaims } = useClaims();
  const allowed = claims.length === 0 ? true : mode === 'all' ? hasAllClaims(claims) : hasAnyClaim(claims);

  const child = React.cloneElement(children, {
    disabled: !allowed || children.props.disabled,
  });

  if (allowed) return child;
  return (
    <Tooltip label={reason} hasArrow>
      <span>{child}</span>
    </Tooltip>
  );
};

export default DisableIfNoClaim;


