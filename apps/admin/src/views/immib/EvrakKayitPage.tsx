import React, { useState, useMemo } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Badge,
  Input,
  Select,
  HStack,
  VStack,
  Heading,
  Flex,
  Button,
  IconButton,
  useColorModeValue,
  InputGroup,
  InputLeftElement,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Tooltip,
  Wrap,
  WrapItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Divider,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  TableContainer,
  Tfoot,
  useToast
} from '@chakra-ui/react';
import { SearchIcon, DownloadIcon, ViewIcon, EditIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';
import evrakData from '../../assets/birlik_onay_20251028_225717.json';

interface EvrakRecord {
  evrakNo: string;
  evrakTarihi: string;
  destekTuru: string;
  surec: string;
  sonuc: string;
  faaliyetDetayi: string;
  ilgiliUzman: string;
  destekBaslangicTarihi: string;
  destekBitisTarihi: string;
  eksikYazisiTarihi: string;
  retTarihi: string;
  onOnayTarihi: string;
  onOnaySayisi: string;
  onOnayTutari: string;
  tahakkukTarihi: string;
  tlTutari: string;
  abdDolari: string;
  status: string;
}

const EvrakKayitPage: React.FC = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [destekTuruFilter, setDestekTuruFilter] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState<EvrakRecord | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const bg = useColorModeValue('white', 'navy.800');
  const borderColor = useColorModeValue('gray.200', 'blue.600');
  const textColor = useColorModeValue('gray.600', 'white');

  // JSON verilerini al
  const records: EvrakRecord[] = evrakData.records;
  const statistics = evrakData.statistics;

  // Filtreleme ve arama
  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      const matchesSearch = 
        record.evrakNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.faaliyetDetayi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.ilgiliUzman.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.destekTuru.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
      const matchesDestekTuru = destekTuruFilter === 'all' || record.destekTuru === destekTuruFilter;

      return matchesSearch && matchesStatus && matchesDestekTuru;
    });
  }, [searchTerm, statusFilter, destekTuruFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRecords = filteredRecords.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, destekTuruFilter]);

  // Status badge rengi
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'green';
      case 'rejected':
        return 'red';
      case 'unknown':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  // Status metni
  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return t('evrakKayit.statusApproved');
      case 'rejected':
        return t('evrakKayit.statusRejected');
      case 'unknown':
        return t('evrakKayit.statusPending');
      default:
        return 'Bilinmiyor';
    }
  };

  // Detay görüntüleme
  const handleViewDetails = (record: EvrakRecord) => {
    setSelectedRecord(record);
    onOpen();
  };

  // Destek türleri listesi
  const destekTurleri = useMemo(() => {
    const turler = [...new Set(records.map(r => r.destekTuru))];
    return turler.filter(tur => tur && tur.trim() !== '');
  }, [records]);

  return (
    <Box p={{ base: 2, md: 4, lg: 6 }} pt={{ base: 8, md: 12, lg: 24 }}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
          <Heading size={{ base: "lg", md: "xl" }} color={textColor}>
            {t('evrakKayit.pageTitle')}
          </Heading>
          <HStack spacing={2}>
            <Button
              leftIcon={<DownloadIcon />}
              size={{ base: "sm", md: "md" }}
              colorScheme="blue"
              variant="solid"
            >
              {t('evrakKayit.excelDownload')}
            </Button>
          </HStack>
        </Flex>

        {/* İstatistikler */}
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={6}>
          <Card bg={bg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel fontSize={{ base: "xs", md: "sm" }}>{t('evrakKayit.totalDocuments')}</StatLabel>
                <StatNumber fontSize={{ base: "lg", md: "xl" }}>{statistics.totalRecords}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  {t('evrakKayit.registeredDocumentsCount')}
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={bg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel fontSize={{ base: "xs", md: "sm" }}>{t('evrakKayit.approvedByUnion')}</StatLabel>
                <StatNumber fontSize={{ base: "lg", md: "xl" }} color="green.500">
                  {statistics.birlikOnay}
                </StatNumber>
                <StatHelpText>
                  {t('evrakKayit.approvedDocuments')}
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={bg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel fontSize={{ base: "xs", md: "sm" }}>{t('evrakKayit.rejected')}</StatLabel>
                <StatNumber fontSize={{ base: "lg", md: "xl" }} color="red.500">
                  {statistics.ret}
                </StatNumber>
                <StatHelpText>
                  {t('evrakKayit.rejectedDocuments')}
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card bg={bg} borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel fontSize={{ base: "xs", md: "sm" }}>{t('evrakKayit.totalAmount')}</StatLabel>
                <StatNumber fontSize={{ base: "lg", md: "xl" }} color={textColor}>
                  {statistics.totalTlAmount.toLocaleString('tr-TR')}
                </StatNumber>
                <StatHelpText>
                  {t('evrakKayit.totalTLAmount')}
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Filtreler */}
        <Card bg={bg} borderColor={borderColor}>
          <CardBody>
            <Wrap spacing={6} align="center">
              <WrapItem flex="1" minW={{ base: "100%", sm: "300px" }} maxW={{ base: "100%", sm: "350px" }}>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <SearchIcon color="gray.300" />
                  </InputLeftElement>
                  <Input
  placeholder={t('evrakKayit.searchPlaceholder')}
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  size={{ base: "sm", md: "md" }}
  pl={12}
  pr={4}
  sx={{ textIndent: "14px" }}
  color={textColor}
  _placeholder={{ color: textColor }}
/>
                </InputGroup>
              </WrapItem>

              <WrapItem>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  size={{ base: "sm", md: "md" }}
                  minW="150px"
                >
                  <option value="all">{t('evrakKayit.allStatuses')}</option>
                  <option value="approved">{t('evrakKayit.statusApproved')}</option>
                  <option value="rejected">{t('evrakKayit.statusRejected')}</option>
                  <option value="unknown">{t('evrakKayit.statusPending')}</option>
                </Select>
              </WrapItem>

              <WrapItem>
                <Select
                  value={destekTuruFilter}
                  onChange={(e) => setDestekTuruFilter(e.target.value)}
                  size={{ base: "sm", md: "md" }}
                  minW="200px"
                >
                  <option value="all">{t('evrakKayit.allSupportTypes')}</option>
                  {destekTurleri.map((tur, index) => (
                    <option key={index} value={tur}>
                      {tur}
                    </option>
                  ))}
                </Select>
              </WrapItem>
            </Wrap>
          </CardBody>
        </Card>

        {/* Tablo */}
        <Card bg={bg} borderColor={borderColor} boxShadow="lg">
          <CardHeader bg={useColorModeValue('gray.50', 'navy.700')} borderBottom="1px solid" borderColor={borderColor}>
            <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
              <Heading size="md" color={textColor}>
                {t('evrakKayit.documentRecords')} ({filteredRecords.length} kayıt)
              </Heading>
              <HStack spacing={2}>
                <Text fontSize={{ base: "xs", md: "sm" }} color={textColor}>{t('evrakKayit.itemsPerPage')}</Text>
                <Select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  size={{ base: "xs", md: "sm" }}
                  w="80px"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </Select>
              </HStack>
            </Flex>
          </CardHeader>
          <CardBody p={0}>
            <TableContainer>
              <Table size={{ base: "sm", md: "md" }} variant="simple">
                <Thead>
                  <Tr>
                    <Th fontSize={{ base: "xs", md: "sm" }}>{t('evrakKayit.documentNo')}</Th>
                    <Th fontSize={{ base: "xs", md: "sm" }}>{t('evrakKayit.date')}</Th>
                    <Th fontSize={{ base: "xs", md: "sm" }}>{t('evrakKayit.supportType')}</Th>
                    <Th fontSize={{ base: "xs", md: "sm" }}>{t('evrakKayit.status')}</Th>
                    <Th fontSize={{ base: "xs", md: "sm" }}>{t('evrakKayit.activityDetail')}</Th>
                    <Th fontSize={{ base: "xs", md: "sm" }}>{t('evrakKayit.expert')}</Th>
                    <Th fontSize={{ base: "xs", md: "sm" }}>{t('evrakKayit.tlAmount')}</Th>
                    <Th fontSize={{ base: "xs", md: "sm" }}>{t('evrakKayit.actions')}</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {paginatedRecords.map((record, index) => (
                    <Tr key={index}>
                      <Td fontSize={{ base: "xs", md: "sm" }} fontWeight="bold">
                        {record.evrakNo}
                      </Td>
                      <Td fontSize={{ base: "xs", md: "sm" }}>
                        {record.evrakTarihi}
                      </Td>
                      <Td fontSize={{ base: "xs", md: "sm" }} maxW="150px">
                        <Text isTruncated title={record.destekTuru}>
                          {record.destekTuru}
                        </Text>
                      </Td>
                      <Td>
                        <Badge colorScheme={getStatusColor(record.status)}>
                          {getStatusText(record.status)}
                        </Badge>
                      </Td>
                      <Td fontSize={{ base: "xs", md: "sm" }} maxW="200px">
                        <Text isTruncated title={record.faaliyetDetayi}>
                          {record.faaliyetDetayi || '-'}
                        </Text>
                      </Td>
                      <Td fontSize={{ base: "xs", md: "sm" }}>
                        {record.ilgiliUzman}
                      </Td>
                      <Td fontSize={{ base: "xs", md: "sm" }}>
                        {record.tlTutari ? `${parseFloat(record.tlTutari).toLocaleString('tr-TR')} TL` : '-'}
                      </Td>
                      <Td>
                        <HStack spacing={1}>
                          <Tooltip label={t('evrakKayit.viewDetails')}>
                            <IconButton
                              aria-label={t('evrakKayit.viewDetails')}
                              icon={<ViewIcon />}
                              size={{ base: "xs", md: "sm" }}
                              variant="ghost"
                              onClick={() => handleViewDetails(record)}
                            />
                          </Tooltip>
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </CardBody>
          
          {/* Modern Pagination */}
          <Box p={4} borderTop="1px solid" borderColor={borderColor}>
            <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
              <Text fontSize={{ base: "xs", md: "sm" }} color={textColor}>
                {t('evrakKayit.showingRecords', { 
                  startIndex: startIndex + 1, 
                  endIndex: Math.min(endIndex, filteredRecords.length), 
                  totalRecords: filteredRecords.length 
                })}
              </Text>
              
              <HStack spacing={2}>
                <Button
                  size={{ base: "xs", md: "sm" }}
                  variant="outline"
                  colorScheme="blue"
                  onClick={() => setCurrentPage(1)}
                  isDisabled={currentPage === 1}
                >
                  {t('evrakKayit.first')}
                </Button>
                <Button
                  size={{ base: "xs", md: "sm" }}
                  variant="outline"
                  colorScheme="blue"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  isDisabled={currentPage === 1}
                >
                  {t('evrakKayit.previous')}
                </Button>
                
                {/* Page Numbers */}
                <HStack spacing={1}>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        size={{ base: "xs", md: "sm" }}
                        variant={currentPage === pageNum ? "solid" : "outline"}
                        colorScheme="blue"
                        onClick={() => setCurrentPage(pageNum)}
                        minW={{ base: "32px", md: "40px" }}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </HStack>
                
                <Button
                  size={{ base: "xs", md: "sm" }}
                  variant="outline"
                  colorScheme="blue"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  isDisabled={currentPage === totalPages}
                >
                  {t('evrakKayit.next')}
                </Button>
                <Button
                  size={{ base: "xs", md: "sm" }}
                  variant="outline"
                  colorScheme="blue"
                  onClick={() => setCurrentPage(totalPages)}
                  isDisabled={currentPage === totalPages}
                >
                  {t('evrakKayit.last')}
                </Button>
              </HStack>
            </Flex>
          </Box>
        </Card>

        {/* Detay Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size={{ base: "full", md: "xl" }}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {t('evrakKayit.documentDetails')} - {selectedRecord?.evrakNo}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedRecord && (
                <VStack spacing={4} align="stretch">
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <Box>
                      <Text fontWeight="bold" fontSize={{ base: "sm", md: "md" }} color={textColor}>{t('evrakKayit.documentInfo')}</Text>
                      <VStack spacing={2} align="stretch" mt={2}>
                        <Flex justify="space-between">
                          <Text fontSize={{ base: "xs", md: "sm" }} color={textColor}>Evrak No:</Text>
                          <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="bold" color={textColor}>{selectedRecord.evrakNo}</Text>
                        </Flex>
                        <Flex justify="space-between">
                          <Text fontSize={{ base: "xs", md: "sm" }} color={textColor}>Evrak Tarihi:</Text>
                          <Text fontSize={{ base: "xs", md: "sm" }} color={textColor}>{selectedRecord.evrakTarihi}</Text>
                        </Flex>
                        <Flex justify="space-between">
                          <Text fontSize={{ base: "xs", md: "sm" }} color={textColor}>Destek Türü:</Text>
                          <Text fontSize={{ base: "xs", md: "sm" }} color={textColor}>{selectedRecord.destekTuru}</Text>
                        </Flex>
                        <Flex justify="space-between">
                          <Text fontSize={{ base: "xs", md: "sm" }} color={textColor}>Süreç:</Text>
                          <Text fontSize={{ base: "xs", md: "sm" }} color={textColor}>{selectedRecord.surec}</Text>
                        </Flex>
                        <Flex justify="space-between">
                          <Text fontSize={{ base: "xs", md: "sm" }} color={textColor}>Sonuç:</Text>
                          <Badge colorScheme={getStatusColor(selectedRecord.status)}>
                            {selectedRecord.sonuc || getStatusText(selectedRecord.status)}
                          </Badge>
                        </Flex>
                      </VStack>
                    </Box>

                    <Box>
                      <Text fontWeight="bold" fontSize={{ base: "sm", md: "md" }} color={textColor}>{t('evrakKayit.activityInfo')}</Text>
                      <VStack spacing={2} align="stretch" mt={2}>
                        <Flex justify="space-between">
                          <Text fontSize={{ base: "xs", md: "sm" }} color={textColor}>Faaliyet Detayı:</Text>
                          <Text fontSize={{ base: "xs", md: "sm" }} color={textColor}>{selectedRecord.faaliyetDetayi || '-'}</Text>
                        </Flex>
                        <Flex justify="space-between">
                          <Text fontSize={{ base: "xs", md: "sm" }} color={textColor}>İlgili Uzman:</Text>
                          <Text fontSize={{ base: "xs", md: "sm" }} color={textColor}>{selectedRecord.ilgiliUzman}</Text>
                        </Flex>
                        <Flex justify="space-between">
                          <Text fontSize={{ base: "xs", md: "sm" }} color={textColor}>Başlangıç:</Text>
                          <Text fontSize={{ base: "xs", md: "sm" }} color={textColor}>{selectedRecord.destekBaslangicTarihi || '-'}</Text>
                        </Flex>
                        <Flex justify="space-between">
                          <Text fontSize={{ base: "xs", md: "sm" }} color={textColor}>Bitiş:</Text>
                          <Text fontSize={{ base: "xs", md: "sm" }} color={textColor}>{selectedRecord.destekBitisTarihi || '-'}</Text>
                        </Flex>
                      </VStack>
                    </Box>
                  </SimpleGrid>

                  <Divider />

                  <Box>
                    <Text fontWeight="bold" fontSize={{ base: "sm", md: "md" }} mb={2} color={textColor}>{t('evrakKayit.financialInfo')}</Text>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <Box>
                        <Text fontSize={{ base: "xs", md: "sm" }} color={textColor}>TL Tutarı:</Text>
                        <Text fontSize={{ base: "sm", md: "md" }} fontWeight="bold" color="green.500">
                          {selectedRecord.tlTutari ? `${parseFloat(selectedRecord.tlTutari).toLocaleString('tr-TR')} TL` : '-'}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize={{ base: "xs", md: "sm" }} color={textColor}>USD Tutarı:</Text>
                        <Text fontSize={{ base: "sm", md: "md" }} fontWeight="bold" color="blue.500">
                          {selectedRecord.abdDolari ? `${parseFloat(selectedRecord.abdDolari).toLocaleString('tr-TR')} USD` : '-'}
                        </Text>
                      </Box>
                    </SimpleGrid>
                  </Box>

                  <Divider />

                  <Box>
                    <Text fontWeight="bold" fontSize={{ base: "sm", md: "md" }} mb={2} color={textColor}>{t('evrakKayit.dateInfo')}</Text>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <VStack spacing={2} align="stretch">
                        <Flex justify="space-between">
                          <Text fontSize={{ base: "xs", md: "sm" }} color={textColor}>Eksik Yazısı:</Text>
                          <Text fontSize={{ base: "xs", md: "sm" }} color={textColor}>{selectedRecord.eksikYazisiTarihi || '-'}</Text>
                        </Flex>
                        <Flex justify="space-between">
                          <Text fontSize={{ base: "xs", md: "sm" }} color={textColor}>Ret Tarihi:</Text>
                          <Text fontSize={{ base: "xs", md: "sm" }} color={textColor}>{selectedRecord.retTarihi || '-'}</Text>
                        </Flex>
                      </VStack>
                      <VStack spacing={2} align="stretch">
                        <Flex justify="space-between">
                          <Text fontSize={{ base: "xs", md: "sm" }} color={textColor}>Ön Onay:</Text>
                          <Text fontSize={{ base: "xs", md: "sm" }} color={textColor}>{selectedRecord.onOnayTarihi || '-'}</Text>
                        </Flex>
                        <Flex justify="space-between">
                          <Text fontSize={{ base: "xs", md: "sm" }} color={textColor}>Tahakkuk:</Text>
                          <Text fontSize={{ base: "xs", md: "sm" }} color={textColor}>{selectedRecord.tahakkukTarihi || '-'}</Text>
                        </Flex>
                      </VStack>
                    </SimpleGrid>
                  </Box>
                </VStack>
              )}
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose} colorScheme="blue">{t('evrakKayit.close')}</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
};

export default EvrakKayitPage;