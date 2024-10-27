import { Group, Stack, Title } from "@mantine/core";
import ActionCard from "./ActionCard";

const Home = () => {
  return <>
    <Stack>
      <Title order={3} className='p-4'>מה ברצונך לעשות?</Title>
      <Group wrap="wrap">
        <ActionCard title="צפייה במלונות" subtitle="צפייה במלונות והוספת מלון חדש" />
        <ActionCard title="צפייה במלונות" subtitle="צפייה במלונות והוספת מלון חדש" />
        <ActionCard title="צפייה במלונות" subtitle="צפייה במלונות והוספת מלון חדש" />
        <ActionCard title="צפייה במלונות" subtitle="צפייה במלונות והוספת מלון חדש" />
      </Group>
    </Stack>
  </>;
};

export default Home;
