import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
  useToast,
  Checkbox,
  VStack,
  Text,
} from '@chakra-ui/react';

interface UserUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: { name: string; surname: string; email: string; password?: string }) => void;
  initialData?: { name: string; surname: string; email: string };
  loading?: boolean;
  mode?: 'create' | 'edit';
}

const UserUpdateModal: React.FC<UserUpdateModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  loading = false,
  mode = 'edit',
}) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [updatePassword, setUpdatePassword] = useState(false);
  const isCreateMode = mode === 'create';

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setSurname(initialData.surname);
      setEmail(initialData.email);
    } else {
      setName('');
      setSurname('');
      setEmail('');
    }
    setPassword('');
    setPasswordRepeat('');
    setUpdatePassword(isCreateMode);
  }, [initialData, isOpen, isCreateMode]);

  const handleSubmit = () => {
    if (!name.trim() || !surname.trim() || !email.trim()) {
      toast({
        title: t('errors.validationError'),
        description: t('errors.required'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (updatePassword) {
      if (!password.trim() || !passwordRepeat.trim()) {
        toast({
          title: t('errors.validationError'),
          description: t('users.passwordRequired'),
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      if (password !== passwordRepeat) {
        toast({
          title: t('errors.validationError'),
          description: t('users.passwordMismatch'),
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
    }

    const userData = {
      name,
      surname,
      email,
      ...(updatePassword && { password }),
    };

    onSave(userData);
  };

  const isFormValid = () => {
    const basicValid = name.trim() !== '' && surname.trim() !== '' && email.trim() !== '';
    
    if (updatePassword) {
      return basicValid && password.trim() !== '' && passwordRepeat.trim() !== '' && password === passwordRepeat;
    }
    
    return basicValid;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent
        bg="white"
        _dark={{
          bg: "navy.800",
          border: "1px solid",
          borderColor: "blue.600"
        }}
      >
        <ModalHeader
          color="gray.700"
          _dark={{
            color: "white"
          }}
        >
          {isCreateMode ? t('users.createUser') : t('users.updateUser')}
        </ModalHeader>
        <ModalCloseButton
          color="gray.500"
          _dark={{
            color: "gray.300"
          }}
        />

        <ModalBody pb={6}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel
                color="gray.600"
                _dark={{
                  color: "gray.300"
                }}
              >
                {t('users.name')}
              </FormLabel>
              <Input
                placeholder={t('users.name')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                _dark={{
                  bg: "navy.700",
                  borderColor: "blue.500",
                  color: "white",
                  _placeholder: {
                    color: "gray.400"
                  }
                }}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel
                color="gray.600"
                _dark={{
                  color: "gray.300"
                }}
              >
                {t('users.surname')}
              </FormLabel>
              <Input
                placeholder={t('users.surname')}
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                _dark={{
                  bg: "navy.700",
                  borderColor: "blue.500",
                  color: "white",
                  _placeholder: {
                    color: "gray.400"
                  }
                }}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel
                color="gray.600"
                _dark={{
                  color: "gray.300"
                }}
              >
                {t('users.email')}
              </FormLabel>
              <Input
                type="email"
                placeholder={t('users.email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                _dark={{
                  bg: "navy.700",
                  borderColor: "blue.500",
                  color: "white",
                  _placeholder: {
                    color: "gray.400"
                  }
                }}
              />
            </FormControl>

            {!isCreateMode && (
              <FormControl>
                <Checkbox
                  isChecked={updatePassword}
                  onChange={(e) => setUpdatePassword(e.target.checked)}
                  colorScheme="brand"
                  color="gray.700"
                  _dark={{
                    color: "gray.300"
                  }}
                >
                  {t('users.updatePassword')}
                </Checkbox>
              </FormControl>
            )}

            {(isCreateMode || updatePassword) && (
              <>
                <FormControl isRequired>
                  <FormLabel
                    color="gray.600"
                    _dark={{
                      color: "gray.300"
                    }}
                  >
                    {t('users.password')}
                  </FormLabel>
                  <Input
                    type="password"
                    placeholder={t('users.password')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    _dark={{
                      bg: "navy.700",
                      borderColor: "blue.500",
                      color: "white",
                      _placeholder: {
                        color: "gray.400"
                      }
                    }}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel
                    color="gray.600"
                    _dark={{
                      color: "gray.300"
                    }}
                  >
                    {t('users.passwordRepeat')}
                  </FormLabel>
                  <Input
                    type="password"
                    placeholder={t('users.passwordRepeat')}
                    value={passwordRepeat}
                    onChange={(e) => setPasswordRepeat(e.target.value)}
                    _dark={{
                      bg: "navy.700",
                      borderColor: "blue.500",
                      color: "white",
                      _placeholder: {
                        color: "gray.400"
                      }
                    }}
                  />
                </FormControl>

                {password && passwordRepeat && password !== passwordRepeat && (
                  <Text color="red.500" fontSize="sm">
                    {t('users.passwordMismatch')}
                  </Text>
                )}
              </>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="ghost"
            mr={3}
            onClick={onClose}
            color="gray.600"
            _dark={{
              color: "gray.300"
            }}
          >
            {t('common.cancel')}
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={loading}
            isDisabled={!isFormValid()}
          >
            {isCreateMode ? t('common.create') : t('common.update')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UserUpdateModal;
