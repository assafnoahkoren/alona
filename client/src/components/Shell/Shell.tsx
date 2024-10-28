import React, { useState } from 'react';
import { AppShell, Divider, Group, Stack, Text, Title, useMantineTheme } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import { Squash as Hamburger } from 'hamburger-react'
import { IconArchive, IconCar, IconDeviceFloppy, IconFilePlus, IconHome, IconLuggage, IconPlayerPlay } from '@tabler/icons-react';

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

      <AppShell.Navbar p={0} >
        <div className='flex items-start justify-end p-2'>
          <Hamburger toggled={opened} toggle={setOpen} size={48} />
        </div>
        <Stack gap={0}>
          <NavItem label='מסך בית' icon={<IconHome />} />
          <NavItem isActive label='מעקב פינוי בפועל' icon={<IconPlayerPlay />} />
          <NavItem label='יצירת תוכנית חדשה' icon={<IconFilePlus />} />
          <NavItem label='טיוטות פרסום' icon={<IconDeviceFloppy />} />
          <NavItem label='היסטוריה' icon={<IconArchive />} />
          <Divider className='my-6' />

          <Title order={6} className='px-5'>מסכי שליטה</Title>
          <NavItem label='הערכת חדרי מלון נדרשים לפינוי ' icon={<IconCar />} />
          <NavItem label='בתי מלון ' icon={<IconLuggage />} />
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}

type NavItemProps = {
  label: string,
  icon: React.ReactNode,
  isActive?: boolean
}
const NavItem = (props: NavItemProps) => {
  let itemClassName = 'color-[#687E97] p-[6px] cursor-pointer hover:bg-blue-100 hover:bg-opacity-50';
  let iconClassName = 'color-[#C3CFE7]';
  if (props.isActive) {
    itemClassName = `${itemClassName} bg-blue-100 bg-opacity-50 text-white border-[2px] border-e-solid border-blue-500`;
    iconClassName = `${iconClassName} color-blue-600`;
  }

  return <Group className={itemClassName} gap={8}>
    <div className={`flex-[1] flex items-center justify-end ${iconClassName}`}>
      {props.icon}
    </div>

    <Text className="flex-[5] flex items-center justify-start overflow-hidden text-ellipsis whitespace-nowrap">
      {props.label}
    </Text>
  </Group>
}
