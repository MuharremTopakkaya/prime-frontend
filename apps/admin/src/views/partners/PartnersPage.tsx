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
import { ChevronDownIcon, AddIcon, ViewIcon, ViewOffIcon, CopyIcon } from '@chakra-ui/icons';
import { partnerService, Partner } from '../../services/partnerService';
import PartnerModal from '../../components/PartnerModal';
import Pagination from '../../components/Pagination';
import { ProtectedComponent } from '../../components/ProtectedComponent';
import { useClaimCheck } from '../../hooks/useClaimCheck';

const PartnersPage: React.FC = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const { 
    canViewPartners, 
    canCreatePartners, 
    canEditPartners, 
    canDeletePartners 
  } = useClaimCheck();
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
  const [visibleApiTokens, setVisibleApiTokens] = useState<Set<string>>(new Set());
  const [deletingPartner, setDeletingPartner] = useState<Partner | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  // Mask API key: show first 2 and last 2 characters
  const maskApiKey = (apiKey: string): string => {
    if (apiKey.length <= 4) return '****';
    return `${apiKey.substring(0, 2)}${'*'.repeat(apiKey.length - 4)}${apiKey.substring(apiKey.length - 2)}`;
  };

  // Mask API token: show first 2 and last 2 characters
  const maskApiToken = (apiToken: string): string => {
    if (apiToken.length <= 4) return '****';
    return `${apiToken.substring(0, 2)}${'*'.repeat(apiToken.length - 4)}${apiToken.substring(apiToken.length - 2)}`;
  };

  // Toggle API token visibility
  const toggleApiTokenVisibility = (partnerId: string) => {
    setVisibleApiTokens((prev) => {
      const next = new Set(prev);
      if (next.has(partnerId)) {
        next.delete(partnerId);
      } else {
        next.add(partnerId);
      }
      return next;
    });
  };

  // Get API token display value
  const getApiTokenDisplay = (partner: Partner): string => {
    if (visibleApiTokens.has(partner.id)) {
      return partner.apiToken;
    }
    return maskApiToken(partner.apiToken);
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

  // Copy to clipboard functions
  const copyToClipboard = async (text: string, type: 'key' | 'token') => {
    try {
      await navigator.clipboard.writeText(text);
      const typeKey = type === 'key' ? 'partners.apiKeyCopied' : 'partners.apiTokenCopied';
      toast({
        title: t(typeKey),
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: t('errors.somethingWentWrong'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
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
    if (!canCreatePartners) {
      toast({
        title: t('permissions.permissionError'),
        description: t('permissions.noPermissionToAddPartner'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setIsEditMode(false);
    setEditingPartner(null);
    setIsModalOpen(true);
  };

  const handleEditPartner = (partner: Partner) => {
    if (!canEditPartners) {
      toast({
        title: t('permissions.permissionError'),
        description: t('permissions.noPermissionToEditPartner'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setIsEditMode(true);
    setEditingPartner(partner);
    setIsModalOpen(true);
  };

  const handleSavePartner = async (partnerData: { name: string; apiKey: string; apiToken: string; contactEmail: string; isActive: boolean }) => {
    setSaving(true);
    try {
      if (isEditMode && editingPartner) {
        await partnerService.updatePartner({
          id: editingPartner.id,
          name: partnerData.name,
          apiKey: partnerData.apiKey,
          apiToken: partnerData.apiToken,
          contactEmail: partnerData.contactEmail,
          isActive: partnerData.isActive,
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
    if (!canDeletePartners) {
      toast({
        title: t('permissions.permissionError'),
        description: t('permissions.noPermissionToDeletePartner'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
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
          <ProtectedComponent 
            requiredClaims={['Partners.Create', 'Partners.Admin', 'FullControl']}
            requireAny={true}
            fallback={
              <Button
                leftIcon={<AddIcon />}
                colorScheme="gray"
                size={{ base: "sm", md: "md" }}
                isDisabled
                title={t('permissions.noPermissionForAction')}
              >
                {t('partners.addPartner')}
              </Button>
            }
          >
            <Button
              leftIcon={<AddIcon />}
              colorScheme="blue"
              onClick={handleAddPartner}
              size={{ base: "sm", md: "md" }}
            >
              {t('partners.addPartner')}
            </Button>
          </ProtectedComponent>
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
              <Box overflowX="auto" maxW="100%">
                <Table variant="simple" size="md" minW="1200px">
                  <Thead
                    bg="gray.100"
                    _dark={{
                      bg: "navy.700"
                    }}
                  >
                    <Tr>
                      <Th color="gray.700" _dark={{ color: "gray.300" }} w="200px">{t('common.name')}</Th>
                      <Th color="gray.700" _dark={{ color: "gray.300" }} w="180px">{t('partners.apiKey')}</Th>
                      <Th color="gray.700" _dark={{ color: "gray.300" }} w="180px">{t('partners.apiToken')}</Th>
                      <Th color="gray.700" _dark={{ color: "gray.300" }} w="200px">{t('partners.contactEmail')}</Th>
                      <Th color="gray.700" _dark={{ color: "gray.300" }} w="100px">{t('partners.status')}</Th>
                      <Th color="gray.700" _dark={{ color: "gray.300" }} w="120px">{t('common.createdDate')}</Th>
                      <Th color="gray.700" _dark={{ color: "gray.300" }} w="120px">{t('common.updatedDate')}</Th>
                      <Th color="gray.700" _dark={{ color: "gray.300" }} w="80px">{t('common.actions')}</Th>
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
                        <Td>
                          <Text 
                            color="gray.700" 
                            _dark={{ color: "gray.300" }}
                            fontSize="sm"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            whiteSpace="nowrap"
                            maxW="180px"
                          >
                            {partner.name}
                          </Text>
                        </Td>
                        <Td>
                          <Flex align="center" gap={1} maxW="160px">
                            <Text 
                              color="gray.700" 
                              _dark={{ color: "gray.300" }} 
                              fontFamily="mono"
                              fontSize="sm"
                              overflow="hidden"
                              textOverflow="ellipsis"
                              whiteSpace="nowrap"
                              title={visibleApiKeys.has(partner.id) ? partner.apiKey : undefined}
                            >
                              {getApiKeyDisplay(partner)}
                            </Text>
                            <IconButton
                              aria-label={visibleApiKeys.has(partner.id) ? t('partners.hideApiKey') : t('partners.showApiKey')}
                              icon={visibleApiKeys.has(partner.id) ? <ViewOffIcon /> : <ViewIcon />}
                              onClick={() => toggleApiKeyVisibility(partner.id)}
                              size="xs"
                              variant="ghost"
                              flexShrink={0}
                            />
                            <IconButton
                              aria-label={t('partners.copyApiKey')}
                              icon={<CopyIcon />}
                              onClick={() => copyToClipboard(partner.apiKey, 'key')}
                              size="xs"
                              variant="ghost"
                              flexShrink={0}
                            />
                          </Flex>
                        </Td>
                        <Td>
                          <Flex align="center" gap={1} maxW="160px">
                            <Text 
                              color="gray.700" 
                              _dark={{ color: "gray.300" }} 
                              fontFamily="mono"
                              fontSize="sm"
                              overflow="hidden"
                              textOverflow="ellipsis"
                              whiteSpace="nowrap"
                              title={visibleApiTokens.has(partner.id) ? partner.apiToken : undefined}
                            >
                              {getApiTokenDisplay(partner)}
                            </Text>
                            <IconButton
                              aria-label={visibleApiTokens.has(partner.id) ? t('partners.hideApiToken') : t('partners.showApiToken')}
                              icon={visibleApiTokens.has(partner.id) ? <ViewOffIcon /> : <ViewIcon />}
                              onClick={() => toggleApiTokenVisibility(partner.id)}
                              size="xs"
                              variant="ghost"
                              flexShrink={0}
                            />
                            <IconButton
                              aria-label={t('partners.copyApiToken')}
                              icon={<CopyIcon />}
                              onClick={() => copyToClipboard(partner.apiToken, 'token')}
                              size="xs"
                              variant="ghost"
                              flexShrink={0}
                            />
                          </Flex>
                        </Td>
                        <Td>
                          <Text 
                            color="gray.700" 
                            _dark={{ color: "gray.300" }}
                            fontSize="sm"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            whiteSpace="nowrap"
                            maxW="180px"
                          >
                            {partner.contactEmail}
                          </Text>
                        </Td>
                        <Td>
                          <Text 
                            color={partner.isActive ? "green.500" : "red.500"} 
                            fontWeight="semibold"
                            _dark={{ color: partner.isActive ? "green.400" : "red.400" }}
                          >
                            {partner.isActive ? t('partners.active') : t('partners.inactive')}
                          </Text>
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
                            color="gray.600"
                            _dark={{ color: "gray.300" }}
                            _hover={{
                              bg: "gray.100",
                              _dark: {
                                bg: "navy.700"
                              }
                            }}
                          />
                          <MenuList
                            bg="white"
                            border="1px solid"
                            borderColor="gray.200"
                            boxShadow="lg"
                            _dark={{
                              bg: "navy.800",
                              borderColor: "blue.600",
                              color: "white"
                            }}
                          >
                            <ProtectedComponent 
                              requiredClaims={['Partners.Update', 'Partners.Admin', 'FullControl']}
                              requireAny={true}
                              fallback={
                                <MenuItem 
                                  isDisabled
                                  _hover={{
                                    bg: "gray.100",
                                    _dark: {
                                      bg: "gray.600"
                                    }
                                  }}
                                  color="gray.500"
                                  _dark={{ color: "gray.500" }}
                                >
                                  {t('common.update')} ({t('permissions.noPermission')})
                                </MenuItem>
                              }
                            >
                              <MenuItem 
                                onClick={() => handleEditPartner(partner)}
                                _hover={{
                                  bg: "gray.100",
                                  _dark: {
                                    bg: "gray.600"
                                  }
                                }}
                                color="gray.700"
                                _dark={{ color: "gray.300" }}
                              >
                                {t('common.update')}
                              </MenuItem>
                            </ProtectedComponent>
                            
                            <MenuItem 
                              onClick={handleDetails} 
                              isDisabled
                              _hover={{
                                bg: "gray.100",
                                _dark: {
                                  bg: "gray.600"
                                }
                              }}
                              color="gray.700"
                              _dark={{ color: "gray.300" }}
                            >
                              {t('common.details')}
                            </MenuItem>
                            
                            <ProtectedComponent 
                              requiredClaims={['Partners.Delete', 'Partners.Admin', 'FullControl']}
                              requireAny={true}
                              fallback={
                                <MenuItem 
                                  isDisabled
                                  _hover={{
                                    bg: "gray.100",
                                    _dark: {
                                      bg: "gray.600"
                                    }
                                  }}
                                  color="gray.500"
                                  _dark={{ color: "gray.500" }}
                                >
                                  {t('common.delete')} ({t('permissions.noPermission')})
                                </MenuItem>
                              }
                            >
                              <MenuItem 
                                onClick={() => handleDeletePartner(partner)} 
                                color="red.500"
                                _hover={{
                                  bg: "gray.100",
                                  _dark: {
                                    bg: "gray.600",
                                    color: "red.400"
                                  }
                                }}
                                _dark={{ color: "red.400" }}
                              >
                                {t('common.delete')}
                              </MenuItem>
                            </ProtectedComponent>
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
        initialData={editingPartner ? { 
          name: editingPartner.name, 
          apiKey: editingPartner.apiKey,
          apiToken: editingPartner.apiToken,
          contactEmail: editingPartner.contactEmail,
          isActive: editingPartner.isActive
        } : undefined}
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

