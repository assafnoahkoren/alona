import React from 'react';
import { MantineProvider, createTheme } from '@mantine/core';

const theme = createTheme({
  // You can customize your theme here
});

interface ThemeLayerProps {
  children: React.ReactNode;
}

export const ThemeLayer: React.FC<ThemeLayerProps> = ({ children }) => {
  return (
    <MantineProvider theme={theme}>
      {children}
    </MantineProvider>
  );
};
