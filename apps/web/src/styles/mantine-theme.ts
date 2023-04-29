import { MantineThemeOverride } from '@mantine/core';

export const theme: MantineThemeOverride = {
  colorScheme: 'dark',
  fontSizes: {
    xs: '1rem',
    sm: '1rem',
  },
  focusRingStyles: {
    resetStyles: () => ({ outline: 'none' }),
    styles: () => ({ outline: 'none' }),
    inputStyles: () => ({ outline: 'none' }),
  },
};