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
  Textarea,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
  Switch,
  FormHelperText,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

interface PartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (partnerData: { name: string; apiKey: string; apiToken: string; contactEmail: string; isActive: boolean }) => void;
  isEditMode?: boolean;
  initialData?: { name: string; apiKey: string; apiToken: string; contactEmail: string; isActive: boolean };
  loading?: boolean;
}

const PartnerModal: React.FC<PartnerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isEditMode = false,
  initialData,
  loading = false,
}) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [name, setName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiToken, setApiToken] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showApiToken, setShowApiToken] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setApiKey(initialData.apiKey);
      setApiToken(initialData.apiToken);
      setContactEmail(initialData.contactEmail);
      setIsActive(initialData.isActive);
    } else {
      setName('');
      setApiKey('');
      setApiToken('');
      setContactEmail('');
      setIsActive(true);
    }
  }, [initialData, isOpen]);

  const handleSubmit = () => {
    if (!name.trim() || !apiKey.trim() || !apiToken.trim() || !contactEmail.trim()) {
      toast({
        title: t('errors.validationError'),
        description: t('errors.required'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    onSave({ name, apiKey, apiToken, contactEmail, isActive });
  };

  const isFormValid = () => {
    return name.trim() !== '' && apiKey.trim() !== '' && apiToken.trim() !== '' && contactEmail.trim() !== '';
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
          {isEditMode ? t('partners.editPartner') : t('partners.addPartner')}
        </ModalHeader>
        <ModalCloseButton
          color="gray.500"
          _dark={{
            color: "gray.300"
          }}
        />

        <ModalBody pb={6}>
          <FormControl isRequired mb={4}>
            <FormLabel
              color="gray.600"
              _dark={{
                color: "gray.300"
              }}
            >
              {t('partners.partnerName')}
            </FormLabel>
            <Input
              placeholder={t('partners.partnerName')}
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

          <FormControl isRequired mb={4}>
            <FormLabel
              color="gray.600"
              _dark={{
                color: "gray.300"
              }}
            >
              {t('partners.apiKey')}
            </FormLabel>
            <InputGroup>
              <Input
                type={showApiKey ? 'text' : 'password'}
                placeholder={t('partners.apiKey')}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                _dark={{
                  bg: "navy.700",
                  borderColor: "blue.500",
                  color: "white",
                  _placeholder: {
                    color: "gray.400"
                  }
                }}
              />
              <InputRightElement>
                <IconButton
                  aria-label={showApiKey ? t('partners.hideApiKey') : t('partners.showApiKey')}
                  icon={showApiKey ? <ViewOffIcon /> : <ViewIcon />}
                  onClick={() => setShowApiKey(!showApiKey)}
                  variant="ghost"
                  size="sm"
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <FormControl isRequired mb={4}>
            <FormLabel
              color="gray.600"
              _dark={{
                color: "gray.300"
              }}
            >
              {t('partners.apiToken')}
            </FormLabel>
            <InputGroup>
              <Input
                type={showApiToken ? 'text' : 'password'}
                placeholder={t('partners.apiToken')}
                value={apiToken}
                onChange={(e) => setApiToken(e.target.value)}
                _dark={{
                  bg: "navy.700",
                  borderColor: "blue.500",
                  color: "white",
                  _placeholder: {
                    color: "gray.400"
                  }
                }}
              />
              <InputRightElement>
                <IconButton
                  aria-label={showApiToken ? t('partners.hideApiToken') : t('partners.showApiToken')}
                  icon={showApiToken ? <ViewOffIcon /> : <ViewIcon />}
                  onClick={() => setShowApiToken(!showApiToken)}
                  variant="ghost"
                  size="sm"
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <FormControl isRequired mb={4}>
            <FormLabel
              color="gray.600"
              _dark={{
                color: "gray.300"
              }}
            >
              {t('partners.contactEmail')}
            </FormLabel>
            <Input
              type="email"
              placeholder={t('partners.contactEmail')}
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
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

          <FormControl mb={4}>
            <FormLabel
              color="gray.600"
              _dark={{
                color: "gray.300"
              }}
            >
              {t('partners.status')}
            </FormLabel>
            <Switch
              isChecked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              colorScheme="green"
            />
            <FormHelperText
              color="gray.500"
              _dark={{ color: "gray.400" }}
            >
              {isActive ? t('partners.active') : t('partners.inactive')}
            </FormHelperText>
          </FormControl>
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
            {isEditMode ? t('common.update') : t('common.save')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PartnerModal;

