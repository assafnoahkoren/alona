import { Group, Stack, Title } from "@mantine/core";
import ActionCard from "./ActionCard";

const Home = () => {
  return <>
    <Stack>
      <Title order={3} className='p-4'>מה ברצונך לעשות?</Title>
      <Group wrap="wrap">
        <ActionCard title="מסכי שליטה (9 דשבורדים)" subtitle="עודכן בתאריך 01/01/00" />
        <ActionCard title="צפייה במעקב פינוי בפועל" subtitle="פורסמה בתאריך 01/01/00" />
        <ActionCard title="יצירת תוכנית חדשה" subtitle="פורסמה בתאריך 01/01/00" />
        <ActionCard title="טיוטות תכנון" subtitle="פורסמה בתאריך 01/01/00" />
        <ActionCard title="הסטוריית תוכניות שפורסמו" subtitle="פורסמה בתאריך 01/01/00" />
      </Group>
    </Stack>
  </>;
};

export default Home;
