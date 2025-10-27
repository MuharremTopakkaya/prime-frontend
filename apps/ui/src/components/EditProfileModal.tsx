import React, { useState, useEffect } from 'react';
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
  Text
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; surname: string; email: string }) => void;
  initialData?: { name: string; surname: string; email: string };
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const modalBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setSurname(initialData.surname);
      setEmail(initialData.email);
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = t('profile.nameRequired');
    }

    if (!surname.trim()) {
      newErrors.surname = t('profile.surnameRequired');
    }

    if (!email.trim()) {
      newErrors.email = t('profile.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t('profile.emailInvalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave({ name, surname, email });
    }
  };

  const handleClose = () => {
    setName('');
    setSurname('');
    setEmail('');
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <ModalOverlay />
      <ModalContent bg={modalBg} borderColor={borderColor}>
        <ModalHeader>{t('profile.editProfile')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isInvalid={!!errors.name}>
              <FormLabel>{t('profile.name')}</FormLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('profile.namePlaceholder')}
              />
              {errors.name && <Text color="red.500" fontSize="sm">{errors.name}</Text>}
            </FormControl>

            <FormControl isInvalid={!!errors.surname}>
              <FormLabel>{t('profile.surname')}</FormLabel>
              <Input
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                placeholder={t('profile.surnamePlaceholder')}
              />
              {errors.surname && <Text color="red.500" fontSize="sm">{errors.surname}</Text>}
            </FormControl>

            <FormControl isInvalid={!!errors.email}>
              <FormLabel>{t('profile.email')}</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('profile.emailPlaceholder')}
              />
              {errors.email && <Text color="red.500" fontSize="sm">{errors.email}</Text>}
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleClose}>
            {t('common.cancel')}
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit}>
            {t('profile.saveChanges')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditProfileModal;
