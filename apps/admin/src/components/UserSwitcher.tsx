import React from 'react';
import { Box, Button, VStack, Text, HStack, Badge } from '@chakra-ui/react';
import { useClaims } from '../contexts/ClaimsContext';

const UserSwitcher: React.FC = () => {
  const { userClaims, isAdmin, isCustomer } = useClaims();

  const switchUser = (userId: string) => {
    localStorage.setItem('testUserId', userId);
    window.location.reload(); // Refresh to reload claims
  };

  const getAssignedClaims = () => {
    return userClaims.flatMap(group => 
      group.claims.filter(claim => claim.isAssigned).map(claim => claim.name)
    );
  };

  return (
    <Box 
      position="fixed" 
      bottom="20px" 
      right="20px" 
      bg="white" 
      p={4} 
      borderRadius="md" 
      boxShadow="lg"
      border="1px solid"
      borderColor="gray.200"
      zIndex={1000}
      _dark={{
        bg: "navy.800",
        borderColor: "blue.600"
      }}
    >
      <VStack spacing={3} align="stretch">
        <Text fontSize="sm" fontWeight="bold" color="gray.700" _dark={{ color: "white" }}>
          🔐 Test User Switcher
        </Text>
        
        <HStack spacing={2}>
          <Badge colorScheme={isAdmin ? "red" : isCustomer ? "blue" : "gray"}>
            {isAdmin ? "ADMIN" : isCustomer ? "CUSTOMER" : "MIXED"}
          </Badge>
          <Text fontSize="xs" color="gray.500">
            {getAssignedClaims().length} claims
          </Text>
        </HStack>

        <VStack spacing={2} align="stretch">
          <Button
            size="sm"
            colorScheme="red"
            variant="outline"
            onClick={() => switchUser('admin-user')}
          >
            Admin User (FullControl)
          </Button>
          
          <Button
            size="sm"
            colorScheme="blue"
            variant="outline"
            onClick={() => switchUser('customer-user')}
          >
            Customer User (No Read)
          </Button>
          
          <Button
            size="sm"
            colorScheme="green"
            variant="outline"
            onClick={() => switchUser('mock-user-id')}
          >
            Mixed User (Some Admin)
          </Button>
        </VStack>

        <Box fontSize="xs" color="gray.500" maxW="200px">
          <Text fontWeight="bold">Current Claims:</Text>
          {getAssignedClaims().map(claim => (
            <Text key={claim} fontSize="xs">• {claim}</Text>
          ))}
        </Box>
      </VStack>
    </Box>
  );
};

export default UserSwitcher;
