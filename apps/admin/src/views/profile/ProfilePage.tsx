import React, { useState, useEffect } from 'react';
import {
  Box,
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
    <Box p={6} pt={20}>
      <VStack spacing={6} align="stretch">
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
            <HStack justify="space-between" mb={4}>
              <Heading 
                size="lg"
                color={useColorModeValue('gray.800', 'white')}
              >
                {t('profile.myProfile')}
              </Heading>
              <HStack>
                <Button
                  leftIcon={<EditIcon />}
                  colorScheme="blue"
                  variant="outline"
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
            </HStack>
            
            <Divider mb={4} />
            
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <Text 
                  fontWeight="semibold"
                  color={useColorModeValue('gray.800', 'white')}
                >
                  {t('profile.name')}:
                </Text>
                <Text color={textColor}>{userProfile.name}</Text>
              </HStack>
              
              <HStack justify="space-between">
                <Text 
                  fontWeight="semibold"
                  color={useColorModeValue('gray.800', 'white')}
                >
                  {t('profile.surname')}:
                </Text>
                <Text color={textColor}>{userProfile.surname}</Text>
              </HStack>
              
              <HStack justify="space-between">
                <Text 
                  fontWeight="semibold"
                  color={useColorModeValue('gray.800', 'white')}
                >
                  {t('profile.email')}:
                </Text>
                <Text color={textColor}>{userProfile.email}</Text>
              </HStack>
              
              <HStack justify="space-between">
                <Text 
                  fontWeight="semibold"
                  color={useColorModeValue('gray.800', 'white')}
                >
                  {t('profile.company')}:
                </Text>
                <Text color={textColor}>{userProfile.company.name}</Text>
              </HStack>
              
              <HStack justify="space-between">
                <Text 
                  fontWeight="semibold"
                  color={useColorModeValue('gray.800', 'white')}
                >
                  {t('profile.memberSince')}:
                </Text>
                <Text color={textColor}>
                  {new Date(userProfile.createdDate).toLocaleDateString()}
                </Text>
              </HStack>
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
