import {
  Flex,
  Image,
  Text,
} from "@chakra-ui/react";
import tesviklendirLogo from "../../../tesviklendir-byz.png";
import qrCode from "../../../qrtes.jpg";
import React from "react";

export default function SidebarDocs() {
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
        <Image 
          src={qrCode} 
          w='150px' 
          h='150px'
          borderRadius='20px'
          boxShadow='xl'
        />
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
