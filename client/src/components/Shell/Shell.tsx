import React, { useState } from 'react';
import { AppShell, Burger, Title, useMantineTheme } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import { Squash as Hamburger } from 'hamburger-react'

export function Shell() {
  const theme = useMantineTheme();
  const [opened, setOpen] = useState(false)

  return (
    <AppShell
      className='bg-[#F5F5F5]'
      withBorder={false} 
      header={{ height: 60 }}
      navbar={{
        width: 200,
        breakpoint: 'none',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header className='flex items-center justify-center color-white' style={{ background: 'linear-gradient(to right, rgba(2,95,219,1) 0%, rgba(2,95,219,1) 35%, rgba(11,54,104,1) 100%)' }}>
        <Title order={5}>מערכת שיבוץ מלונות</Title>
      </AppShell.Header>

      <AppShell.Navbar p="md" >
        <div className='flex items-start justify-end'>
          <Hamburger toggled={opened} toggle={setOpen} size={48} />

        </div>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
