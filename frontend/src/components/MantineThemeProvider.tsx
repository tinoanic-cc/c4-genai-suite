import { generateColors } from '@mantine/colors-generator';
import { createTheme, MantineProvider } from '@mantine/core';
import { ReactNode } from 'react';
import { useTheme } from 'src/hooks';

type MantineThemeProviderProps = {
  admin?: boolean;
  children: ReactNode;
};

export const MantineThemeProvider = ({ children }: MantineThemeProviderProps) => {
  const {
    theme: { primaryColor: themePrimaryColor },
  } = useTheme();
  const mantineTheme = createTheme({
    primaryColor: 'dark',
    autoContrast: true,
    defaultRadius: 'md',
    colors: { accent: generateColors(themePrimaryColor ?? 'grey') },
  });

  return <MantineProvider theme={mantineTheme}>{children}</MantineProvider>;
};
