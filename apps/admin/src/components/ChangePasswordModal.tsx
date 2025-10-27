import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useColorModeValue,
  Text,
  InputGroup,
  InputRightElement,
  IconButton
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { password: string; newPassword: string }) => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const modalBg = useColorModeValue('white', 'navy.800');
  const borderColor = useColorModeValue('gray.200', 'blue.600');

  const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!password.trim()) {
      newErrors.password = t('profile.currentPasswordRequired');
    }

    if (!newPassword.trim()) {
      newErrors.newPassword = t('profile.newPasswordRequired');
    } else if (!passwordRegex.test(newPassword)) {
      newErrors.newPassword = t('profile.passwordRequirements');
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = t('profile.confirmPasswordRequired');
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = t('profile.passwordsDoNotMatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave({ password, newPassword });
    }
  };

  const handleClose = () => {
    setPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <ModalOverlay
        bg="blackAlpha.600"
        _dark={{
          bg: "blackAlpha.700"
        }}
      />
      <ModalContent 
        bg={modalBg} 
        borderColor={borderColor}
        border="1px solid"
        _dark={{
          bg: "navy.800",
          borderColor: "blue.600"
        }}
      >
        <ModalHeader>{t('profile.changePassword')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isInvalid={!!errors.password}>
              <FormLabel color={useColorModeValue('gray.700', 'white')}>{t('profile.currentPassword')}</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('profile.currentPasswordPlaceholder')}
                  _dark={{
                    bg: 'navy.700',
                    borderColor: 'blue.500',
                    color: 'white',
                    _placeholder: { color: 'gray.300' },
                    _focus: {
                      borderColor: 'blue.400',
                      bg: 'navy.700'
                    }
                  }}
                />
                <InputRightElement>
                  <IconButton
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    _dark={{ color: 'gray.300' }}
                  />
                </InputRightElement>
              </InputGroup>
              {errors.password && <Text color="red.500" fontSize="sm">{errors.password}</Text>}
            </FormControl>

            <FormControl isInvalid={!!errors.newPassword}>
              <FormLabel color={useColorModeValue('gray.700', 'white')}>{t('profile.newPassword')}</FormLabel>
              <InputGroup>
                <Input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t('profile.newPasswordPlaceholder')}
                  _dark={{
                    bg: 'navy.700',
                    borderColor: 'blue.500',
                    color: 'white',
                    _placeholder: { color: 'gray.300' },
                    _focus: {
                      borderColor: 'blue.400',
                      bg: 'navy.700'
                    }
                  }}
                />
                <InputRightElement>
                  <IconButton
                    aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                    icon={showNewPassword ? <ViewOffIcon /> : <ViewIcon />}
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    _dark={{ color: 'gray.300' }}
                  />
                </InputRightElement>
              </InputGroup>
              {errors.newPassword && <Text color="red.500" fontSize="sm">{errors.newPassword}</Text>}
            </FormControl>

            <FormControl isInvalid={!!errors.confirmPassword}>
              <FormLabel color={useColorModeValue('gray.700', 'white')}>{t('profile.confirmPassword')}</FormLabel>
              <InputGroup>
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t('profile.confirmPasswordPlaceholder')}
                  _dark={{
                    bg: 'navy.700',
                    borderColor: 'blue.500',
                    color: 'white',
                    _placeholder: { color: 'gray.300' },
                    _focus: {
                      borderColor: 'blue.400',
                      bg: 'navy.700'
                    }
                  }}
                />
                <InputRightElement>
                  <IconButton
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    _dark={{ color: 'gray.300' }}
                  />
                </InputRightElement>
              </InputGroup>
              {errors.confirmPassword && <Text color="red.500" fontSize="sm">{errors.confirmPassword}</Text>}
            </FormControl>

            <Text 
              fontSize="sm" 
              color={useColorModeValue('gray.500', 'gray.300')} 
              textAlign="center"
            >
              {t('profile.passwordRequirements')}
            </Text>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleClose}>
            {t('common.cancel')}
          </Button>
          <Button colorScheme="orange" onClick={handleSubmit}>
            {t('profile.changePassword')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ChangePasswordModal;
