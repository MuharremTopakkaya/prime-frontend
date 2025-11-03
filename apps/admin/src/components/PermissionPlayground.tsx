import React from 'react';
import { Box, Button, Heading, Stack, Text } from '@chakra-ui/react';
import { useClaimCheck } from '../hooks/useClaimCheck';
import { DisableIfNoClaim } from './DisableIfNoClaim';

export const PermissionPlayground: React.FC = () => {
  const {
    canViewCompanies,
    canCreateCompanies,
    canEditCompanies,
    canDeleteCompanies,
    getAssignedClaims,
  } = useClaimCheck();

  const assigned = getAssignedClaims();

  return (
    <Box p={6} borderWidth='1px' borderRadius='lg'>
      <Heading size='md' mb={3}>Permission Playground</Heading>
      <Text fontSize='sm' mb={4}>Assigned claims: {assigned.join(', ') || 'none'}</Text>
      <Stack direction='row' spacing={3}>
        <DisableIfNoClaim claims={["Companies.Read"]}>
          <Button>View Companies ({String(canViewCompanies)})</Button>
        </DisableIfNoClaim>
        <DisableIfNoClaim claims={["Companies.Create","Companies.Admin"]}>
          <Button colorScheme='green'>Create ({String(canCreateCompanies)})</Button>
        </DisableIfNoClaim>
        <DisableIfNoClaim claims={["Companies.Update","Companies.Admin"]}>
          <Button colorScheme='yellow'>Edit ({String(canEditCompanies)})</Button>
        </DisableIfNoClaim>
        <DisableIfNoClaim claims={["Companies.Admin"]}>
          <Button colorScheme='red'>Delete ({String(canDeleteCompanies)})</Button>
        </DisableIfNoClaim>
      </Stack>
    </Box>
  );
};

export default PermissionPlayground;


