import React, { useEffect, useState } from 'react';
import {
  Box, Button, Card, CardBody, Flex, Heading, HStack, IconButton, Select, Spinner,
  Table, Tbody, Td, Th, Thead, Tr, Text, Badge, useDisclosure, useToast,
  Alert, AlertIcon, Tooltip, FormControl, FormLabel, SimpleGrid
} from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import { supportRequestService } from '../../services/supportRequestService';
import { useTranslation } from 'react-i18next';
import { useColorModeValue } from '@chakra-ui/react';
import { companyService } from '../../services/companyService';
import {
  GetListResponse,
  SupportRequestAdminListItemDto,
  SupportRequestPriority,
  SupportRequestStatus,
  SupportRequestListFilters
} from '../../types/supportRequests';
import SupportRequestAdminDetailModal from '../../components/supportRequests/SupportRequestAdminDetailModal';
import { useClaimCheck } from '../../hooks/useClaimCheck';

const trimText = (s: string, len = 50) => (s?.length > len ? `${s.slice(0, len)}...` : s);

const statusColor = (s: SupportRequestStatus) => {
  switch (s) {
    case SupportRequestStatus.New: return 'blue';
    case SupportRequestStatus.InProgress: return 'yellow';
    case SupportRequestStatus.Resolved: return 'green';
    case SupportRequestStatus.Closed: return 'gray';
    default: return 'gray';
  }
};

const priorityColor = (p: SupportRequestPriority) => {
  switch (p) {
    case SupportRequestPriority.Low: return 'gray';
    case SupportRequestPriority.Medium: return 'blue';
    case SupportRequestPriority.High: return 'orange';
    case SupportRequestPriority.Urgent: return 'red';
    default: return 'gray';
  }
};

