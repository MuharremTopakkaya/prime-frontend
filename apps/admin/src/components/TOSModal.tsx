import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  Text,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
  Divider,
  Badge,
  Flex,
  Grid,
  GridItem,
  Image,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import tosHealthImg from '../../../../src/images/toshealth.jpg';
import tosTicketImg from '../../../../src/images/tosticket.jpg';
import tosSportsImg from '../../../../src/images/tossports.jpg';
import tosTermalImg from '../../../../src/images/tostermal.png';
import appIcon from '../../../../src/images/web-app-manifest-192x192.png';

interface TOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TOSModal: React.FC<TOSModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const bgColor = useColorModeValue('white', 'navy.800');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'blue.600');

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered>
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
      <ModalContent
        bg={bgColor}
        borderRadius="2xl"
        boxShadow="2xl"
        maxH="90vh"
        overflow="hidden"
      >
        <ModalHeader
          bg="linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)"
          color="white"
          textAlign="center"
          py={6}
          position="relative"
        >
          {/* Background watermark removed per request */}
          <HStack spacing={3} justify="center" position="relative" zIndex={1}>
            <Image src={appIcon} alt="Teşviklendir" boxSize={{ base: '44px', md: '56px' }} borderRadius="md" />
            <Text fontSize="3xl" fontWeight="bold">
              {t('products.title')}
            </Text>
          </HStack>
          <Text fontSize="md" opacity={0.9} mt={2} position="relative" zIndex={1}>
            {t('products.subtitle')}
          </Text>
        </ModalHeader>
        
        <ModalCloseButton color="white" size="lg" />
        
        <ModalBody p={8} overflowY="auto">
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
            {/* TosHealth */}
            <GridItem>
              <Box
                bg={useColorModeValue('green.50', 'green.900')}
                borderRadius="xl"
                p={6}
                border="2px solid"
                borderColor={useColorModeValue('green.200', 'green.700')}
                position="relative"
                overflow="hidden"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'xl',
                  transition: 'all 0.3s ease'
                }}
              >
                <Box position="absolute" top={0} right={0} opacity={0.08}>
                  <Image src={tosHealthImg} alt="TosHealth" boxSize="120px" objectFit="cover" borderRadius="md" />
                </Box>
                <VStack align="start" spacing={4} position="relative" zIndex={1}>
                  <HStack>
                    <Image src={tosHealthImg} alt="TosHealth" boxSize="48px" objectFit="cover" borderRadius="md" borderWidth="2px" borderStyle="solid" borderColor={useColorModeValue('green.300','green.500')} />
                    <VStack align="start" spacing={1}>
                      <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                        {t('products.tosHealth.title')}
                      </Text>
                      <Badge colorScheme="green" variant="subtle" fontSize="sm" px={2} py={1}>
                        Sağlık Turizmi
                      </Badge>
                    </VStack>
                  </HStack>
                  <Text fontSize="sm" color={textColor} lineHeight="1.6">
                    {t('products.tosHealth.description')}
                  </Text>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="green.600" mb={2}>
                      Ana Özellikler:
                    </Text>
                    <VStack align="start" spacing={1}>
                      <Text fontSize="xs">• Tek panelde teşvik yönetimi</Text>
                      <Text fontSize="xs">• %80 gelir artışı</Text>
                      <Text fontSize="xs">• API entegrasyonu</Text>
                      <Text fontSize="xs">• Otomatik belge üretimi</Text>
                    </VStack>
                  </Box>
                </VStack>
              </Box>
            </GridItem>

            {/* TosTermal (sağ üst) */}
            <GridItem>
              <Box
                bg={useColorModeValue('blue.50', 'blue.900')}
                borderRadius="xl"
                p={6}
                border="2px solid"
                borderColor={useColorModeValue('blue.200', 'blue.700')}
                position="relative"
                overflow="hidden"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'xl',
                  transition: 'all 0.3s ease'
                }}
              >
                <Box position="absolute" top={0} right={0} opacity={0.08}>
                  <Image src={tosTermalImg} alt="TosTermal" boxSize="120px" objectFit="cover" borderRadius="md" />
                </Box>
                <VStack align="start" spacing={4} position="relative" zIndex={1}>
                  <HStack>
                    <Image src={tosTermalImg} alt="TosTermal" boxSize="48px" objectFit="cover" borderRadius="md" borderWidth="2px" borderStyle="solid" borderColor={useColorModeValue('blue.300','blue.500')} />
                    <VStack align="start" spacing={1}>
                      <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                        {t('products.tosTermal.title')}
                      </Text>
                      <Badge colorScheme="blue" variant="subtle" fontSize="sm" px={2} py={1}>
                        Termal Turizm
                      </Badge>
                    </VStack>
                  </HStack>
                  <Text fontSize="sm" color={textColor} lineHeight="1.6">
                    {t('products.tosTermal.description')}
                  </Text>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="blue.600" mb={2}>
                      Ana Özellikler:
                    </Text>
                    <VStack align="start" spacing={1}>
                      <Text fontSize="xs">• Operasyonel entegrasyon</Text>
                      <Text fontSize="xs">• Check-in'den tedavi bitimine</Text>
                      <Text fontSize="xs">• Anbean veri işleme</Text>
                      <Text fontSize="xs">• Teşvik ekonomisi dönüşümü</Text>
                    </VStack>
                  </Box>
                </VStack>
              </Box>
            </GridItem>

            {/* TosTicket (alta taşındı) */}
            <GridItem>
              <Box
                bg={useColorModeValue('orange.50', 'orange.900')}
                borderRadius="xl"
                p={6}
                border="2px solid"
                borderColor={useColorModeValue('orange.200', 'orange.700')}
                position="relative"
                overflow="hidden"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'xl',
                  transition: 'all 0.3s ease'
                }}
              >
                <Box position="absolute" top={0} right={0} opacity={0.08}>
                  <Image src={tosTicketImg} alt="TosTicket" boxSize="120px" objectFit="cover" borderRadius="md" />
                </Box>
                <VStack align="start" spacing={4} position="relative" zIndex={1}>
                  <HStack>
                    <Image src={tosTicketImg} alt="TosTicket" boxSize="48px" objectFit="cover" borderRadius="md" borderWidth="2px" borderStyle="solid" borderColor={useColorModeValue('orange.300','orange.500')} />
                    <VStack align="start" spacing={1}>
                      <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                        {t('products.tosTicket.title')}
                      </Text>
                      <Badge colorScheme="orange" variant="subtle" fontSize="sm" px={2} py={1}>
                        Bilet Entegrasyonu
                      </Badge>
                    </VStack>
                  </HStack>
                  <Text fontSize="sm" color={textColor} lineHeight="1.6">
                    {t('products.tosTicket.description')}
                  </Text>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="orange.600" mb={2}>
                      Ana Özellikler:
                    </Text>
                    <VStack align="start" spacing={1}>
                      <Text fontSize="xs">• Uluslararası hasta biletleri</Text>
                      <Text fontSize="xs">• Anında destek tablosu</Text>
                      <Text fontSize="xs">• Otomatik belge dönüşümü</Text>
                      <Text fontSize="xs">• Klinik alan adı entegrasyonu</Text>
                    </VStack>
                  </Box>
                </VStack>
              </Box>
            </GridItem>

            {/* TosSports */}
            <GridItem>
              <Box
                bg={useColorModeValue('gray.50', 'gray.900')}
                borderRadius="xl"
                p={6}
                border="2px solid"
                borderColor={useColorModeValue('gray.300', 'gray.700')}
                position="relative"
                overflow="hidden"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'xl',
                  transition: 'all 0.3s ease'
                }}
              >
                <Box position="absolute" top={0} right={0} opacity={0.08}>
                  <Image src={tosSportsImg} alt="TosSports" boxSize="120px" objectFit="cover" borderRadius="md" />
                </Box>
                <VStack align="start" spacing={4} position="relative" zIndex={1}>
                  <HStack>
                    <Image src={tosSportsImg} alt="TosSports" boxSize="48px" objectFit="cover" borderRadius="md" borderWidth="2px" borderStyle="solid" borderColor={useColorModeValue('gray.400','gray.500')} />
                    <VStack align="start" spacing={1}>
                      <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                        {t('products.tosSports.title')}
                      </Text>
                      <Badge colorScheme="gray" variant="subtle" fontSize="sm" px={2} py={1}>
                        Spor Turizmi
                      </Badge>
                    </VStack>
                  </HStack>
                  <Text fontSize="sm" color={textColor} lineHeight="1.6">
                    {t('products.tosSports.description')}
                  </Text>
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color="gray.600" mb={2}>
                      Ana Özellikler:
                    </Text>
                    <VStack align="start" spacing={1}>
                      <Text fontSize="xs">• Spor kampları ve turnuvalar</Text>
                      <Text fontSize="xs">• Fiziksel rehabilitasyon</Text>
                      <Text fontSize="xs">• Çapraz satış fırsatları</Text>
                      <Text fontSize="xs">• CEO vizyonu ve analiz</Text>
                    </VStack>
                  </Box>
                </VStack>
              </Box>
            </GridItem>
          </Grid>

          <Divider my={8} />

          {/* Benefits Section */}
          <Box textAlign="center">
            <Text fontSize="2xl" fontWeight="bold" color={textColor} mb={6}>
              {t('products.benefits.title')}
            </Text>
            <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }} gap={4}>
              {[
                "Integrated SaaS Solution",
                "80% Revenue Increase", 
                "Automatic Document Generation",
                "API Integration",
                "Real-time Data Processing",
                "Cross-selling Opportunities",
                "Analysis and Reporting",
                "Global Branding"
              ].map((benefit: string, index: number) => (
                <GridItem key={index}>
                  <Box
                    bg={useColorModeValue('gray.50', 'gray.700')}
                    borderRadius="lg"
                    p={4}
                    border="1px solid"
                    borderColor={borderColor}
                    _hover={{
                      bg: useColorModeValue('blue.50', 'blue.800'),
                      borderColor: 'blue.300',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <Text fontSize="sm" fontWeight="medium" color={textColor}>
                      {benefit}
                    </Text>
                  </Box>
                </GridItem>
              ))}
            </Grid>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TOSModal;
