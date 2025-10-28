/* eslint-disable */
/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2023 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
// Chakra imports
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from "@chakra-ui/react";
// Custom components
import { HSeparator } from "components/separator/Separator";
import AuthIllustration from "layouts/auth/Default";
// Assets
import illustration from "../../../assets/img/auth/authnew.png";
import { FcGoogle } from "react-icons/fc";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import { ChevronDownIcon } from "@chakra-ui/icons";
// Auth
import { useAuth } from "../../../contexts/AuthContext";

function SignIn() {
  // Auth context
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const { t, i18n } = useTranslation();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Chakra color mode
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const textColorDetails = useColorModeValue("navy.700", "secondaryGray.600");
  const textColorBrand = useColorModeValue("brand.500", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");
  const googleBg = useColorModeValue("secondaryGray.300", "whiteAlpha.200");
  const googleText = useColorModeValue("navy.700", "white");
  const googleHover = useColorModeValue(
    { bg: "gray.200" },
    { bg: "whiteAlpha.300" }
  );
  const googleActive = useColorModeValue(
    { bg: "secondaryGray.300" },
    { bg: "whiteAlpha.200" }
  );
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  // Language change handler
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: t('auth.error'),
        description: t('auth.emailPasswordRequired'),
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(email, password);
      
      if (success) {
        toast({
          title: t('auth.success'),
          description: t('auth.loginSuccessful'),
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        
        // Authentication method'a göre yönlendirme
        setTimeout(() => {
          // AuthContext'ten authentication method'u al
          // Burada navigate işlemi App.tsx'teki root redirect ile otomatik olarak yapılacak
          navigate("/");
        }, 1000);
      } else {
        toast({
          title: t('auth.error'),
          description: t('auth.invalidCredentials'),
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: t('auth.error'),
        description: t('auth.loginError'),
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <AuthIllustration illustrationBackground={illustration}>
      <Flex
        maxW={{ base: "100%", md: "max-content" }}
        w='100%'
        mx={{ base: "auto", lg: "0px" }}
        me='auto'
        h='100%'
        alignItems='start'
        justifyContent='center'
        mb={{ base: "30px", md: "60px" }}
        px={{ base: "25px", md: "0px" }}
        mt={{ base: "40px", md: "14vh" }}
        flexDirection='column'>
        <Box me='auto' position='relative'>
          {/* Language Switcher */}
          <Box position='absolute' top='-10px' right='-10px' zIndex={10}>
            <Menu placement='bottom-end' offset={[0, 5]}>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                variant='outline'
                size='xs'
                color={textColor}
                borderColor='gray.300'
                bg='white'
                _hover={{ 
                  bg: 'gray.50', 
                  borderColor: 'blue.400',
                  transform: 'translateY(-1px)',
                  boxShadow: 'md'
                }}
                _dark={{ 
                  color: 'gray.300', 
                  borderColor: 'gray.600',
                  bg: 'navy.800',
                  _hover: { 
                    bg: 'whiteAlpha.200', 
                    borderColor: 'blue.400',
                    transform: 'translateY(-1px)',
                    boxShadow: 'md'
                  } 
                }}
                fontWeight='500'
                fontSize='xs'
                transition='all 0.2s'
                boxShadow='sm'
                px={2}
                py={1}
                h='auto'
              >
                {i18n.language === 'tr' ? '🇹🇷 TR' : '🇺🇸 EN'}
              </MenuButton>
              <MenuList
                bg='white'
                border='1px solid'
                borderColor='gray.200'
                boxShadow='xl'
                borderRadius='md'
                py={1}
                minW='120px'
                maxW='120px'
                _dark={{
                  bg: 'navy.800',
                  borderColor: 'blue.600',
                  color: 'white'
                }}
              >
                <MenuItem
                  onClick={() => changeLanguage('tr')}
                  bg={i18n.language === 'tr' ? 'blue.50' : 'transparent'}
                  _hover={{
                    bg: 'gray.100',
                    _dark: { bg: 'gray.600' }
                  }}
                  borderRadius='sm'
                  mx={1}
                  py={1}
                  px={2}
                  fontSize='xs'
                  fontWeight={i18n.language === 'tr' ? '600' : '400'}
                  color={i18n.language === 'tr' ? 'blue.600' : 'gray.700'}
                  _dark={{ 
                    color: i18n.language === 'tr' ? 'blue.300' : 'gray.300',
                    bg: i18n.language === 'tr' ? 'blue.900' : 'transparent'
                  }}
                  transition='all 0.2s'
                >
                  🇹🇷 TR
                </MenuItem>
                <MenuItem
                  onClick={() => changeLanguage('en')}
                  bg={i18n.language === 'en' ? 'blue.50' : 'transparent'}
                  _hover={{
                    bg: 'gray.100',
                    _dark: { bg: 'gray.600' }
                  }}
                  borderRadius='sm'
                  mx={1}
                  py={1}
                  px={2}
                  fontSize='xs'
                  fontWeight={i18n.language === 'en' ? '600' : '400'}
                  color={i18n.language === 'en' ? 'blue.600' : 'gray.700'}
                  _dark={{ 
                    color: i18n.language === 'en' ? 'blue.300' : 'gray.300',
                    bg: i18n.language === 'en' ? 'blue.900' : 'transparent'
                  }}
                  transition='all 0.2s'
                >
                  🇺🇸 EN
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
          
          <Heading color={textColor} fontSize='36px' mb='10px'>
            {t('auth.signIn')}
          </Heading>
          <Text
            mb='36px'
            ms='4px'
            color={textColorSecondary}
            fontWeight='400'
            fontSize='md'>
            {t('auth.signInDescription')}
          </Text>
        </Box>
        <Flex
          zIndex='2'
          direction='column'
          w={{ base: "100%", md: "420px" }}
          maxW='100%'
          background='transparent'
          borderRadius={{ base: '12px', md: '15px' }}
          mx={{ base: "auto", lg: "unset" }}
          me='auto'
          mb={{ base: "20px", md: "auto" }}>
          <Button
            fontSize={{ base: 'xs', md: 'sm' }}
            me='0px'
            mb={{ base: '20px', md: '26px' }}
            py={{ base: '12px', md: '15px' }}
            h={{ base: '44px', md: '50px' }}
            borderRadius={{ base: '12px', md: '16px' }}
            bg={googleBg}
            color={googleText}
            fontWeight='500'
            _hover={googleHover}
            _active={googleActive}
            _focus={googleActive}>
            <Icon as={FcGoogle} w='20px' h='20px' me='10px' />
            {t('auth.signInWithGoogle')}
          </Button>
          <Flex align='center' mb={{ base: '20px', md: '25px' }}>
            <HSeparator />
            <Text color='gray.400' mx={{ base: '10px', md: '14px' }} fontSize={{ base: 'xs', md: 'sm' }}>
              {t('auth.or')}
            </Text>
            <HSeparator />
          </Flex>
          <form onSubmit={handleLogin}>
            <FormControl>
              <FormLabel
                display='flex'
                ms='4px'
                fontSize='sm'
                fontWeight='500'
                color={textColor}
                mb='8px'>
                {t('auth.email')}<Text color={brandStars}>*</Text>
              </FormLabel>
              <Input
                isRequired={true}
                variant='auth'
                fontSize='sm'
                ms={{ base: "0px", md: "0px" }}
                type='email'
                placeholder={t('auth.emailPlaceholder')}
                mb='24px'
                fontWeight='500'
                size='lg'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
              <FormLabel
                ms='4px'
                fontSize='sm'
                fontWeight='500'
                color={textColor}
                display='flex'>
                {t('auth.password')}<Text color={brandStars}>*</Text>
              </FormLabel>
              <InputGroup size='md'>
                <Input
                  isRequired={true}
                  fontSize='sm'
                  placeholder={t('auth.passwordPlaceholder')}
                  mb='24px'
                  size='lg'
                  type={show ? "text" : "password"}
                  variant='auth'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <InputRightElement display='flex' alignItems='center' mt='4px'>
                  <Icon
                    color={textColorSecondary}
                    _hover={{ cursor: "pointer" }}
                    as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                    onClick={handleClick}
                  />
                </InputRightElement>
              </InputGroup>
              <Flex justifyContent='space-between' align='center' mb='24px'>
                <FormControl display='flex' alignItems='center'>
                  <Checkbox
                    id='remember-login'
                    colorScheme='brandScheme'
                    me='10px'
                    disabled={isLoading}
                  />
                  <FormLabel
                    htmlFor='remember-login'
                    mb='0'
                    fontWeight='normal'
                    color={textColor}
                    fontSize='sm'>
                    {t('auth.keepMeLoggedIn')}
                  </FormLabel>
                </FormControl>
                <NavLink to='/auth/forgot-password'>
                  <Text
                    color={textColorBrand}
                    fontSize='sm'
                    w='124px'
                    fontWeight='500'>
                    {t('auth.forgotPassword')}
                  </Text>
                </NavLink>
              </Flex>
              <Button
                type='submit'
                fontSize={{ base: 'xs', md: 'sm' }}
                variant='brand'
                fontWeight='500'
                w='100%'
                h={{ base: '44px', md: '50px' }}
                mb={{ base: '20px', md: '24px' }}
                isLoading={isLoading}
                loadingText={t('auth.signingIn')}
                disabled={isLoading}>
                {t('auth.signIn')}
              </Button>
            </FormControl>
          </form>
          <Flex
            flexDirection='column'
            justifyContent='center'
            alignItems='start'
            maxW='100%'
            mt='0px'>
            <Text color={textColorDetails} fontWeight='400' fontSize='14px'>
              {t('auth.notRegisteredYet')}
              <NavLink to='/auth/sign-up'>
                <Text
                  color={textColorBrand}
                  as='span'
                  ms='5px'
                  fontWeight='500'>
                  {t('auth.createAnAccount')}
                </Text>
              </NavLink>
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </AuthIllustration>
  );
}

export default SignIn;
