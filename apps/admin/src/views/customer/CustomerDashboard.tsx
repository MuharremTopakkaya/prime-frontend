import React from 'react';
import { Box, Button, Heading, Text, VStack, useColorModeValue } from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';

const CustomerDashboard: React.FC = () => {
  const { logout, authenticationMethod } = useAuth();
  const textColor = useColorModeValue("navy.700", "white");
  const bgColor = useColorModeValue("white", "navy.800");

  return (
    <Box minH="100vh" bg={bgColor} p={{ base: 4, md: 8 }}>
      <VStack spacing={{ base: 4, md: 6 }} align="center" maxW="800px" mx="auto">
        <Heading color={textColor} size={{ base: "lg", md: "xl" }}>
          Müşteri Paneli
        </Heading>
        
        <Text color={textColor} fontSize={{ base: "md", md: "lg" }} textAlign="center">
          Hoş geldiniz! Bu müşteri paneline erişim yetkiniz bulunmaktadır.
        </Text>
        
        <Box p={{ base: 4, md: 6 }} bg={useColorModeValue("gray.50", "gray.700")} borderRadius="lg" w="100%">
          <VStack spacing={{ base: 3, md: 4 }}>
            <Text color={textColor} fontWeight="bold" fontSize={{ base: "sm", md: "md" }}>
              Kullanıcı Bilgileri:
            </Text>
            <Text color={textColor} fontSize={{ base: "sm", md: "md" }}>
              Authentication Method: {authenticationMethod}
            </Text>
            <Text color={textColor} fontSize={{ base: "sm", md: "md" }}>
              Bu panel Customer authentication method'u olan kullanıcılar içindir.
            </Text>
          </VStack>
        </Box>
        
        <Button
          colorScheme="red"
          onClick={logout}
          size={{ base: "md", md: "lg" }}
          w={{ base: "100%", md: "auto" }}
        >
          Çıkış Yap
        </Button>
        
        <Box p={{ base: 3, md: 4 }} bg={useColorModeValue("blue.50", "blue.900")} borderRadius="md" w="100%">
          <Text color={textColor} fontSize={{ base: "xs", md: "sm" }} textAlign="center">
            Bu panel geliştirme aşamasındadır. İstediğiniz özellikleri buraya ekleyebilirsiniz.
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default CustomerDashboard;
