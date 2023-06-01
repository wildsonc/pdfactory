import { MantineTheme } from '@mantine/core';
import { getSize, rem } from '@mantine/styles';


export default function tableStyles(theme: MantineTheme) {
    const border = `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`;
    const withColumnBorders = true;
    const withBorder = true;
    const fontSize = 'sm';

    const style = {
      '& table': {
        ...theme.fn.fontStyles(),
        width: '100%',
        // borderCollapse: 'collapse',
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
        border: withBorder ? border : undefined,
        borderRadius: theme.radius.sm,

        '& thead tr th, & tfoot tr th, & tbody tr th': {
          textAlign: 'left',
          fontWeight: 'bold',
          color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
          fontSize: getSize({ size: fontSize, sizes: theme.fontSizes }),
        },
        
        '& thead tr th': {
          borderBottom: border,
        },

        '& tfoot tr th, & tbody tr th': {
          borderTop: border,
        },

        '& tbody tr td': {
          borderTop: border,
          fontSize: getSize({ size: fontSize, sizes: theme.fontSizes }),
        },

        '& tbody tr:first-of-type td, & tbody tr:first-of-type th': {
          borderTop: 'none',
        },

        '& thead th, & tbody td': {
          borderRight: withColumnBorders ? border : 'none',

          '&:last-of-type': {
            borderRight: 'none',
            borderLeft: withColumnBorders ? border : 'none',
          },
        },
        
        'th, td': {
          position: 'relative',
        },

        'p': {
          margin: 0
        },

        '& tbody tr th': {
          borderRight: withColumnBorders ? border : 'none',
        },

        '& .selectedCell:after': {
          background: 'rgba(200, 200, 255, 0.4)',
          content: "''",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          pointerEvents: 'none',
          position: 'absolute',
          zIndex: 2,
        }
      },
    }
    return style
  }