import { useEffect } from 'react';
import { staticDataStore } from '../stores/static-data-store';
import { observer } from 'mobx-react-lite';
import { Button, Card, Group, Stack, Text, Title, Tooltip } from '@mantine/core';
import { IconHome, IconBuilding, IconPlus, IconAccessible, IconUser, IconUsersGroup, IconWheelchair, IconDisabled, IconRun, IconCpu, IconBrain, IconReload } from '@tabler/icons-react';
import { evacPlanStore } from '../stores/evac-plan-store';

const NewPlan = () => {
  useEffect(() => {
    staticDataStore.fetchData();
  }, []);

  if (staticDataStore.isLoading) {
    return <div>Loading...</div>;
  }

  if (staticDataStore.error) {
    return <div>Error: {staticDataStore.error}</div>;
  }

  return (
    <Stack justify='space-between' w='100%'>
      <Stack gap="xl" p='md'>
        <Stack>
          <Group>
            <Title order={3}>ישובים לפינוי</Title>
            <Button variant="subtle" size='sm' leftSection={<IconPlus size={16} />}>הוסף</Button>
          </Group>
          <Group>
            {staticDataStore.settlementsToEvacuate.map((settlement) => (
              <Card key={settlement.Settlement_id} shadow="sm" padding="lg" radius="md" withBorder w={280}>
                <Group wrap='nowrap'>
                  <IconHome size={24} color="#4C6EF5" />
                  <Tooltip label={settlement.Name} multiline>
                    <Text fw={500} className="truncate max-w-[120px]">{settlement.Name}</Text>
                  </Tooltip>
                </Group>
                <Text size="sm" c="dimmed">
                  מספר חדרים נדרשים: {settlement.Settlements_To_Evacuate[0]?.rooms_needed || 'לא ידוע'}
                </Text>
              </Card>
            ))}
          </Group>
        </Stack>

        <Stack>
          <Group>
            <Title order={3}>יעדי פינוי</Title>
            <Button variant="subtle" size='sm' leftSection={<IconPlus size={16} />}>הוסף</Button>
          </Group>
          <Group wrap='wrap'>
            {staticDataStore.hotelsWithRooms.map((hotel) => (
              <Card key={hotel.Hotel_ID} shadow="sm" padding="lg" radius="md" withBorder w={280}>
                <Group wrap='nowrap'>
                  <IconBuilding size={24} color="#4C6EF5" />
                  <Tooltip label={hotel.hotel_name} multiline>
                    <Text fw={500} className="truncate max-w-[200px]">{hotel.hotel_name}</Text>
                  </Tooltip>
                </Group>
                <Text  size="sm" c="dimmed">
                  <u>חדרים זמינים: {hotel.rooms.reduce((acc, room) => acc + room.free_room_count, 0)}</u>
                  {hotel.rooms.map((room) => (
                    <Group key={room.Room_ID} wrap='nowrap' align='center' justify='flex-start' gap={4}>
                      {getRoomTypeIcon(room.Room_type)} {room.Room_type} ({room.free_room_count})
                    </Group>
                  ))}
                </Text>
              </Card>
            ))}
          </Group>
        </Stack>
      </Stack>
      <Group className='bg-blue-200 p-4' justify='center'>
        <Button px={40} variant='white' leftSection={<IconReload size={20}/>} onClick={() => evacPlanStore.createEvacPlan()}>צור תכנית פינוי</Button>
      </Group>
    </Stack>
  );
};

function getRoomTypeIcon(roomType: string | null | undefined) {
  const roomTypeIcons = new Map([
    ['חדרים משפחתיים', <IconUsersGroup size={20} color="#4C6EF5" opacity={0.8} />],
    ['חדרי סינגל', <IconUser size={20} color="#4C6EF5" opacity={0.8} />],
    ['חדרים נגישים', <IconDisabled size={20} color="#4C6EF5" opacity={0.8} />]
  ]);

  if (!roomType) {
    return null;
  }

  return roomTypeIcons.get(roomType) || null;
}


export default observer(NewPlan);
