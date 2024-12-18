import { useEffect, useState } from 'react';
import apiService from '../services/apiService.ts';
import { Box, Card, Group, Image, Stack, Table, Title } from '@mantine/core';
import { User } from '../infra/auth-provider.tsx';
import { evacPlanStore } from '../stores/evac-plan-store.tsx';

export const Admin = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const users = await apiService.user.getAll();
        setUsers(users);
      } catch (error) {
        console.error(error);
      }
    };

    getAllUsers();
  }, []);

  const rows = users.map((user) => (
    <Table.Tr key={user.id}>
      <Table.Td>{user.email}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Stack align="center">
      <Card className="flex-row pb-0 gap-6">
        <Group>
          <Image w={56} h={56} src="/building.png" />
          <Title order={3}>ניהול משתמשים</Title>
        </Group>
        <Group>
          <Box
            className={`border-2 border-blue-500 px-2 pb-1 fw-700 cursor-pointer ${evacPlanStore.mode === 'static' ? 'border-b-solid' : ''}`}
            onClick={() => (evacPlanStore.mode = 'static')}
          >
            על פי מאפייני אוכלוסיה
          </Box>
          <Box
            className={`border-2 border-blue-500 px-2 pb-1 fw-700 cursor-pointer ${evacPlanStore.mode === 'dynamic' ? 'border-b-solid' : ''}`}
            onClick={() => (evacPlanStore.mode = 'dynamic')}
          >
            תכנון ע״פ פרמטרים כללים
          </Box>
        </Group>
      </Card>
      <Table miw={700} px={5}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>אימייל</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Stack>
  );
};
