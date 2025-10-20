import { mode } from '@chakra-ui/theme-tools';

export const globalStyles = {
  colors: {
    brand: {
      100: '#E9E3FF',
      200: '#422AFB',
      300: '#422AFB',
      400: '#7551FF',
      500: '#422AFB',
      600: '#3311DB',
      700: '#02044A',
      800: '#190793',
      900: '#11047A',
    },
    brandScheme: {
      100: '#E9E3FF',
      200: '#7551FF',
      300: '#7551FF',
      400: '#7551FF',
      500: '#422AFB',
      600: '#3311DB',
      700: '#02044A',
      800: '#190793',
      900: '#11047A',
    },
    brandTabs: {
      100: '#E9E3FF',
      200: '#422AFB',
      300: '#422AFB',
      400: '#422AFB',
      500: '#422AFB',
      600: '#3311DB',
      700: '#02044A',
      800: '#190793',
      900: '#11047A',
    },
    secondaryGray: {
      100: '#E0E5F1',
      200: '#E1E9F8',
      300: '#F4F7FE',
      400: '#E9EDF7',
      500: '#8F9BBA',
      600: '#A3AED0',
      700: '#707EAE',
      800: '#707EAE',
      900: '#1B2559',
    },
    red: {
      100: '#FEEFEE',
      500: '#EE5D50',
      600: '#E53E3E',
    },
    blue: {
      50: '#EFF4FF',
      500: '#3965FF',
    },
    orange: {
      100: '#FFF6DA',
      500: '#FFB547',
    },
    green: {
      100: '#E6FAF5',
      500: '#01B574',
    },
    navy: {
      50: '#D0DCFF',
      100: '#D6DAFF',
      200: '#ADB5FF',
      300: '#8691FF',
      400: '#5F6CFF',
      500: '#3965FF',
      600: '#2D50E6',
      700: '#1E3ACC',
      800: '#1A2BB3',
      900: '#152B99',
    },
    gray: {
      100: '#FAFCFE',
    },
  },
  styles: {
    global: (props) => ({
      body: {
        overflowX: 'hidden',
        bg: mode('white', 'navy.900')(props),
        fontFamily: 'DM Sans',
        letterSpacing: '-0.5px',
      },
      input: {
        color: 'gray.700',
      },
      html: {
        fontFamily: 'DM Sans',
      },
    }),
  },
};