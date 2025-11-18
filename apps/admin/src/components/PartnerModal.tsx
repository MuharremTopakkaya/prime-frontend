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
  Switch,
  FormHelperText,
} from '@chakra-ui/react';

interface PartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (partnerData: { name: string; contactEmail: string; isActive: boolean }) => void;
  isEditMode?: boolean;
  initialData?: { name: string; apiKey?: string; apiToken?: string; contactEmail: string; isActive: boolean };
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
  const [contactEmail, setContactEmail] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [apiKeyDisplay, setApiKeyDisplay] = useState('');
  const [apiTokenDisplay, setApiTokenDisplay] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setContactEmail(initialData.contactEmail);
      setIsActive(initialData.isActive);
      setApiKeyDisplay(initialData.apiKey ?? '');
      setApiTokenDisplay(initialData.apiToken ?? '');
    } else {
      setName('');
      setContactEmail('');
      setIsActive(true);
      setApiKeyDisplay('');
      setApiTokenDisplay('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = () => {
    if (!name.trim() || !contactEmail.trim()) {
      toast({
        title: t('errors.validationError'),
        description: t('errors.required'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    onSave({ name, contactEmail, isActive });
  };

  const isFormValid = () => {
    return name.trim() !== '' && contactEmail.trim() !== '';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay 
        bg="blackAlpha.600"
        _dark={{
          bg: "blackAlpha.700"
        }}
      />
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

          {isEditMode && (
            <>
              <FormControl mb={4}>
                <FormLabel
                  color="gray.600"
                  _dark={{
                    color: "gray.300"
                  }}
                >
                  {t('partners.apiKey')}
                </FormLabel>
                <Input
                  value={apiKeyDisplay}
                  isReadOnly
                  _dark={{
                    bg: "navy.700",
                    borderColor: "blue.500",
                    color: "white",
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
                  {t('partners.apiToken')}
                </FormLabel>
                <Input
                  value={apiTokenDisplay}
                  isReadOnly
                  _dark={{
                    bg: "navy.700",
                    borderColor: "blue.500",
                    color: "white",
                  }}
                />
              </FormControl>
            </>
          )}

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

