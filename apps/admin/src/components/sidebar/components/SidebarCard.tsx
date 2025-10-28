import {
  Flex,
  Image,
  Text,
  Box,
} from "@chakra-ui/react";
import tesviklendirLogo from "../../../tesviklendir-byz.png";
import qrCode from "../../../qrtes.jpg";
import React from "react";
import { useColorModeValue } from "@chakra-ui/react";

export default function SidebarDocs() {
  const cornerColor = useColorModeValue("#0d47a1", "#ffffff");
  const qrSize = 110; // px (reduced by half)
  const cornerThickness = 6; // px
  const cornerLength = 30; // px
  const cornerOffset = 8; // px (outside)
  return (
    <Flex
      justify='center'
      direction='column'
      align='center'
      borderRadius='30px'>
      {/* QR Code */}
      <Flex
        direction='column'
        align='center'
        justify='center'
        px='15px'
        pb='15px'>
        <Box position='relative' w={`${qrSize}px`} h={`${qrSize}px`}>
          <Image 
            src={qrCode} 
            w={`${qrSize}px`} 
            h={`${qrSize}px`}
            borderRadius='16px'
            boxShadow='xl'
          />
          {/* Köşe çizgileri (örneğe benzer dış L-şekli) */}
          {/* Sol-Üst */}
          <Box position='absolute' top={`-${cornerOffset}px`} left={`-${cornerOffset}px`} w={`${cornerLength}px`} h={`${cornerThickness}px`} bg={cornerColor} borderRadius='4px' />
          <Box position='absolute' top={`-${cornerOffset}px`} left={`-${cornerOffset}px`} w={`${cornerThickness}px`} h={`${cornerLength}px`} bg={cornerColor} borderRadius='4px' />
          {/* Sağ-Üst */}
          <Box position='absolute' top={`-${cornerOffset}px`} right={`-${cornerOffset}px`} w={`${cornerLength}px`} h={`${cornerThickness}px`} bg={cornerColor} borderRadius='4px' />
          <Box position='absolute' top={`-${cornerOffset}px`} right={`-${cornerOffset}px`} w={`${cornerThickness}px`} h={`${cornerLength}px`} bg={cornerColor} borderRadius='4px' />
          {/* Sol-Alt */}
          <Box position='absolute' bottom={`-${cornerOffset}px`} left={`-${cornerOffset}px`} w={`${cornerLength}px`} h={`${cornerThickness}px`} bg={cornerColor} borderRadius='4px' />
          <Box position='absolute' bottom={`-${cornerOffset}px`} left={`-${cornerOffset}px`} w={`${cornerThickness}px`} h={`${cornerLength}px`} bg={cornerColor} borderRadius='4px' />
          {/* Sağ-Alt */}
          <Box position='absolute' bottom={`-${cornerOffset}px`} right={`-${cornerOffset}px`} w={`${cornerLength}px`} h={`${cornerThickness}px`} bg={cornerColor} borderRadius='4px' />
          <Box position='absolute' bottom={`-${cornerOffset}px`} right={`-${cornerOffset}px`} w={`${cornerThickness}px`} h={`${cornerLength}px`} bg={cornerColor} borderRadius='4px' />
        </Box>
      </Flex>

      {/* Hidden: Upgrade to PRO section */}
      {/* <Flex
        direction='column'
        mb='12px'
        align='center'
        justify='center'
        px='15px'
        pt='55px'>
        <Text
          fontSize={{ base: "lg", xl: "18px" }}
          color='white'
          fontWeight='bold'
          lineHeight='150%'
          textAlign='center'
          px='10px'
          mt="10px"
          mb='6px'>
          Upgrade to PRO
        </Text>
        <Text
          fontSize='14px'
          color={"white"}
          fontWeight='500'
          px='10px'
          mb='6px'
          textAlign='center'>
          Improve your development process and start doing more with Horizon UI
          PRO!
        </Text>
      </Flex>
      <Link href='https://horizon-ui.com/pro?ref=horizon-chakra-free'>
        <Button
          bg='whiteAlpha.300'
          _hover={{ bg: "whiteAlpha.200" }}
          _active={{ bg: "whiteAlpha.100" }}
          mb={{ sm: "16px", xl: "24px" }}
          color={"white"}
          fontWeight='regular'
          fontSize='sm'
          minW='185px'
          mx='auto'>
          Upgrade to PRO
        </Button>
      </Link> */}
    </Flex>
  );
}
