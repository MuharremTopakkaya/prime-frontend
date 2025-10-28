/* eslint-disable */
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
// chakra imports
import { Box, Flex, HStack, Text, useColorModeValue } from "@chakra-ui/react";
import { useClaimCheck } from '../../../hooks/useClaimCheck';

export function SidebarLinks(props) {
  const { t } = useTranslation();
  const { hasAnyClaim } = useClaimCheck();
  //   Chakra color mode
  let location = useLocation();
  let activeColor = useColorModeValue("gray.700", "white");
  let inactiveColor = useColorModeValue(
    "secondaryGray.600",
    "secondaryGray.600"
  );
  let activeIcon = useColorModeValue("brand.500", "white");
  let textColor = useColorModeValue("secondaryGray.500", "white");
  let brandColor = useColorModeValue("brand.500", "brand.400");

  const { routes, onClose } = props;

  // Route name translation mapping
  const getTranslatedRouteName = (routeName) => {
    const translationMap = {
      'Main Dashboard': t('navigation.dashboard'),
      'Companies': t('navigation.companies'),
      'Company Detail': t('navigation.companyDetail'),
      'Partners': t('navigation.partners'),
      'NFT Marketplace': t('navigation.nftMarketplace'),
      'Data Tables': t('navigation.dataTables'),
      'Profile': t('navigation.profile'),
      'Sign In': t('navigation.signIn'),
      'RTL Admin': t('navigation.rtlAdmin')
    };
    return translationMap[routeName] || routeName;
  };

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return location.pathname.includes(routeName);
  };

  // this function creates the links from the secondary accordions (for example auth -> sign-in -> default)
  const createLinks = (routes) => {
    return routes.map((route, index) => {
      // Check if user has required claims for this route
      const hasRequiredClaims = route.requiredClaims ? 
        route.requiredClaims.length === 0 || hasAnyClaim(route.requiredClaims) : 
        true;

      // Skip route if user doesn't have required claims
      if (!hasRequiredClaims) {
        return null;
      }

      if (route.category) {
        return (
          <>
            <Text
              fontSize={"md"}
              color={activeColor}
              fontWeight='bold'
              mx='auto'
              ps={{
                sm: "10px",
                xl: "16px",
              }}
              pt='18px'
              pb='12px'
              key={index}>
              {getTranslatedRouteName(route.name)}
            </Text>
            {createLinks(route.items)}
          </>
        );
      } else if (
        route.layout === "/admin" ||
        route.layout === "/auth" ||
        route.layout === "/rtl"
      ) {
        // Skip secondary routes (like Company Detail) from sidebar
        if (route.secondary) {
          return null;
        }
        
        return (
          <NavLink key={index} to={route.layout + route.path} onClick={onClose}>
            {route.icon ? (
              <Box>
                <HStack
                  spacing={
                    activeRoute(route.path.toLowerCase()) ? "22px" : "26px"
                  }
                  py='5px'
                  ps='10px'>
                  <Flex w='100%' alignItems='center' justifyContent='center'>
                    <Box
                      color={
                        activeRoute(route.path.toLowerCase())
                          ? activeIcon
                          : textColor
                      }
                      me='18px'>
                      {route.icon}
                    </Box>
                    <Text
                      me='auto'
                      color={
                        activeRoute(route.path.toLowerCase())
                          ? activeColor
                          : textColor
                      }
                      fontWeight={
                        activeRoute(route.path.toLowerCase())
                          ? "bold"
                          : "normal"
                      }>
                      {getTranslatedRouteName(route.name)}
                    </Text>
                  </Flex>
                  <Box
                    h='36px'
                    w='4px'
                    bg={
                      activeRoute(route.path.toLowerCase())
                        ? brandColor
                        : "transparent"
                    }
                    borderRadius='5px'
                  />
                </HStack>
              </Box>
            ) : (
              <Box>
                <HStack
                  spacing={
                    activeRoute(route.path.toLowerCase()) ? "22px" : "26px"
                  }
                  py='5px'
                  ps='10px'>
                  <Text
                    me='auto'
                    color={
                      activeRoute(route.path.toLowerCase())
                        ? activeColor
                        : inactiveColor
                    }
                    fontWeight={
                      activeRoute(route.path.toLowerCase()) ? "bold" : "normal"
                    }>
                    {getTranslatedRouteName(route.name)}
                  </Text>
                  <Box h='36px' w='4px' bg='brand.400' borderRadius='5px' />
                </HStack>
              </Box>
            )}
          </NavLink>
        );
      }
    });
  };
  //  BRAND
  return createLinks(routes);
}

export default SidebarLinks;
