import React from 'react';
import { Box, Button, VStack, Text, HStack, Badge, IconButton, useBreakpointValue } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { useClaims } from '../contexts/ClaimsContext';

const UserSwitcher: React.FC = () => {
  const { userClaims, isAdmin, isCustomer } = useClaims();
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const [collapsed, setCollapsed] = React.useState(true);

  React.useEffect(() => {
    if (isDesktop) {
      setCollapsed(false);
    } else {
      setCollapsed(true);
    }
  }, [isDesktop]);

  const switchUser = (userId: string) => {
    localStorage.setItem('testUserId', userId);
    
    // Root'a yönlendir - App.tsx'teki authentication kontrolü yapılacak
    // Customer seçildiğinde login ekranına, admin seçildiğinde admin default'a yönlendirecek
    window.location.href = '/';
  };

  const getAssignedClaims = () => {
    return userClaims.flatMap(group => 
      group.claims.filter(claim => claim.isAssigned).map(claim => claim.name)
    );
  };

  if (collapsed) {
    return (
      <Box
        position="fixed"
        bottom="20px"
        right="20px"
        bg="white"
        px={3}
        py={2}
        borderRadius="full"
        boxShadow="lg"
        border="1px solid"
        borderColor="gray.200"
        zIndex={1000}
        alignItems="center"
        gap={2}
        _dark={{ bg: "navy.800", borderColor: "blue.600" }}
        display={{ base: "flex", lg: "flex" }}
      >
        <Text fontSize="xs" color="gray.700" _dark={{ color: "white" }}>Test User Switcher</Text>
        <IconButton aria-label="Expand switcher" size="xs" icon={<ChevronUpIcon />} onClick={() => setCollapsed(false)} />
      </Box>
    );
  }

  return (
    <Box 
      position="fixed" 
      bottom={{ base: '16px', lg: '20px' }} 
      right={{ base: '16px', lg: '20px' }} 
      bg="white" 
      p={4} 
      borderRadius="md" 
      boxShadow="lg"
      border="1px solid"
      borderColor="gray.200"
      zIndex={1000}
      display={{ base: "block", lg: "block" }}
      w={{ base: 'calc(100% - 32px)', sm: '260px', lg: 'auto' }}
      maxW={{ base: '320px', lg: 'unset' }}
      _dark={{
        bg: "navy.800",
        borderColor: "blue.600"
      }}
    >
      <VStack spacing={3} align="stretch">
        <HStack justify="space-between">
          <Text fontSize="sm" fontWeight="bold" color="gray.700" _dark={{ color: "white" }}>
            🔐 Test User Switcher
          </Text>
          <IconButton aria-label="Minimize switcher" size="xs" icon={<ChevronDownIcon />} onClick={() => setCollapsed(true)} />
        </HStack>
        
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
