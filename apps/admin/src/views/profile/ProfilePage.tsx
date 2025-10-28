import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Button,
  Card,
  CardBody,
  Heading,
  Divider,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  useToast
} from '@chakra-ui/react';
import { EditIcon, LockIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';
import { userProfileService, UserProfile } from '../../services/userProfileService';
import EditProfileModal from '../../components/EditProfileModal';
import ChangePasswordModal from '../../components/ChangePasswordModal';

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const cardBg = useColorModeValue('white', 'navy.800');
  const borderColor = useColorModeValue('gray.200', 'blue.600');
  const textColor = useColorModeValue('gray.600', 'white');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const profile = await userProfileService.getUserProfile();
      setUserProfile(profile);
    } catch (err) {
      console.error('ProfilePage: Error fetching user profile:', err);
      setError(t('profile.errorLoadingProfile'));
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = async (profileData: { name: string; surname: string; email: string }) => {
    try {
      const response = await userProfileService.updateProfile(profileData);
      
      // Update token in localStorage
      localStorage.setItem('token', response.accessToken);
      
      // Update local state
      setUserProfile(prev => prev ? { ...prev, ...profileData } : null);
      
      toast({
        title: t('profile.profileUpdated'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      setIsEditModalOpen(false);
    } catch (err: any) {
      toast({
        title: t('profile.errorUpdatingProfile'),
        description: err.response?.data?.message || err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleChangePassword = async (passwordData: { password: string; newPassword: string }) => {
    if (!userProfile) return;

    try {
      const response = await userProfileService.changePassword({
        name: userProfile.name,
        surname: userProfile.surname,
        email: userProfile.email,
        password: passwordData.password,
        newPassword: passwordData.newPassword,
      });
      
      // Update token in localStorage
      localStorage.setItem('token', response.accessToken);
      
      toast({
        title: t('profile.passwordChanged'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      setIsPasswordModalOpen(false);
    } catch (err: any) {
      toast({
        title: t('profile.errorChangingPassword'),
        description: err.response?.data?.message || err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="400px">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  if (!userProfile) {
    return (
      <Alert status="warning">
        <AlertIcon />
        {t('profile.noProfileData')}
      </Alert>
    );
  }

  return (
    <Box p={{ base: 4, md: 6, lg: 8 }} pt={{ base: 16, md: 24, lg: 32 }}>
      <VStack spacing={{ base: 4, md: 6 }} align="stretch">
        <Card 
          bg={cardBg} 
          borderColor={borderColor}
          border="1px solid"
          _dark={{
            bg: "navy.800",
            borderColor: "blue.600"
          }}
        >
          <CardBody>
            <Flex 
              justify="space-between" 
              mb={4} 
              direction={{ base: "column", md: "row" }}
              gap={{ base: 4, md: 0 }}
            >
              <Heading 
                size={{ base: "md", md: "lg" }}
                color={useColorModeValue('gray.800', 'white')}
              >
                {t('profile.myProfile')}
              </Heading>
              <HStack spacing={{ base: 2, md: 3 }}>
                <Button
                  leftIcon={<EditIcon />}
                  colorScheme="blue"
                  variant="outline"
                  fontSize={{ base: "xs", md: "md" }}
                  onClick={() => setIsEditModalOpen(true)}
                  _dark={{
                    borderColor: "blue.400",
                    color: "blue.300",
                    _hover: {
                      bg: "blue.900",
                      borderColor: "blue.300"
                    }
                  }}
                >
                  {t('profile.editProfile')}
                </Button>
                <Button
                  leftIcon={<LockIcon />}
                  colorScheme="orange"
                  variant="outline"
                  fontSize={{ base: "xs", md: "md" }}
                  onClick={() => setIsPasswordModalOpen(true)}
                  _dark={{
                    borderColor: "orange.400",
                    color: "orange.300",
                    _hover: {
                      bg: "orange.900",
                      borderColor: "orange.300"
                    }
                  }}
                >
                  {t('profile.changePassword')}
                </Button>
              </HStack>
            </Flex>
            
            <Divider mb={4} />
            
            <VStack spacing={{ base: 3, md: 4 }} align="stretch">
              <Flex 
                justify="space-between" 
                direction={{ base: "column", md: "row" }}
                gap={{ base: 1, md: 0 }}
              >
                <Text 
                  fontWeight="semibold"
                  color={useColorModeValue('gray.800', 'white')}
                  fontSize={{ base: "xs", md: "md" }}
                >
                  {t('profile.name')}:
                </Text>
                <Text color={textColor} fontSize={{ base: "sm", md: "md" }}>{userProfile.name}</Text>
              </Flex>
              
              <Flex 
                justify="space-between" 
                direction={{ base: "column", md: "row" }}
                gap={{ base: 1, md: 0 }}
              >
                <Text 
                  fontWeight="semibold"
                  color={useColorModeValue('gray.800', 'white')}
                  fontSize={{ base: "xs", md: "md" }}
                >
                  {t('profile.surname')}:
                </Text>
                <Text color={textColor} fontSize={{ base: "sm", md: "md" }}>{userProfile.surname}</Text>
              </Flex>
              
              <Flex 
                justify="space-between" 
                direction={{ base: "column", md: "row" }}
                gap={{ base: 1, md: 0 }}
              >
                <Text 
                  fontWeight="semibold"
                  color={useColorModeValue('gray.800', 'white')}
                  fontSize={{ base: "xs", md: "md" }}
                >
                  {t('profile.email')}:
                </Text>
                <Text color={textColor} fontSize={{ base: "sm", md: "md" }}>{userProfile.email}</Text>
              </Flex>
              
              <Flex 
                justify="space-between" 
                direction={{ base: "column", md: "row" }}
                gap={{ base: 1, md: 0 }}
              >
                <Text 
                  fontWeight="semibold"
                  color={useColorModeValue('gray.800', 'white')}
                  fontSize={{ base: "xs", md: "md" }}
                >
                  {t('profile.company')}:
                </Text>
                <Text color={textColor} fontSize={{ base: "sm", md: "md" }}>{userProfile.company.name}</Text>
              </Flex>
              
              <Flex 
                justify="space-between" 
                direction={{ base: "column", md: "row" }}
                gap={{ base: 1, md: 0 }}
              >
                <Text 
                  fontWeight="semibold"
                  color={useColorModeValue('gray.800', 'white')}
                  fontSize={{ base: "xs", md: "md" }}
                >
                  {t('profile.memberSince')}:
                </Text>
                <Text color={textColor} fontSize={{ base: "sm", md: "md" }}>
                  {new Date(userProfile.createdDate).toLocaleDateString()}
                </Text>
              </Flex>
            </VStack>
          </CardBody>
        </Card>
      </VStack>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditProfile}
        initialData={{
          name: userProfile.name,
          surname: userProfile.surname,
          email: userProfile.email,
        }}
      />

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSave={handleChangePassword}
      />
    </Box>
  );
};

export default ProfilePage;
