import { mode } from '@chakra-ui/theme-tools';

export const CardComponent = {
  components: {
    Card: {
      baseStyle: (props) => ({
        p: '22px',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        position: 'relative',
        borderRadius: '20px',
        minWidth: '0px',
        wordWrap: 'break-word',
        bg: mode('#ffffff', 'navy.800')(props),
        backgroundClip: 'border-box',
      }),
      variants: {
        panel: (props) => ({
          bg: mode('white', 'gray.700')(props),
          width: '100%',
          boxShadow: '0px 3.5px 11.5px rgba(0, 0, 0, 0.07)',
          borderRadius: '15px',
        }),
      },
      defaultProps: {
        variant: 'panel',
      },
    },
  },
};