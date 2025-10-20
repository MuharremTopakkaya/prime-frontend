// Chakra imports
import { Portal, Box, useDisclosure } from '@chakra-ui/react';
import Footer from '../../components/footer/FooterAdmin';
// Layout components
import Navbar from '../../components/navbar/NavbarAdmin';
import Sidebar from '../../components/sidebar/Sidebar';
import { SidebarContext } from '../../contexts/SidebarContext';
import React, { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import routes from '../../routes';

export default function Dashboard(props: Record<string, unknown>) {
  const { ...rest } = props;
  const [fixed] = useState(false);
  const [toggleSidebar, setToggleSidebar] = useState(false);

  const getRoute = () => {
    return window.location.pathname !== '/admin/full-screen-maps';
  };

  const getActiveRoute = (routesList: any[]): string => {
    let activeRoute = 'Default Brand Text';
    for (let i = 0; i < routesList.length; i++) {
      if (routesList[i].collapse) {
        const collapseActiveRoute = getActiveRoute(routesList[i].items);
        if (collapseActiveRoute !== activeRoute) {
          return collapseActiveRoute;
        }
      } else if (routesList[i].category) {
        const categoryActiveRoute = getActiveRoute(routesList[i].items);
        if (categoryActiveRoute !== activeRoute) {
          return categoryActiveRoute;
        }
      } else {
        if (window.location.href.indexOf(routesList[i].layout + routesList[i].path) !== -1) {
          return routesList[i].name;
        }
      }
    }
    return activeRoute;
  };

  const getActiveNavbar = (routesList: any[]): boolean => {
    let activeNavbar = false;
    for (let i = 0; i < routesList.length; i++) {
      if (routesList[i].collapse) {
        const collapseActiveNavbar = getActiveNavbar(routesList[i].items);
        if (collapseActiveNavbar !== activeNavbar) {
          return collapseActiveNavbar;
        }
      } else if (routesList[i].category) {
        const categoryActiveNavbar = getActiveNavbar(routesList[i].items);
        if (categoryActiveNavbar !== activeNavbar) {
          return categoryActiveNavbar;
        }
      } else {
        if (window.location.href.indexOf(routesList[i].layout + routesList[i].path) !== -1) {
          return routesList[i].secondary;
        }
      }
    }
    return activeNavbar;
  };

  const getActiveNavbarText = (routesList: any[]): boolean => {
    let activeNavbar = false;
    for (let i = 0; i < routesList.length; i++) {
      if (routesList[i].collapse) {
        const collapseActiveNavbar = getActiveNavbarText(routesList[i].items);
        if (collapseActiveNavbar !== activeNavbar) {
          return collapseActiveNavbar;
        }
      } else if (routesList[i].category) {
        const categoryActiveNavbar = getActiveNavbarText(routesList[i].items);
        if (categoryActiveNavbar !== activeNavbar) {
          return categoryActiveNavbar;
        }
      } else {
        if (window.location.href.indexOf(routesList[i].layout + routesList[i].path) !== -1) {
          return routesList[i].messageNavbar;
        }
      }
    }
    return activeNavbar;
  };

  const getRoutes = (routesList: any[]) => {
    return routesList.map((route: any, key: number) => {
      if (route.layout === '/admin') {
        return <Route path={`${route.path}`} element={route.component} key={key} />;
      }
      if (route.collapse) {
        return getRoutes(route.items);
      }
      return null;
    });
  };

  document.documentElement.dir = 'ltr';
  const { onOpen } = useDisclosure();
  document.documentElement.dir = 'ltr';

  return (
    <Box>
      <Box>
        <SidebarContext.Provider value={{ toggleSidebar, setToggleSidebar }}>
          <Sidebar routes={routes as any} {...rest} />
          <Box
            float="right"
            minHeight="100vh"
            height="100%"
            overflow="auto"
            position="relative"
            maxHeight="100%"
            w={{ base: '100%', xl: 'calc( 100% - 290px )' }}
            maxWidth={{ base: '100%', xl: 'calc( 100% - 290px )' }}
            transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
            transitionDuration=".2s, .2s, .35s"
            transitionProperty="top, bottom, width"
            transitionTimingFunction="linear, linear, ease"
          >
            <Portal>
              <Box>
                <Navbar
                  onOpen={onOpen}
                  logoText={'Horizon UI Dashboard PRO'}
                  brandText={getActiveRoute(routes as any)}
                  secondary={getActiveNavbar(routes as any)}
                  message={getActiveNavbarText(routes as any)}
                  fixed={fixed}
                  {...rest}
                />
              </Box>
            </Portal>
            {getRoute() ? (
              <Box mx="auto" p={{ base: '20px', md: '30px' }} pe="20px" minH="100vh" pt="50px">
                <Routes>
                  {getRoutes(routes as any)}
                  <Route path="/" element={<Navigate to="/admin/default" replace />} />
                </Routes>
              </Box>
            ) : null}
            <Box>
              <Footer />
            </Box>
          </Box>
        </SidebarContext.Provider>
      </Box>
    </Box>
  );
}

