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
  Select,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { companyService, Company, OperationalStatus, CreateCompanyRequest, UpdateCompanyRequest } from '../services/companyService';

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  company?: Company | null;
  isEditMode: boolean;
  onCompanySaved: () => void;
  onCompanyUpdated: () => void;
}

const CompanyModal: React.FC<CompanyModalProps> = ({
  isOpen,
  onClose,
  company,
  isEditMode,
  onCompanySaved,
  onCompanyUpdated,
}) => {
  const { t } = useTranslation();
  const toast = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    taxNumber: '',
    industry: '',
    address: '',
    status: OperationalStatus.Active,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && company) {
        setFormData({
          name: company.name,
          taxNumber: company.taxNumber,
          industry: company.industry,
          address: company.address,
          status: company.status,
        });
      } else {
        setFormData({
          name: '',
          taxNumber: '',
          industry: '',
          address: '',
          status: OperationalStatus.Active,
        });
      }
    }
  }, [isOpen, isEditMode, company]);

  const handleInputChange = (field: string, value: string | OperationalStatus) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (isEditMode && company) {
        const updateData: UpdateCompanyRequest = {
          id: company.id,
          ...formData,
        };
        await companyService.updateCompany(updateData);
        onCompanyUpdated();
      } else {
        const createData: CreateCompanyRequest = {
          ...formData,
        };
        await companyService.createCompany(createData);
        onCompanySaved();
      }
    } catch (error) {
      toast({
        title: t('errors.somethingWentWrong'),
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return formData.name.trim() !== '' && 
           formData.taxNumber.trim() !== '' && 
           formData.industry.trim() !== '' && 
           formData.address.trim() !== '';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: "full", md: "lg" }}>
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
          {isEditMode ? t('companies.editCompany') : t('companies.addCompany')}
        </ModalHeader>
        <ModalCloseButton
          color="gray.500"
          _dark={{
            color: "gray.300"
          }}
        />
        
        <ModalBody pb={{ base: 4, md: 6 }}>
          <FormControl isRequired mb={4}>
            <FormLabel
              color="gray.600"
              _dark={{
                color: "gray.300"
              }}
            >
              {t('companies.companyName')}
            </FormLabel>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder={t('companies.companyName')}
              bg="white"
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
              {t('companies.taxNumber')}
            </FormLabel>
            <Input
              value={formData.taxNumber}
              onChange={(e) => handleInputChange('taxNumber', e.target.value)}
              placeholder={t('companies.taxNumber')}
              bg="white"
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
              {t('companies.industry')}
            </FormLabel>
            <Input
              value={formData.industry}
              onChange={(e) => handleInputChange('industry', e.target.value)}
              placeholder={t('companies.industry')}
              bg="white"
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
              {t('companies.companyAddress')}
            </FormLabel>
            <Textarea
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder={t('companies.companyAddress')}
              rows={3}
              bg="white"
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
              {t('companies.companyStatus')}
            </FormLabel>
            <Select
              value={formData.status}
              onChange={(e) => handleInputChange('status', parseInt(e.target.value) as OperationalStatus)}
              bg="white"
              _dark={{
                bg: "navy.700",
                borderColor: "blue.500",
                color: "white"
              }}
            >
              <option value={OperationalStatus.Active}>
                {t('companies.status.active')}
              </option>
              <option value={OperationalStatus.Inactive}>
                {t('companies.status.inactive')}
              </option>
              <option value={OperationalStatus.Suspended}>
                {t('companies.status.suspended')}
              </option>
              <option value={OperationalStatus.Pending}>
                {t('companies.status.pending')}
              </option>
            </Select>
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

export default CompanyModal;
