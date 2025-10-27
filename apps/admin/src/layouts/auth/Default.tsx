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
          bottom="120px"
          right="20px"
          zIndex={10}
        >
          <Button
            onClick={onOpen}
            bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            color="white"
            size="lg"
            borderRadius="full"
            px={16}
            py={8}
            fontSize="lg"
            fontWeight="bold"
            boxShadow="xl"
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "2xl",
              bg: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
            }}
            _active={{
              transform: "translateY(0px)",
            }}
            transition="all 0.3s ease"
            leftIcon={
              <Image src={TOSIcon} w="80px" h="40px" alt="TOS" />
            }
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
