import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
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
  CardHeader,
  Text,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  VStack,
  HStack,
  Divider,
} from '@chakra-ui/react';
import { ChevronDownIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { companyService, Company } from '../../services/companyService';
import { userService, User } from '../../services/userService';
import UserUpdateModal from '../../components/UserUpdateModal';

const CompanyDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  
  const [company, setCompany] = useState<Company | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);

  // Fetch company details
  const fetchCompany = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    try {
      const companyData = await companyService.getCompanyById(id);
      setCompany(companyData);
    } catch (err) {
      console.error('Error fetching company:', err);
      setError('Failed to load company details');
    } finally {
      setLoading(false);
    }
  };

  // Fetch users for this company
  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const response = await userService.getUsers(0, 100, id); // Pass companyId
      setUsers(response.items);
    } catch (err) {
      console.error('Error fetching users:', err);
      toast({
        title: t('errors.somethingWentWrong'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchCompany();
    fetchUsers();
  }, [id]);

  const handleBack = () => {
    navigate('/admin/companies');
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsUserModalOpen(true);
  };

  const handleSaveUser = async (userData: { name: string; surname: string; email: string; password?: string }) => {
    if (!editingUser) return;
    
    setSaving(true);
    try {
      await userService.updateUser({
        id: editingUser.id,
        name: userData.name,
        surname: userData.surname,
        email: userData.email,
        ...(userData.password && { password: userData.password }),
      });
      
      toast({
        title: t('users.userUpdatedSuccessfully'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      setIsUserModalOpen(false);
      fetchUsers(); // Refresh users list
    } catch (err: any) {
      console.error('Error updating user:', err);
      toast({
        title: t('errors.somethingWentWrong'),
        description: err.message || t('errors.validationError'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePermissionManagement = () => {
    // Permission management is disabled for this task
    toast({
      title: t('users.permissionManagementDisabled'),
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const getStatusBadge = (status: any) => {
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
      <Box p={6}>
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      </Box>
    );
  }

  if (!company) {
    return (
      <Box p={6}>
        <Text>Company not found</Text>
      </Box>
    );
  }

  return (
    <Box p={{ base: 4, md: 6 }} pt={{ base: 16, md: 20 }}>
      {/* Header Section */}
      <Box mb={6}>
        <Flex align="center" mb={4}>
          <Button
            leftIcon={<ArrowBackIcon />}
            variant="ghost"
            onClick={handleBack}
            mr={4}
          >
            {t('common.back')}
          </Button>
          <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold">
            {company.name}
          </Text>
        </Flex>
      </Box>

      {/* Company Information Card */}
      <Card
        boxShadow="lg"
        border="1px solid"
        borderColor="gray.200"
        _dark={{
          borderColor: "blue.600",
          bg: "navy.800"
        }}
        mb={6}
      >
        <CardHeader>
          <Text fontSize="lg" fontWeight="bold">
            {t('companies.companyDetails')}
          </Text>
        </CardHeader>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between">
              <Text fontWeight="semibold">{t('companies.companyName')}:</Text>
              <Text>{company.name}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontWeight="semibold">{t('companies.taxNumber')}:</Text>
              <Text>{company.taxNumber}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontWeight="semibold">{t('companies.industry')}:</Text>
              <Text>{company.industry}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontWeight="semibold">{t('companies.companyAddress')}:</Text>
              <Text maxW="300px" isTruncated>{company.address}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontWeight="semibold">{t('companies.companyStatus')}:</Text>
              {getStatusBadge(company.status)}
            </HStack>
            <HStack justify="space-between">
              <Text fontWeight="semibold">{t('companies.companyType')}:</Text>
              <Text>{t(`companies.type.${company.type === 1 ? 'owner' : 'customer'}`)}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontWeight="semibold">{t('common.createdDate')}:</Text>
              <Text>{formatDate(company.createdDate)}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontWeight="semibold">{t('common.updatedDate')}:</Text>
              <Text>{formatDate(company.updatedDate)}</Text>
            </HStack>
          </VStack>
        </CardBody>
      </Card>

      {/* Users Section */}
      <Card
        boxShadow="lg"
        border="1px solid"
        borderColor="gray.200"
        _dark={{
          borderColor: "blue.600",
          bg: "navy.800"
        }}
      >
        <CardHeader>
          <Text fontSize="lg" fontWeight="bold">
            {t('users.users')}
          </Text>
        </CardHeader>
        <CardBody p={0}>
          {usersLoading ? (
            <Flex justify="center" align="center" minH="200px">
              <Spinner size="lg" />
            </Flex>
          ) : users.length === 0 ? (
            <Box textAlign="center" py={10}>
              <Text color="gray.500" fontSize="md">
                {t('users.noUsersFound')}
              </Text>
            </Box>
          ) : (
            <Box overflowX="auto">
              <Table variant="simple" size="md">
                <Thead
                  bg="gray.100"
                  _dark={{
                    bg: "navy.700"
                  }}
                >
                  <Tr>
                    <Th color="gray.700" _dark={{ color: "gray.300" }}>{t('users.name')}</Th>
                    <Th color="gray.700" _dark={{ color: "gray.300" }}>{t('users.surname')}</Th>
                    <Th color="gray.700" _dark={{ color: "gray.300" }}>{t('users.email')}</Th>
                    <Th color="gray.700" _dark={{ color: "gray.300" }}>{t('common.createdDate')}</Th>
                    <Th color="gray.700" _dark={{ color: "gray.300" }}>{t('common.actions')}</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {users.map((user, index) => (
                    <Tr
                      key={user.id}
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
                      <Td color="gray.700" _dark={{ color: "gray.300" }}>{user.name}</Td>
                      <Td color="gray.700" _dark={{ color: "gray.300" }}>{user.surname}</Td>
                      <Td color="gray.700" _dark={{ color: "gray.300" }}>{user.email}</Td>
                      <Td color="gray.700" _dark={{ color: "gray.300" }}>
                        {formatDate(user.createdDate)}
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
                            <MenuItem onClick={() => handleEditUser(user)}>
                              {t('common.update')}
                            </MenuItem>
                            <MenuItem onClick={handlePermissionManagement} isDisabled>
                              {t('users.permissionManagement')}
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          )}
        </CardBody>
      </Card>

      <UserUpdateModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onSave={handleSaveUser}
        initialData={editingUser ? { 
          name: editingUser.name, 
          surname: editingUser.surname, 
          email: editingUser.email 
        } : undefined}
        loading={saving}
      />
    </Box>
  );
};

export default CompanyDetailPage;
