import React from 'react';
import { Box, Button, Heading, Text, VStack, useColorModeValue } from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';

const CustomerDashboard: React.FC = () => {
  const { logout, authenticationMethod } = useAuth();
  const textColor = useColorModeValue("navy.700", "white");
  const bgColor = useColorModeValue("white", "navy.800");

  return (
    <Box minH="100vh" bg={bgColor} p={8}>
      <VStack spacing={6} align="center" maxW="800px" mx="auto">
        <Heading color={textColor} size="xl">
          Müşteri Paneli
        </Heading>
        
        <Text color={textColor} fontSize="lg" textAlign="center">
          Hoş geldiniz! Bu müşteri paneline erişim yetkiniz bulunmaktadır.
        </Text>
        
        <Box p={6} bg={useColorModeValue("gray.50", "gray.700")} borderRadius="lg" w="100%">
          <VStack spacing={4}>
            <Text color={textColor} fontWeight="bold">
              Kullanıcı Bilgileri:
            </Text>
            <Text color={textColor}>
              Authentication Method: {authenticationMethod}
            </Text>
            <Text color={textColor}>
              Bu panel Customer authentication method'u olan kullanıcılar içindir.
            </Text>
          </VStack>
        </Box>
        
        <Button
          colorScheme="red"
          onClick={logout}
          size="lg"
        >
          Çıkış Yap
        </Button>
        
        <Box p={4} bg={useColorModeValue("blue.50", "blue.900")} borderRadius="md" w="100%">
          <Text color={textColor} fontSize="sm" textAlign="center">
            Bu panel geliştirme aşamasındadır. İstediğiniz özellikleri buraya ekleyebilirsiniz.
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default CustomerDashboard;
