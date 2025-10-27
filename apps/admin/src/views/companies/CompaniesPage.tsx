import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Flex,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  useToast,
  useDisclosure,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
} from '@chakra-ui/react';
import { ChevronDownIcon, AddIcon } from '@chakra-ui/icons';
import { companyService, Company, OperationalStatus, GetCompaniesResponse } from '../../services/companyService';
import CompanyModal from '../../components/CompanyModal';
import Pagination from '../../components/Pagination';
import { ProtectedComponent } from '../../components/ProtectedComponent';
import { useClaimCheck } from '../../hooks/useClaimCheck';

const CompaniesPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const { 
    canViewCompanies, 
    canCreateCompanies, 
    canEditCompanies, 
    canDeleteCompanies 
  } = useClaimCheck();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchCompanies = async (pageIndex: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response: GetCompaniesResponse = await companyService.getCompanies(pageIndex, pageSize);
      
      setCompanies(response.items);
      setTotalPages(response.pagination.pages);
      setTotalRecords(response.pagination.count);
      setHasPrevious(response.pagination.hasPrevious);
      setHasNext(response.pagination.hasNext);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      toast({
        title: t('errors.somethingWentWrong'),
        description: err instanceof Error ? err.message : 'Unknown error',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies(currentPage);
  }, [currentPage]);

  const handleAddCompany = () => {
    if (!canCreateCompanies) {
      toast({
        title: t('permissions.permissionError'),
        description: t('permissions.noPermissionToAddCompany'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setSelectedCompany(null);
    setIsEditMode(false);
    onOpen();
  };

  const handleEditCompany = (company: Company) => {
    if (!canEditCompanies) {
      toast({
        title: t('permissions.permissionError'),
        description: t('permissions.noPermissionToEditCompany'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setSelectedCompany(company);
    setIsEditMode(true);
    onOpen();
  };

  const handleCompanySaved = () => {
    onClose();
    fetchCompanies(currentPage);
    toast({
      title: t('companies.companyAddedSuccessfully'),
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleCompanyUpdated = () => {
    onClose();
    fetchCompanies(currentPage);
    toast({
      title: t('companies.companyUpdatedSuccessfully'),
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDetails = (company: Company) => {
    navigate(`/admin/companies/${company.id}`);
  };

  const getStatusBadge = (status: OperationalStatus) => {
    const statusText = companyService.getStatusText(status);
    const statusColor = companyService.getStatusColor(status);
    
    return (
      <Badge colorScheme={statusColor} variant="subtle">
        {t(`companies.status.${statusText.toLowerCase()}`)}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="400px">
        <Spinner size="xl" />
      </Flex>
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

  return (
    <Box p={{ base: 4 , md: 6 }} pt={{ base: 16, md: 20 }}>
      {/* Header Section */}
      <Box mb={12}>
        <Flex justify="flex-end" mb={10}>
          <ProtectedComponent 
            requiredClaims={['Companies.Create', 'Companies.Admin', 'FullControl']}
            requireAny={true}
            fallback={
              <Button
                leftIcon={<AddIcon />}
                colorScheme="gray"
                size={{ base: "sm", md: "md" }}
                isDisabled
                title={t('permissions.noPermissionForAction')}
              >
                {t('companies.addCompany')}
              </Button>
            }
          >
            <Button
              leftIcon={<AddIcon />}
              colorScheme="blue"
              onClick={handleAddCompany}
              size={{ base: "sm", md: "md" }}
            >
              {t('companies.addCompany')}
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
          {companies.length === 0 ? (
            <Box textAlign="center" py={10} px={6}>
              <Text fontSize="lg" color="gray.500">
                {t('companies.noCompaniesFound')}
              </Text>
            </Box>
          ) : (
            <>
              {/* Table Container */}
              <Box overflowX="auto">
                <Table 
                  variant="simple" 
                  size="md"
                  colorScheme="gray"
                >
                  <Thead
                    bg="gray.100"
                    _dark={{
                      bg: "navy.700"
                    }}
                  >
                    <Tr>
                      <Th 
                        color="gray.600"
                        _dark={{
                          color: "gray.300"
                        }}
                      >
                        {t('companies.companyName')}
                      </Th>
                      <Th 
                        color="gray.600"
                        _dark={{
                          color: "gray.300"
                        }}
                      >
                        {t('companies.taxNumber')}
                      </Th>
                      <Th 
                        color="gray.600"
                        _dark={{
                          color: "gray.300"
                        }}
                      >
                        {t('companies.industry')}
                      </Th>
                      <Th 
                        color="gray.600"
                        _dark={{
                          color: "gray.300"
                        }}
                      >
                        {t('companies.companyAddress')}
                      </Th>
                      <Th 
                        color="gray.600"
                        _dark={{
                          color: "gray.300"
                        }}
                      >
                        {t('companies.companyStatus')}
                      </Th>
                      <Th 
                        color="gray.600"
                        _dark={{
                          color: "gray.300"
                        }}
                      >
                        {t('common.createdDate')}
                      </Th>
                      <Th 
                        color="gray.600"
                        _dark={{
                          color: "gray.300"
                        }}
                      >
                        {t('common.actions')}
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {companies.map((company, index) => (
                      <Tr 
                        key={company.id}
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
                        <Td 
                          fontWeight="medium"
                          color="gray.700"
                          _dark={{
                            color: "gray.200"
                          }}
                        >
                          {company.name}
                        </Td>
                        <Td 
                          color="gray.600"
                          _dark={{
                            color: "gray.300"
                          }}
                        >
                          {company.taxNumber}
                        </Td>
                        <Td 
                          color="gray.600"
                          _dark={{
                            color: "gray.300"
                          }}
                        >
                          {company.industry}
                        </Td>
                        <Td 
                          maxW="200px" 
                          isTruncated
                          color="gray.600"
                          _dark={{
                            color: "gray.300"
                          }}
                        >
                          {company.address}
                        </Td>
                        <Td>{getStatusBadge(company.status)}</Td>
                        <Td 
                          color="gray.600"
                          _dark={{
                            color: "gray.300"
                          }}
                        >
                          {formatDate(company.createdDate)}
                        </Td>
                        <Td>
                          <Menu>
                            <MenuButton
                              as={IconButton}
                              icon={<ChevronDownIcon />}
                              variant="ghost"
                              size="sm"
                              color="gray.600"
                              _dark={{
                                color: "gray.300"
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
                                requiredClaims={['Companies.Update', 'Companies.Admin', 'FullControl']}
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
                                    {t('common.edit')} ({t('permissions.noPermission')})
                                  </MenuItem>
                                }
                              >
                                <MenuItem 
                                  onClick={() => handleEditCompany(company)}
                                  _hover={{
                                    bg: "gray.100",
                                    _dark: {
                                      bg: "gray.600"
                                    }
                                  }}
                                  color="gray.700"
                                  _dark={{ color: "gray.300" }}
                                >
                                  {t('common.edit')}
                                </MenuItem>
                              </ProtectedComponent>
                              
                              <MenuItem 
                                onClick={() => handleDetails(company)}
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

      <CompanyModal
        isOpen={isOpen}
        onClose={onClose}
        company={selectedCompany}
        isEditMode={isEditMode}
        onCompanySaved={handleCompanySaved}
        onCompanyUpdated={handleCompanyUpdated}
      />
    </Box>
  );
};

export default CompaniesPage;
