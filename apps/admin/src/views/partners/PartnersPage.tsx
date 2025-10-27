import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Flex,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  Card,
  CardBody,
  Text,
  Tooltip,
  useColorModeValue,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { ChevronDownIcon, AddIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { partnerService, Partner } from '../../services/partnerService';
import PartnerModal from '../../components/PartnerModal';
import Pagination from '../../components/Pagination';

const PartnersPage: React.FC = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [saving, setSaving] = useState(false);
  const [visibleApiKeys, setVisibleApiKeys] = useState<Set<string>>(new Set());
  const [deletingPartner, setDeletingPartner] = useState<Partner | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  // Mask API key: show first 2 and last 2 characters
  const maskApiKey = (apiKey: string): string => {
    if (apiKey.length <= 4) return '****';
    return `${apiKey.substring(0, 2)}${'*'.repeat(apiKey.length - 4)}${apiKey.substring(apiKey.length - 2)}`;
  };

  // Toggle API key visibility
  const toggleApiKeyVisibility = (partnerId: string) => {
    setVisibleApiKeys((prev) => {
      const next = new Set(prev);
      if (next.has(partnerId)) {
        next.delete(partnerId);
      } else {
        next.add(partnerId);
      }
      return next;
    });
  };

  // Get API key display value
  const getApiKeyDisplay = (partner: Partner): string => {
    if (visibleApiKeys.has(partner.id)) {
      return partner.apiKey;
    }
    return maskApiKey(partner.apiKey);
  };

  // Fetch partners
  const fetchPartners = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await partnerService.getPartners(currentPage, 12);
      setPartners(response.items);
      setTotalPages(response.pagination.pages);
      setTotalRecords(response.pagination.count);
      setHasPrevious(response.pagination.hasPrevious);
      setHasNext(response.pagination.hasNext);
    } catch (err) {
      console.error('Error fetching partners:', err);
      setError('Failed to load partners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, [currentPage]);

  const handleAddPartner = () => {
    setIsEditMode(false);
    setEditingPartner(null);
    setIsModalOpen(true);
  };

  const handleEditPartner = (partner: Partner) => {
    setIsEditMode(true);
    setEditingPartner(partner);
    setIsModalOpen(true);
  };

  const handleSavePartner = async (partnerData: { name: string; apiKey: string }) => {
    setSaving(true);
    try {
      if (isEditMode && editingPartner) {
        await partnerService.updatePartner({
          id: editingPartner.id,
          name: partnerData.name,
          apiKey: partnerData.apiKey,
        });
        toast({
          title: t('partners.partnerUpdatedSuccessfully'),
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await partnerService.createPartner(partnerData);
        toast({
          title: t('partners.partnerAddedSuccessfully'),
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      setIsModalOpen(false);
      fetchPartners();
    } catch (err) {
      console.error('Error saving partner:', err);
      toast({
        title: t('errors.somethingWentWrong'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleDetails = () => {
    // Details button is disabled, no action needed
  };

  const handleDeletePartner = (partner: Partner) => {
    setDeletingPartner(partner);
    onDeleteOpen();
  };

  const confirmDeletePartner = async () => {
    if (!deletingPartner) return;
    
    setDeleting(true);
    try {
      await partnerService.deletePartner(deletingPartner.id);
      toast({
        title: t('partners.partnerDeletedSuccessfully'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onDeleteClose();
      fetchPartners();
    } catch (err) {
      console.error('Error deleting partner:', err);
      toast({
        title: t('errors.somethingWentWrong'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setDeleting(false);
      setDeletingPartner(null);
    }
  };

  if (error) {
    return (
      <Box p={6}>
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  return (
    <Box p={{ base: 4, md: 6 }} pt={{ base: 16, md: 20 }}>
      {/* Header Section */}
      <Box mb={12}>
        <Flex justify="flex-end" mb={10}>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={handleAddPartner}
            size={{ base: "sm", md: "md" }}
          >
            {t('partners.addPartner')}
          </Button>
        </Flex>
      </Box>

      {/* Main Content Card */}
      <Card
        boxShadow="lg"
        border="1px solid"
        borderColor="gray.200"
        _dark={{
          borderColor: "blue.600",
          bg: "navy.800"
        }}
      >
        <CardBody p={0}>
          {partners.length === 0 ? (
            <Box textAlign="center" py={10}>
              <Text color="gray.500" fontSize="md">
                {t('partners.noPartnersFound')}
              </Text>
            </Box>
          ) : (
            <>
              {/* Table Container */}
              <Box overflowX="auto">
                <Table variant="simple" size="md">
                  <Thead
                    bg="gray.100"
                    _dark={{
                      bg: "navy.700"
                    }}
                  >
                    <Tr>
                      <Th color="gray.700" _dark={{ color: "gray.300" }}>{t('common.name')}</Th>
                      <Th color="gray.700" _dark={{ color: "gray.300" }}>{t('partners.apiKey')}</Th>
                      <Th color="gray.700" _dark={{ color: "gray.300" }}>{t('common.createdDate')}</Th>
                      <Th color="gray.700" _dark={{ color: "gray.300" }}>{t('common.updatedDate')}</Th>
                      <Th color="gray.700" _dark={{ color: "gray.300" }}>{t('common.actions')}</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {partners.map((partner, index) => (
                      <Tr
                        key={partner.id}
                        _hover={{
                          bg: "gray.50",
                          _dark: {
                            bg: "navy.600"
                          }
                        }}
                        bg={index % 2 === 0 ? "white" : "gray.50"}
                        _dark={{
                          bg: index % 2 === 0 ? "navy.800" : "navy.700"
                        }}
                      >
                        <Td color="gray.700" _dark={{ color: "gray.300" }}>{partner.name}</Td>
                        <Td>
                          <Flex align="center" gap={2}>
                            <Text color="gray.700" _dark={{ color: "gray.300" }} fontFamily="mono">
                              {getApiKeyDisplay(partner)}
                            </Text>
                            <IconButton
                              aria-label={visibleApiKeys.has(partner.id) ? t('partners.hideApiKey') : t('partners.showApiKey')}
                              icon={visibleApiKeys.has(partner.id) ? <ViewOffIcon /> : <ViewIcon />}
                              onClick={() => toggleApiKeyVisibility(partner.id)}
                              size="xs"
                              variant="ghost"
                            />
                          </Flex>
                        </Td>
                        <Td color="gray.700" _dark={{ color: "gray.300" }}>
                          {new Date(partner.createdDate).toLocaleDateString()}
                        </Td>
                        <Td color="gray.700" _dark={{ color: "gray.300" }}>
                          {new Date(partner.updatedDate).toLocaleDateString()}
                        </Td>
                        <Td>
                          <Menu>
                            <MenuButton
                              as={IconButton}
                              icon={<ChevronDownIcon />}
                              variant="ghost"
                              size="sm"
                            />
                            <MenuList>
                              <MenuItem onClick={() => handleEditPartner(partner)}>
                                {t('common.update')}
                              </MenuItem>
                              <MenuItem onClick={handleDetails} isDisabled>
                                {t('common.details')}
                              </MenuItem>
                              <MenuItem onClick={() => handleDeletePartner(partner)} color="red.500">
                                {t('common.delete')}
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>

              {/* Pagination */}
              <Box p={6} pt={4}>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalRecords={totalRecords}
                  hasPrevious={hasPrevious}
                  hasNext={hasNext}
                  onPageChange={handlePageChange}
                />
              </Box>
            </>
          )}
        </CardBody>
      </Card>

      <PartnerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePartner}
        isEditMode={isEditMode}
        initialData={editingPartner ? { name: editingPartner.name, apiKey: editingPartner.apiKey } : undefined}
        loading={saving}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {t('partners.confirmDeletePartner')}
            </AlertDialogHeader>

            <AlertDialogBody>
              {t('partners.confirmDeleteMessage', { name: deletingPartner?.name })}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                {t('common.cancel')}
              </Button>
              <Button 
                colorScheme="red" 
                onClick={confirmDeletePartner} 
                ml={3}
                isLoading={deleting}
              >
                {t('common.delete')}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default PartnersPage;

