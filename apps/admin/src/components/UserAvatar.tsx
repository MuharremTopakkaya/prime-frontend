import React from 'react';
import {
  Avatar,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  Icon,
  useDisclosure
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { UserProfile } from '../../services/userProfileService';

interface UserAvatarProps {
  userProfile?: UserProfile;
  onProfileClick: () => void;
  onLogout: () => void;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ userProfile, onProfileClick, onLogout }) => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const avatarBg = useColorModeValue('blue.500', 'blue.400');
  const menuBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const getInitials = (name: string, surname: string) => {
    return `${name.charAt(0).toUpperCase()}${surname.charAt(0).toUpperCase()}`;
  };

  const handleLogout = () => {
    logout();
    onLogout();
  };

  if (!userProfile) {
    return null;
  }

  return (
    <Menu>
      <MenuButton
        as={Button}
        variant="ghost"
        rightIcon={<ChevronDownIcon />}
        leftIcon={
          <Avatar
            size="sm"
            bg={avatarBg}
            color="white"
            name={getInitials(userProfile.name, userProfile.surname)}
          />
        }
        _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
        _active={{ bg: useColorModeValue('gray.200', 'gray.600') }}
      >
        <Box textAlign="left" display={{ base: 'none', md: 'block' }}>
          <Text fontSize="sm" fontWeight="medium">
            {userProfile.name} {userProfile.surname}
          </Text>
          <Text fontSize="xs" color={useColorModeValue('gray.500', 'gray.400')}>
            {userProfile.email}
          </Text>
        </Box>
      </MenuButton>
      <MenuList bg={menuBg} borderColor={borderColor}>
        <MenuItem onClick={onProfileClick} icon={<Icon as={ChevronDownIcon} />}>
          {t('profile.myProfile')}
        </MenuItem>
        <MenuItem onClick={handleLogout} color="red.500">
          {t('common.logout')}
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default UserAvatar;
