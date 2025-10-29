// Chakra imports
import { Box, Flex, Icon, Text, Button, useDisclosure, Image } from "@chakra-ui/react";
import PropTypes from "prop-types";
import React from "react";
import Footer from "components/footer/FooterAuth";
import FixedPlugin from "components/fixedPlugin/FixedPlugin";
import TOSModal from "components/TOSModal";
// Custom components
import { NavLink } from "react-router-dom";
// Assets
import { FaChevronLeft } from "react-icons/fa";
import TOSIcon from "assets/img/tos.png";

function AuthIllustration(props) {
  const { children, illustrationBackground } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  // Chakra color mode
  return (
    <Flex position='relative' h='max-content'>
      <Flex
        h={{
          sm: "initial",
          md: "unset",
          lg: "100vh",
          xl: "97vh",
        }}
        w='100%'
        maxW={{ md: "66%", lg: "1313px" }}
        mx='auto'
        pt={{ sm: "50px", md: "0px" }}
        px={{ lg: "30px", xl: "0px" }}
        ps={{ xl: "70px" }}
        justifyContent='start'
        direction='column'>
        {children}
        <Box
          display={{ base: "none", md: "block" }}
          h='100%'
          minH='100vh'
          w={{ lg: "50vw", "2xl": "44vw" }}
          position='absolute'
          right='0px'>
          <Flex
            bg={`url(${illustrationBackground})`}
            justify='center'
            align='end'
            w='100%'
            h='100%'
            bgSize='cover'
            bgPosition='50%'
            position='absolute'
            borderBottomLeftRadius={{ lg: "120px", xl: "200px" }}></Flex>
        </Box>
        
        {/* TOS Products Section */}
        <Box
          position="absolute"
          bottom={{ base: "-67px", md: "120px" }}
          left={{ base: "16px", md: "20px" }}
          zIndex={isOpen ? 0 : 1}
          pointerEvents={isOpen ? 'none' : 'auto'}
        >
          <Button
            onClick={onOpen}
            bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            color="white"
            size={{ base: "md", md: "lg" }}
            borderRadius="20px"
            px={{ base: 8, md: 16 }}
            py={{ base: 6, md: 8 }}
            fontSize={{ base: "xs", md: "lg" }}
            fontWeight="bold"
            boxShadow="0 10px 25px rgba(102, 126, 234, 0.3)"
            _hover={{
              transform: "translateY(-3px) scale(1.02)",
              boxShadow: "0 15px 35px rgba(102, 126, 234, 0.4)",
              bg: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
            }}
            _active={{
              transform: "translateY(-1px) scale(0.98)",
            }}
            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            leftIcon={
              <Box
                position="relative"
                w={{ base: "60px", md: "90px" }}
                h={{ base: "30px", md: "45px" }}
                borderRadius="8px"
                bg="rgba(255, 255, 255, 0.2)"
                display="flex"
                alignItems="center"
                justifyContent="center"
                backdropFilter="blur(10px)"
              >
                <Image 
                  src={TOSIcon} 
                  w={{ base: "55px", md: "80px" }} 
                  h={{ base: "26px", md: "40px" }} 
                  alt="TOS" 
                  filter="brightness(1.2)"
                />
              </Box>
            }
            rightIcon={
              <Icon
                as={FaChevronLeft}
                w={{ base: "12px", md: "16px" }}
                h={{ base: "12px", md: "16px" }}
                transform="rotate(180deg)"
                opacity={0.8}
              />
            }
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: "20px",
              padding: "2px",
              background: "linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))",
              mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              maskComposite: "xor",
              WebkitMaskComposite: "xor",
            }}
          >
            TOS Ürünleri
          </Button>
        </Box>
        
        <Footer />
      </Flex>
      <FixedPlugin />
      
      {/* TOS Modal */}
      <TOSModal isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
}
// PROPS

AuthIllustration.propTypes = {
  children: PropTypes.node,
  illustrationBackground: PropTypes.string,
  image: PropTypes.any,
};

export default AuthIllustration;