const SupportRequestsPage: React.FC = () => {
  const toast = useToast();
  const { t } = useTranslation();
  const cardBg = useColorModeValue('white', 'navy.800');
  const cardBorder = useColorModeValue('gray.200', 'blue.600');
  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure();
  const { canViewSupportRequests } = useClaimCheck();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<GetListResponse<SupportRequestAdminListItemDto> | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<any | null>(null);
  const [filters, setFilters] = useState<SupportRequestListFilters>({});
  const [companies, setCompanies] = useState<Array<{ id: string; name: string }>>([]);
  const [primeUsers, setPrimeUsers] = useState<Array<{ id: string; name: string; surname: string }>>([]);
  const currentUserId = localStorage.getItem('currentUserId') || localStorage.getItem('testUserId') || '';

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const res = await companyService.getCompanies(0, 100);
        setCompanies(res.items.map(c => ({ id: c.id, name: c.name })));
      } catch (e) {
        console.error('Companies fetch failed', e);
      }
    };
    loadCompanies();

    // TODO: Prime users endpoint - şimdilik mock
    setPrimeUsers([
      { id: '1', name: 'Admin', surname: 'User' },
      { id: '2', name: 'Test', surname: 'Prime' },
    ]);
  }, []);

  useEffect(() => {
    if (canViewSupportRequests) fetchList(currentPage);
  }, [currentPage, filters, canViewSupportRequests]);

  const fetchList = async (pageIndex = 0) => {
    setLoading(true);
    try {
      const res = await supportRequestService.getListForAdmin(pageIndex, pageSize, filters);
      setData(res);
    } catch (e: any) {
      toast({ title: 'Kayıtlar getirilemedi', description: e?.message, status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetail = async (id: string) => {
    setSelectedId(id);
    try {
      const d = await supportRequestService.getByIdForAdmin(id);
      setDetail(d);
      onDetailOpen();
    } catch (e: any) {
      toast({ title: 'Detay getirilemedi', description: e?.message, status: 'error' });
    }
  };

  const handleRefresh = async () => {
    await fetchList(currentPage);
    if (selectedId) {
      try {
        const d = await supportRequestService.getByIdForAdmin(selectedId);
        setDetail(d);
      } catch (e) {
        console.error('Detail refresh failed', e);
      }
    }
  };

  return (
    <Box p={{ base: 4, md: 6 }} pt={{ base: 12, md: 20 }}>
      <Heading size="md" mb={6}>{t('supportRequests.title')}</Heading>

      <Card mb={6} bg={cardBg} borderColor={cardBorder}>
        <CardBody>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
            <FormControl>
              <FormLabel>{t('supportRequests.filters.company')}</FormLabel>
              <Select
                placeholder={t('supportRequests.filters.all')}
                value={filters.companyId || ''}
                onChange={(e) => setFilters({ ...filters, companyId: e.target.value || null })}
              >
                {companies.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>{t('supportRequests.filters.priority')}</FormLabel>
              <Select
                placeholder={t('supportRequests.filters.all')}
                value={filters.priority?.toString() || ''}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value ? Number(e.target.value) as SupportRequestPriority : null })}
              >
                <option value={SupportRequestPriority.Low}>{t('supportRequests.priority.low')}</option>
                <option value={SupportRequestPriority.Medium}>{t('supportRequests.priority.medium')}</option>
                <option value={SupportRequestPriority.High}>{t('supportRequests.priority.high')}</option>
                <option value={SupportRequestPriority.Urgent}>{t('supportRequests.priority.urgent')}</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>{t('supportRequests.filters.status')}</FormLabel>
              <Select
                placeholder={t('supportRequests.filters.all')}
                value={filters.status?.toString() || ''}
                onChange={(e) => setFilters({ ...filters, status: e.target.value ? Number(e.target.value) as SupportRequestStatus : null })}
              >
                <option value={SupportRequestStatus.New}>{t('supportRequests.status.new')}</option>
                <option value={SupportRequestStatus.InProgress}>{t('supportRequests.status.inProgress')}</option>
                <option value={SupportRequestStatus.Resolved}>{t('supportRequests.status.resolved')}</option>
                <option value={SupportRequestStatus.Closed}>{t('supportRequests.status.closed')}</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>{t('supportRequests.filters.assignee')}</FormLabel>
              <Select
                placeholder={t('supportRequests.filters.all')}
                value={filters.assignedTo || ''}
                onChange={(e) => setFilters({ ...filters, assignedTo: e.target.value || null })}
              >
                {primeUsers.map(u => (
                  <option key={u.id} value={u.id}>{u.name} {u.surname}</option>
                ))}
              </Select>
            </FormControl>
          </SimpleGrid>
        </CardBody>
      </Card>

      <Card bg={cardBg} borderColor={cardBorder} boxShadow="lg">
        <CardBody>
          {loading ? (
            <Flex justify="center" align="center" minH="200px"><Spinner size="lg" /></Flex>
          ) : !data || data.items.length === 0 ? (
            <Alert status="info"><AlertIcon />{t('supportRequests.table.noData')}</Alert>
          ) : (
            <Box overflowX="auto">
              <Table variant="simple" size={{ base: 'sm', md: 'md' }}>
                <Thead>
                  <Tr>
                    <Th>{t('supportRequests.table.title')}</Th>
                    <Th>{t('supportRequests.table.description')}</Th>
                    <Th>{t('supportRequests.table.status')}</Th>
                    <Th>{t('supportRequests.table.priority')}</Th>
                    <Th>{t('supportRequests.table.company')}</Th>
                    <Th>{t('common.name')}</Th>
                    <Th>{t('supportRequests.table.assignee')}</Th>
                    <Th>{t('supportRequests.table.createdAt')}</Th>
                    <Th w="160px" textAlign="center">{t('supportRequests.table.actions')}</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data.items.map((row) => (
                    <Tr key={row.id}>
                      <Td py={2}><Tooltip label={row.subject}><Text>{trimText(row.subject)}</Text></Tooltip></Td>
                      <Td py={2}><Tooltip label={row.description}><Text>{trimText(row.description)}</Text></Tooltip></Td>
                      <Td><Badge colorScheme={statusColor(row.status)}>{t(`supportRequests.status.${row.status === SupportRequestStatus.InProgress ? 'inProgress' : SupportRequestStatus[row.status].toString().charAt(0).toLowerCase() + SupportRequestStatus[row.status].toString().slice(1)}`)}</Badge></Td>
                      <Td><Badge colorScheme={priorityColor(row.priority)}>{t(`supportRequests.priority.${SupportRequestPriority[row.priority].toString().toLowerCase()}`)}</Badge></Td>
                      <Td py={2}>{row.company?.name || '-'}</Td>
                      <Td py={2}>{row.createdUser?.name} {row.createdUser?.surname}</Td>
                      <Td py={2}>{row.assignedTo ? `${row.assignedTo.name} ${row.assignedTo.surname}` : '-'}</Td>
                      <Td py={2}>{new Date(row.createdDate).toLocaleDateString('tr-TR')}</Td>
                      <Td py={2} minW="160px" maxW="200px" whiteSpace="nowrap" textAlign="center">
                        <Tooltip label={t('common.details')}>
                          <IconButton aria-label="details" icon={<InfoOutlineIcon boxSize={4} />} size="sm" isRound variant="ghost" colorScheme="blue" onClick={() => handleOpenDetail(row.id)} />
                        </Tooltip>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          )}
        </CardBody>
      </Card>

      <SupportRequestAdminDetailModal
        isOpen={isDetailOpen}
        onClose={() => { setDetail(null); setSelectedId(null); onDetailClose(); }}
        data={detail}
        onRefresh={handleRefresh}
        primeUsers={primeUsers}
        currentUserId={currentUserId}
      />
    </Box>
  );
};

export default SupportRequestsPage;

