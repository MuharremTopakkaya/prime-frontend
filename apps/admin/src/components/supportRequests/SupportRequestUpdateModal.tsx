import React, { useState, useEffect } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter,
  Button, FormControl, FormLabel, Select, Textarea, useToast, VStack, Text
} from '@chakra-ui/react';
import { SupportRequestAdminDetailDto, SupportRequestPriority, SupportRequestStatus } from '../../types/supportRequests';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => Promise<void> | void;
  data: SupportRequestAdminDetailDto | null;
  onUpdate: (payload: any) => Promise<void>;
  primeUsers: Array<{ id: string; name: string; surname: string }>;
}

const getNextStatuses = (current: SupportRequestStatus): SupportRequestStatus[] => {
  switch (current) {
    case SupportRequestStatus.New:
      return [SupportRequestStatus.InProgress];
    case SupportRequestStatus.InProgress:
      return [SupportRequestStatus.Resolved, SupportRequestStatus.Closed];
    case SupportRequestStatus.Resolved:
      return [SupportRequestStatus.Closed];
    case SupportRequestStatus.Closed:
      return [];
    default:
      return [];
  }
};

const SupportRequestUpdateModal: React.FC<Props> = ({ isOpen, onClose, onUpdated, data, onUpdate, primeUsers }) => {
  const toast = useToast();
  const [status, setStatus] = useState<SupportRequestStatus>(SupportRequestStatus.New);
  const [priority, setPriority] = useState<SupportRequestPriority>(SupportRequestPriority.Medium);
  const [assignedToId, setAssignedToId] = useState<string>('');
  const [resolveDescription, setResolveDescription] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) {
      setStatus(data.status);
      setPriority(data.priority);
      setAssignedToId(data.assignedTo?.id || '');
      setResolveDescription(data.resolveDescription || '');
    }
  }, [data]);

  const currentStatus = data?.status || SupportRequestStatus.New;
  const nextStatuses = getNextStatuses(currentStatus);
  const willBeResolved = status === SupportRequestStatus.Resolved;
  const willBeClosed = status === SupportRequestStatus.Closed;
  const needsResolveDesc = (willBeResolved || willBeClosed) || (currentStatus === SupportRequestStatus.InProgress && nextStatuses.includes(SupportRequestStatus.Resolved));

  const handleSubmit = async () => {
    if (willBeResolved && (!resolveDescription.trim() || resolveDescription.trim().length < 10)) {
      toast({ title: 'Çözüm notu en az 10 karakter olmalıdır', status: 'warning', duration: 2000 });
      return;
    }
    if (willBeClosed && (!resolveDescription.trim() || resolveDescription.trim().length < 10)) {
      toast({ title: 'Kapanış notu en az 10 karakter olmalıdır', status: 'warning', duration: 2000 });
      return;
    }

    const payload: any = {
      id: data!.id,
      status,
      priority,
      resolveDescription: resolveDescription.trim() || '',
      assignedToId: assignedToId || null,
    };

    if (willBeResolved) {
      payload.resolvedDate = new Date().toISOString();
    }
    if (willBeClosed) {
      payload.closedDate = new Date().toISOString();
    }

    setSaving(true);
    try {
      await onUpdate(payload);
      toast({ title: 'Talep güncellendi', status: 'success', duration: 2000 });
      onClose();
      await onUpdated();
    } catch (e: any) {
      toast({ title: 'Güncellenemedi', description: e?.message, status: 'error', duration: 3000 });
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = (newStatus: SupportRequestStatus) => {
    setStatus(newStatus);
    if (newStatus !== SupportRequestStatus.Resolved && newStatus !== SupportRequestStatus.Closed) {
      setResolveDescription('');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'md', md: 'lg' }} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Destek Talebini Güncelle</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Durum</FormLabel>
              <Select value={status} onChange={(e) => handleStatusChange(Number(e.target.value) as SupportRequestStatus)}>
                <option value={currentStatus}>{SupportRequestStatus[currentStatus]}</option>
                {nextStatuses.map(s => (
                  <option key={s} value={s}>{SupportRequestStatus[s]}</option>
                ))}
              </Select>
              {nextStatuses.length === 0 && <Text fontSize="sm" color="gray.500">Bu durum güncellenemez</Text>}
            </FormControl>

            <FormControl>
              <FormLabel>Öncelik</FormLabel>
              <Select value={priority} onChange={(e) => setPriority(Number(e.target.value) as SupportRequestPriority)}>
                <option value={SupportRequestPriority.Low}>Düşük</option>
                <option value={SupportRequestPriority.Medium}>Orta</option>
                <option value={SupportRequestPriority.High}>Yüksek</option>
                <option value={SupportRequestPriority.Urgent}>Acil</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Atanan Kişi</FormLabel>
              <Select value={assignedToId} onChange={(e) => setAssignedToId(e.target.value)}>
                <option value="">Atanmamış</option>
                {primeUsers.map(u => (
                  <option key={u.id} value={u.id}>{u.name} {u.surname}</option>
                ))}
              </Select>
            </FormControl>

            {needsResolveDesc && (
              <FormControl isRequired={willBeResolved || willBeClosed}>
                <FormLabel>{willBeResolved ? 'Çözüm Notu' : willBeClosed ? 'Kapanış Notu' : 'Çözüm Notu (İsteğe Bağlı)'}</FormLabel>
                <Textarea
                  value={resolveDescription}
                  onChange={(e) => setResolveDescription(e.target.value)}
                  rows={4}
                  minLength={10}
                  placeholder="En az 10 karakter..."
                />
                <Text fontSize="xs" color="gray.500">Minimum 10 karakter</Text>
              </FormControl>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={onClose} variant="ghost">İptal</Button>
          <Button colorScheme="blue" onClick={handleSubmit} isLoading={saving} isDisabled={status === currentStatus && !assignedToId && priority === data?.priority}>
            Güncelle
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SupportRequestUpdateModal;

