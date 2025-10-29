import React from 'react';

import { Icon } from '@chakra-ui/react';
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdOutlineShoppingCart,
  MdBusiness,
  MdHandshake,
  MdDescription,
} from 'react-icons/md';

// Admin Imports
import MainDashboard from './views/admin/default';
import NFTMarketplace from './views/admin/marketplace';
import Profile from './views/admin/profile';
import DataTables from './views/admin/dataTables';
import RTL from './views/admin/rtl';
import CompaniesPage from './views/companies/CompaniesPage';
import CompanyDetailPage from './views/companies/CompanyDetailPage';
import PartnersPage from './views/partners/PartnersPage';
import ProfilePage from './views/profile/ProfilePage';
import SupportRequestsPage from './views/customer/SupportRequestsPage';
import EvrakKayitPage from './views/immib/EvrakKayitPage';

// Auth Imports
import SignInCentered from './views/auth/signIn';

const routes = [
  {
    name: 'Main Dashboard',
    layout: '/admin',
    path: '/default',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <MainDashboard />,
    requiredClaims: [], // Dashboard herkes için açık
  },
  {
    name: 'Support Requests',
    layout: '/customer',
    path: '/support-requests',
    icon: <Icon as={MdDescription} width="20px" height="20px" color="inherit" />,
    component: <SupportRequestsPage />,
    requiredClaims: ['SupportRequests.Read', 'FullControl'],
  },
  {
    name: 'Companies',
    layout: '/admin',
    path: '/companies',
    icon: <Icon as={MdBusiness} width="20px" height="20px" color="inherit" />,
    component: <CompaniesPage />,
    requiredClaims: ['Companies.Read', 'Companies.Admin', 'FullControl'],
  },
  {
    name: 'Company Detail',
    layout: '/admin',
    path: '/companies/:id',
    icon: <Icon as={MdBusiness} width="20px" height="20px" color="inherit" />,
    component: <CompanyDetailPage />,
    secondary: true,
    requiredClaims: ['Companies.Read', 'Companies.Admin', 'FullControl'],
  },
  {
    name: 'Partners',
    layout: '/admin',
    path: '/partners',
    icon: <Icon as={MdHandshake} width="20px" height="20px" color="inherit" />,
    component: <PartnersPage />,
    requiredClaims: ['Partners.Read', 'Partners.Admin', 'FullControl'],
  },
  {
    name: 'Document Records',
    layout: '/admin',
    path: '/evrak-kayit',
    icon: <Icon as={MdDescription} width="20px" height="20px" color="inherit" />,
    component: <EvrakKayitPage />,
    requiredClaims: ['FullControl'], // Sadece admin'ler görebilir
  },
  {
    name: 'NFT Marketplace',
    layout: '/admin',
    path: '/nft-marketplace',
    icon: (
      <Icon
        as={MdOutlineShoppingCart}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    component: <NFTMarketplace />,
    secondary: true,
    requiredClaims: ['FullControl'], // Sadece admin'ler görebilir
  },
  {
    name: 'Data Tables',
    layout: '/admin',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    path: '/data-tables',
    component: <DataTables />,
    requiredClaims: ['FullControl'], // Sadece admin'ler görebilir
  },
  {
    name: 'Profile',
    layout: '/admin',
    path: '/profile',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: <ProfilePage />,
    requiredClaims: [], // Herkes kendi profilini görebilir
  },
  {
    name: 'Sign In',
    layout: '/auth',
    path: '/sign-in',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <SignInCentered />,
    requiredClaims: [], // Auth sayfası için claim gerekmez
  },
  {
    name: 'RTL Admin',
    layout: '/rtl',
    path: '/rtl-default',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <RTL />,
    requiredClaims: ['FullControl'], // Sadece admin'ler görebilir
  },
];

export default routes;
