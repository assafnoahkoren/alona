import { useEffect } from 'react';
import { staticDataStore } from '../stores/static-data-store';
import { observer } from 'mobx-react-lite';
import { Card, Group, Stack, Text, Title } from '@mantine/core';

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
    <Stack gap="xl">
      <Stack>
        <Title order={3}>ישובים לפינוי</Title>
        <Group>
          {staticDataStore.settlemenentToEvacuate.map((settlement) => (
            <Card key={settlement.Settlement_id} shadow="sm" padding="lg" radius="md" withBorder>
              <Text fw={500}>{settlement.Name}</Text>
              <Text size="sm" c="dimmed">
                מספר חדרים נדרשים: {settlement.Settlements_To_Evacuate[0]?.rooms_needed || 'לא ידוע'}
              </Text>
            </Card>
          ))}
        </Group>
      </Stack>

      <Stack>
        <Title order={3}>יעדי פינוי</Title>
        <Group>
          {staticDataStore.hotelsWithRooms.map((hotel) => (
            <Card key={hotel.Hotel_ID} shadow="sm" padding="lg" radius="md" withBorder>
              <Text fw={500}>{hotel.hotel_name}</Text>
              <Text size="sm" c="dimmed">
                מספר חדרים זמינים: {hotel.rooms.length}
              </Text>
            </Card>
          ))}
        </Group>
      </Stack>
    </Stack>
  );
};

export default observer(NewPlan);
