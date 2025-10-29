import React, { useState, useEffect } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody,
  Badge, Box, Text, VStack, HStack, Divider, useColorModeValue, Button, IconButton,
  Textarea, useToast, Flex, useDisclosure, AlertDialog, AlertDialogOverlay,
  AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { SupportRequestAdminDetailDto, SupportRequestPriority, SupportRequestStatus, SupportRequestCommentDto } from '../../types/supportRequests';
import SupportRequestUpdateModal from './SupportRequestUpdateModal';
import { supportRequestService } from '../../services/supportRequestService';
import { ProtectedButton } from '../ProtectedButton';
import { SupportRequestsOperationClaims, SupportRequestCommentsOperationClaims } from '../../constants/OperationClaims';

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

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: SupportRequestAdminDetailDto | null;
  onRefresh: () => Promise<void>;
  primeUsers: Array<{ id: string; name: string; surname: string }>;
  currentUserId: string;
}

const SupportRequestAdminDetailModal: React.FC<Props> = ({ isOpen, onClose, data, onRefresh, primeUsers, currentUserId }) => {
  const labelColor = useColorModeValue('gray.600', 'gray.300');
  const valueColor = useColorModeValue('gray.800', 'white');
  const { isOpen: isUpdateOpen, onOpen: onUpdateOpen, onClose: onUpdateClose } = useDisclosure();
  const [commentText, setCommentText] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const toast = useToast();

  const canComment = data && data.status !== SupportRequestStatus.Closed;
  const canEditDeleteComment = (comment: SupportRequestCommentDto) => {
    if (!data || data.status === SupportRequestStatus.Resolved || data.status === SupportRequestStatus.Closed) return false;
    return comment.sender.id === currentUserId;
  };

  const handleAddComment = async () => {
    if (!commentText.trim() || commentText.trim().length < 10) {
      toast({ title: 'Yorum en az 10 karakter olmalıdır', status: 'warning', duration: 2000 });
      return;
    }
    try {
      await supportRequestService.createComment({ supportRequestId: data!.id, content: commentText.trim() });
      toast({ title: 'Yorum eklendi', status: 'success', duration: 2000 });
      setCommentText('');
      await onRefresh();
    } catch (e: any) {
      toast({ title: 'Yorum eklenemedi', description: e?.message, status: 'error', duration: 3000 });
    }
  };

  const handleEditComment = (comment: SupportRequestCommentDto) => {
    setEditingComment(comment.id);
    setEditCommentText(comment.content);
  };

  const handleSaveComment = async (commentId: string) => {
    if (!editCommentText.trim() || editCommentText.trim().length < 10) {
      toast({ title: 'Yorum en az 10 karakter olmalıdır', status: 'warning', duration: 2000 });
      return;
    }
    try {
      await supportRequestService.updateComment({ id: commentId, content: editCommentText.trim() });
      toast({ title: 'Yorum güncellendi', status: 'success', duration: 2000 });
      setEditingComment(null);
      setEditCommentText('');
      await onRefresh();
    } catch (e: any) {
      toast({ title: 'Güncellenemedi', description: e?.message, status: 'error', duration: 3000 });
    }
  };

  const handleDeleteComment = async () => {
    if (!deleteCommentId) return;
    try {
      await supportRequestService.deleteComment(deleteCommentId);
      toast({ title: 'Yorum silindi', status: 'success', duration: 2000 });
      setDeleteCommentId(null);
      await onRefresh();
    } catch (e: any) {
      toast({ title: 'Silinemedi', description: e?.message, status: 'error', duration: 3000 });
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'md', md: 'xl' }} isCentered>
        <ModalOverlay />
        <ModalContent maxH="90vh" overflowY="auto">
          <ModalHeader>
            <Flex justify="space-between" align="center">
              <Text>{data?.subject}</Text>
              <ProtectedButton requiredClaims={[SupportRequestsOperationClaims.Update]}>
                <Button leftIcon={<EditIcon />} size="sm" colorScheme="blue" onClick={onUpdateOpen}>
                  Güncelle
                </Button>
              </ProtectedButton>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {!data ? (
              <Text>Yükleniyor...</Text>
            ) : (
              <VStack align="stretch" spacing={4}>
                <HStack justify="space-between">
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
                  <Text color={labelColor}>Şirket</Text>
                  <Text color={valueColor}>{data.company?.name}</Text>
                </HStack>

                <HStack justify="space-between">
                  <Text color={labelColor}>Oluşturan</Text>
                  <Text color={valueColor}>{data.createdUser?.name} {data.createdUser?.surname}</Text>
                </HStack>

                <HStack justify="space-between">
                  <Text color={labelColor}>Atanan</Text>
                  <Text color={valueColor}>
                    {data.assignedTo ? `${data.assignedTo.name} ${data.assignedTo.surname}` : 'Atanmamış'}
                  </Text>
                </HStack>

                <HStack justify="space-between">
                  <Text color={labelColor}>Oluşturma</Text>
                  <Text color={valueColor}>{new Date(data.createdDate).toLocaleString('tr-TR')}</Text>
                </HStack>

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

                <Divider />

                <Box>
                  <Text fontWeight="semibold" mb={2}>Şirket İçi Yazışmalar</Text>

                  {canComment && (
                    <Box mb={4} p={3} bg="gray.50" borderRadius="md" _dark={{ bg: 'gray.700' }}>
                      <Textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Yorum yazın (min 10 karakter)..."
                        rows={3}
                        mb={2}
                      />
                      <ProtectedButton requiredClaims={[SupportRequestCommentsOperationClaims.Create]}>
                        <Button size="sm" colorScheme="blue" onClick={handleAddComment} isDisabled={commentText.trim().length < 10}>
                          Yorum Ekle
                        </Button>
                      </ProtectedButton>
                    </Box>
                  )}

                  <VStack align="stretch" spacing={3}>
                    {data.comments && data.comments.length > 0 ? (
                      data.comments.map((comment) => (
                        <Box key={comment.id} p={3} borderWidth="1px" borderRadius="md" bg="gray.50" _dark={{ bg: 'gray.700' }}>
                          <Flex justify="space-between" align="start" mb={2}>
                            <Text fontWeight="semibold" color={valueColor}>
                              {comment.sender.name} {comment.sender.surname}
                            </Text>
                            {canEditDeleteComment(comment) && (
                              <HStack>
                                <IconButton
                                  aria-label="düzenle"
                                  icon={<EditIcon />}
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEditComment(comment)}
                                />
                                <IconButton
                                  aria-label="sil"
                                  icon={<DeleteIcon />}
                                  size="sm"
                                  variant="ghost"
                                  colorScheme="red"
                                  onClick={() => setDeleteCommentId(comment.id)}
                                />
                              </HStack>
                            )}
                          </Flex>

                          {editingComment === comment.id ? (
                            <VStack align="stretch" spacing={2}>
                              <Textarea
                                value={editCommentText}
                                onChange={(e) => setEditCommentText(e.target.value)}
                                rows={2}
                              />
                              <HStack>
                                <Button size="sm" colorScheme="blue" onClick={() => handleSaveComment(comment.id)}>
                                  Kaydet
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => { setEditingComment(null); setEditCommentText(''); }}>
                                  İptal
                                </Button>
                              </HStack>
                            </VStack>
                          ) : (
                            <Text color={valueColor} whiteSpace="pre-wrap">{comment.content}</Text>
                          )}
                        </Box>
                      ))
                    ) : (
                      <Text color={labelColor} fontSize="sm">Henüz yorum yok</Text>
                    )}
                  </VStack>
                </Box>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {data && (
        <SupportRequestUpdateModal
          isOpen={isUpdateOpen}
          onClose={onUpdateClose}
          onUpdated={onRefresh}
          data={data}
          onUpdate={(p) => supportRequestService.updateSupportRequest(p)}
          primeUsers={primeUsers}
        />
      )}

      <AlertDialog isOpen={!!deleteCommentId} leastDestructiveRef={cancelRef} onClose={() => setDeleteCommentId(null)}>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>Yorumu sil</AlertDialogHeader>
          <AlertDialogBody>Bu yorumu silmek istediğinize emin misiniz?</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={() => setDeleteCommentId(null)}>İptal</Button>
            <Button colorScheme="red" ml={3} onClick={handleDeleteComment}>Sil</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SupportRequestAdminDetailModal;

