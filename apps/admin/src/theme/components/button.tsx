import { mode } from '@chakra-ui/theme-tools';

export const buttonStyles = {
  components: {
    Button: {
      baseStyle: {
        borderRadius: '16px',
        fontWeight: '500',
        _focus: {
          boxShadow: 'none',
        },
      },
      variants: {
        outline: () => ({
          borderRadius: '16px',
        }),
        brand: (props) => ({
          bg: mode('brand.500', 'brand.400')(props),
          color: 'white',
          _focus: {
            boxShadow: 'none',
          },
          _active: {
            bg: mode('brand.700', 'brand.400')(props),
          },
          _hover: {
            bg: mode('brand.600', 'brand.400')(props),
            _disabled: {
              bg: mode('brand.400', 'brand.400')(props),
            },
          },
        }),
      },
    },
  },
};