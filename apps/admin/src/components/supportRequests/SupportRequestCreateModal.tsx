import React, { useState } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter,
  Button, FormControl, FormLabel, Input, Textarea, Select, useToast
} from '@chakra-ui/react';
import { SupportRequestPriority } from '../../types/supportRequests';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => Promise<void> | void;
  onCreate: (payload: { subject: string; description: string; priority: SupportRequestPriority }) => Promise<void>;
}

const SupportRequestCreateModal: React.FC<Props> = ({ isOpen, onClose, onCreated, onCreate }) => {
  const toast = useToast();
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<SupportRequestPriority>(SupportRequestPriority.Medium);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!subject.trim() || !description.trim()) {
      toast({ title: 'Lütfen konu ve açıklama girin', status: 'warning', duration: 2000 });
      return;
    }
    setSaving(true);
    try {
      await onCreate({ subject: subject.trim(), description: description.trim(), priority });
      toast({ title: 'Talep oluşturuldu', status: 'success', duration: 2000 });
      onClose();
      await onCreated();
      setSubject('');
      setDescription('');
      setPriority(SupportRequestPriority.Medium);
    } catch (e: any) {
      toast({ title: 'Talep oluşturulamadı', description: e?.message, status: 'error', duration: 3000 });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'md', md: 'lg' }} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Yeni Destek Talebi</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4} isRequired>
            <FormLabel>Konu</FormLabel>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={120} />
          </FormControl>
          <FormControl mb={4} isRequired>
            <FormLabel>Açıklama</FormLabel>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} maxLength={2000} />
          </FormControl>
          <FormControl mb={2}>
            <FormLabel>Önem Derecesi</FormLabel>
            <Select value={priority} onChange={(e) => setPriority(Number(e.target.value) as SupportRequestPriority)}>
              <option value={SupportRequestPriority.Low}>Düşük</option>
              <option value={SupportRequestPriority.Medium}>Orta</option>
              <option value={SupportRequestPriority.High}>Yüksek</option>
              <option value={SupportRequestPriority.Urgent}>Acil</option>
            </Select>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={onClose} variant="ghost">İptal</Button>
          <Button colorScheme="blue" onClick={handleSubmit} isLoading={saving}>Oluştur</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SupportRequestCreateModal;


