import React from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody,
  Badge, Box, Text, VStack, HStack, Divider, useColorModeValue
} from '@chakra-ui/react';
import { SupportRequestDetailDto, SupportRequestPriority, SupportRequestStatus } from '../../types/supportRequests';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data?: SupportRequestDetailDto | null;
}

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

const SupportRequestDetailModal: React.FC<Props> = ({ isOpen, onClose, data }) => {
  const labelColor = useColorModeValue('gray.600', 'gray.300');
  const valueColor = useColorModeValue('gray.800', 'white');

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'md', md: 'lg' }} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Talep Detayı</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {!data ? (
            <Text>Yükleniyor...</Text>
          ) : (
            <VStack align="stretch" spacing={4}>
              <HStack justify="space-between">
                <Text fontWeight="bold" color={valueColor} fontSize="lg">{data.subject}</Text>
                <HStack>
                  <Badge colorScheme={statusColor(data.status)}>{SupportRequestStatus[data.status]}</Badge>
                  <Badge colorScheme={priorityColor(data.priority)}>{SupportRequestPriority[data.priority]}</Badge>
                </HStack>
              </HStack>
              <Box>
                <Text fontWeight="semibold" color={labelColor} mb={1}>Açıklama</Text>
                <Text color={valueColor} whiteSpace="pre-wrap">{data.description}</Text>
              </Box>
              {data.resolveDescription && (
                <Box>
                  <Text fontWeight="semibold" color={labelColor} mb={1}>Çözüm Notu</Text>
                  <Text color={valueColor} whiteSpace="pre-wrap">{data.resolveDescription}</Text>
                </Box>
              )}
              <Divider />
              <HStack justify="space-between">
                <Text color={labelColor}>Oluşturan</Text>
                <Text color={valueColor}>{data.createdUser?.name} {data.createdUser?.surname}</Text>
              </HStack>
              <HStack justify="space-between">
                <Text color={labelColor}>Oluşturma</Text>
                <Text color={valueColor}>{new Date(data.createdDate).toLocaleString('tr-TR')}</Text>
              </HStack>
              {data.updatedDate && (
                <HStack justify="space-between">
                  <Text color={labelColor}>Güncelleme</Text>
                  <Text color={valueColor}>{new Date(data.updatedDate).toLocaleString('tr-TR')}</Text>
                </HStack>
              )}
              {data.resolvedDate && (
                <HStack justify="space-between">
                  <Text color={labelColor}>Çözüm</Text>
                  <Text color={valueColor}>{new Date(data.resolvedDate).toLocaleString('tr-TR')}</Text>
                </HStack>
              )}
              {data.closedDate && (
                <HStack justify="space-between">
                  <Text color={labelColor}>Kapanış</Text>
                  <Text color={valueColor}>{new Date(data.closedDate).toLocaleString('tr-TR')}</Text>
                </HStack>
              )}
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SupportRequestDetailModal;


