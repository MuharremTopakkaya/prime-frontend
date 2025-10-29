import React, { useEffect, useState } from 'react';
import {
  Box, Button, Card, CardBody, Flex, Heading, HStack, IconButton, Select, Spinner,
  Table, Tbody, Td, Th, Thead, Tr, Text, Badge, useDisclosure, useToast,
  Alert, AlertIcon, Tooltip, FormControl, FormLabel, SimpleGrid
} from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import { supportRequestService } from '../../services/supportRequestService';
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
    <Box p={{ base: 4, md: 6 }} pt={{ base: 10, md: 16 }}>
      <Heading size="md" mb={6}>Destek Talepleri</Heading>

      <Card mb={6}>
        <CardBody>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
            <FormControl>
              <FormLabel>Şirket</FormLabel>
              <Select
                placeholder="Tümü"
                value={filters.companyId || ''}
                onChange={(e) => setFilters({ ...filters, companyId: e.target.value || null })}
              >
                {companies.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Öncelik</FormLabel>
              <Select
                placeholder="Tümü"
                value={filters.priority?.toString() || ''}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value ? Number(e.target.value) as SupportRequestPriority : null })}
              >
                <option value={SupportRequestPriority.Low}>Düşük</option>
                <option value={SupportRequestPriority.Medium}>Orta</option>
                <option value={SupportRequestPriority.High}>Yüksek</option>
                <option value={SupportRequestPriority.Urgent}>Acil</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Durum</FormLabel>
              <Select
                placeholder="Tümü"
                value={filters.status?.toString() || ''}
                onChange={(e) => setFilters({ ...filters, status: e.target.value ? Number(e.target.value) as SupportRequestStatus : null })}
              >
                <option value={SupportRequestStatus.New}>New</option>
                <option value={SupportRequestStatus.InProgress}>InProgress</option>
                <option value={SupportRequestStatus.Resolved}>Resolved</option>
                <option value={SupportRequestStatus.Closed}>Closed</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Atanan Kişi</FormLabel>
              <Select
                placeholder="Tümü"
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

      <Card>
        <CardBody>
          {loading ? (
            <Flex justify="center" align="center" minH="200px"><Spinner size="lg" /></Flex>
          ) : !data || data.items.length === 0 ? (
            <Alert status="info"><AlertIcon />Destek talebi bulunamadı.</Alert>
          ) : (
            <Box overflowX="auto">
              <Table size={{ base: 'sm', md: 'md' }}>
                <Thead>
                  <Tr>
                    <Th>Konu</Th>
                    <Th>Açıklama</Th>
                    <Th>Durum</Th>
                    <Th>Öncelik</Th>
                    <Th>Şirket</Th>
                    <Th>Oluşturan</Th>
                    <Th>Atanan</Th>
                    <Th>Oluşturma</Th>
                    <Th>İşlemler</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data.items.map((row) => (
                    <Tr key={row.id}>
                      <Td><Tooltip label={row.subject}><Text>{trimText(row.subject)}</Text></Tooltip></Td>
                      <Td><Tooltip label={row.description}><Text>{trimText(row.description)}</Text></Tooltip></Td>
                      <Td><Badge colorScheme={statusColor(row.status)}>{SupportRequestStatus[row.status]}</Badge></Td>
                      <Td><Badge colorScheme={priorityColor(row.priority)}>{SupportRequestPriority[row.priority]}</Badge></Td>
                      <Td>{row.company?.name || '-'}</Td>
                      <Td>{row.createdUser?.name} {row.createdUser?.surname}</Td>
                      <Td>{row.assignedTo ? `${row.assignedTo.name} ${row.assignedTo.surname}` : '-'}</Td>
                      <Td>{new Date(row.createdDate).toLocaleDateString('tr-TR')}</Td>
                      <Td>
                        <Tooltip label="Detay">
                          <IconButton aria-label="detay" icon={<InfoOutlineIcon />} size="sm" variant="ghost" onClick={() => handleOpenDetail(row.id)} />
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

