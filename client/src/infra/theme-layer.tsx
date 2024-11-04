import React from 'react';
import { DirectionProvider, MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import { ModalsProvider } from '@mantine/modals';


const theme = createTheme({
  
});

interface ThemeLayerProps {
  children: React.ReactNode;
}

export const ThemeLayer: React.FC<ThemeLayerProps> = ({ children }) => {
  return (
    <DirectionProvider initialDirection='rtl'>
      <MantineProvider theme={theme} >
        <ModalsProvider>
          {children}
        </ModalsProvider>
      </MantineProvider>
    </DirectionProvider>
  );
};
