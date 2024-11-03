import { useEffect } from 'react';
import { staticDataStore } from '../stores/static-data-store';
import { observer } from 'mobx-react-lite';
import { Stack, Title } from '@mantine/core';
const NewPlan = () => {
  useEffect(() => {
    staticDataStore.fetchData();
  }, []);
  return <Stack>
    <Title order={3}>ישובים לפינוי</Title>

    <Title order={3}>יעדי פינוי</Title>
    
  </Stack>;
};

export default observer(NewPlan);
