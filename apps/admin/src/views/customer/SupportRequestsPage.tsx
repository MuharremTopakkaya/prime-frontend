import React, { useEffect, useMemo, useState } from 'react';
import {
  Box, Button, Card, CardBody, Flex, Heading, HStack, IconButton, Menu, MenuButton,
  MenuItem, MenuList, Spinner, Table, Tbody, Td, Th, Thead, Tr, Text, Badge, useDisclosure,
  useToast, Alert, AlertIcon, Tooltip, AlertDialog, AlertDialogOverlay, AlertDialogContent,
  AlertDialogHeader, AlertDialogBody, AlertDialogFooter
} from '@chakra-ui/react';
import { AddIcon, ChevronDownIcon, InfoOutlineIcon, DeleteIcon } from '@chakra-ui/icons';
import { supportRequestService } from '../../services/supportRequestService';
import {
  GetListResponse,
  SupportRequestListItemDto,
  SupportRequestPriority,
  SupportRequestStatus
} from '../../types/supportRequests';
import SupportRequestCreateModal from '../../components/supportRequests/SupportRequestCreateModal';
import SupportRequestDetailModal from '../../components/supportRequests/SupportRequestDetailModal';
import { ProtectedButton } from '../../components/ProtectedButton';
import { SupportRequestsOperationClaims } from '../../constants/OperationClaims';
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
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<GetListResponse<SupportRequestListItemDto> | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const currentUserId = localStorage.getItem('currentUserId') || localStorage.getItem('testUserId') || '';
  const { canViewSupportRequests, canCreateSupportRequests, canDeleteSupportRequests } = useClaimCheck();

  const fetchList = async (pageIndex = 0) => {
    setLoading(true);
    try {
      const res = await supportRequestService.getListForCustomer(pageIndex, pageSize);
      setData(res);
    } catch (e: any) {
      toast({ title: 'Kayıtlar getirilemedi', description: e?.message, status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canViewSupportRequests) fetchList(currentPage);
  }, [currentPage, canViewSupportRequests]);

  const handleOpenDetail = async (id: string) => {
    setSelectedId(id);
    try {
      const d = await supportRequestService.getByIdForCustomer(id);
      setDetail(d);
      onDetailOpen();
    } catch (e: any) {
      toast({ title: 'Detay getirilemedi', description: e?.message, status: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await supportRequestService.deleteSupportRequest(deleteId);
      toast({ title: 'Talep silindi', status: 'success' });
      setDeleteId(null);
      fetchList(currentPage);
    } catch (e: any) {
      toast({ title: 'Silinemedi', description: e?.message, status: 'error' });
    }
  };

  const canShowDelete = (row: SupportRequestListItemDto) => {
    return (
      canDeleteSupportRequests &&
      row.createdUser?.id === currentUserId &&
      row.status === SupportRequestStatus.New
    );
  };

  return (
    <Box p={{ base: 4, md: 6 }} pt={{ base: 10, md: 16 }}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="md">Destek Taleplerim</Heading>
        <ProtectedButton
          requiredClaims={[SupportRequestsOperationClaims.Create]}
          colorScheme="blue"
          leftIcon={<AddIcon />}
          onClick={onCreateOpen}
          showDisabled
        >
          Yeni Talep Oluştur
        </ProtectedButton>
      </Flex>

      <Card>
        <CardBody>
          {loading ? (
            <Flex justify="center" align="center" minH="200px"><Spinner size="lg" /></Flex>
          ) : !data || data.items.length === 0 ? (
            <Alert status="info"><AlertIcon />Henüz bir talep oluşturmadınız.</Alert>
          ) : (
            <Box overflowX="auto">
              <Table size={{ base: 'sm', md: 'md' }}>
                <Thead>
                  <Tr>
                    <Th>Konu</Th>
                    <Th>Açıklama</Th>
                    <Th>Durum</Th>
                    <Th>Öncelik</Th>
                    <Th>Oluşturan</Th>
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
                      <Td>{row.createdUser?.name} {row.createdUser?.surname}</Td>
                      <Td>
                        <HStack>
                          <Tooltip label="Detay">
                            <IconButton aria-label="detay" icon={<InfoOutlineIcon />} size="sm" variant="ghost" onClick={() => handleOpenDetail(row.id)} />
                          </Tooltip>
                          {canShowDelete(row) && (
                            <Tooltip label="Sil">
                              <IconButton aria-label="sil" icon={<DeleteIcon />} size="sm" variant="ghost" colorScheme="red" onClick={() => setDeleteId(row.id)} />
                            </Tooltip>
                          )}
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          )}
        </CardBody>
      </Card>

      <SupportRequestCreateModal
        isOpen={isCreateOpen}
        onClose={onCreateClose}
        onCreated={() => fetchList(currentPage)}
        onCreate={(payload) => supportRequestService.createSupportRequest(payload)}
      />

      <SupportRequestDetailModal
        isOpen={isDetailOpen}
        onClose={() => { setDetail(null); onDetailClose(); }}
        data={detail}
      />

      <AlertDialog isOpen={!!deleteId} leastDestructiveRef={cancelRef} onClose={() => setDeleteId(null)}>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>Talebi sil</AlertDialogHeader>
          <AlertDialogBody>Bu talebi silmek istediğinize emin misiniz?</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={() => setDeleteId(null)}>İptal</Button>
            <Button colorScheme="red" ml={3} onClick={handleDelete}>Sil</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Box>
  );
};

export default SupportRequestsPage;


