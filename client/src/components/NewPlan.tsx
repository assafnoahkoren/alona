import {useEffect, useState} from 'react';
import {staticDataStore} from '../stores/static-data-store';
import {observer} from 'mobx-react-lite';
import {
    Accordion,
    ActionIcon, Box,
    Button,
    Card,
    Group, Image,
    Modal, NumberInput, Select,
    Stack,
    Text,
    Title,
    Tooltip
} from '@mantine/core';
import {
    IconHome,
    IconBuilding,
    IconPlus,
    IconUser,
    IconUsersGroup,
    IconDisabled,
    IconReload,
    IconX, IconPercentage, IconBuildings
} from '@tabler/icons-react';
import {evacPlanStore} from '../stores/evac-plan-store';
import {EnrichedSettlement} from '../../../server/routers/models/settlementRoutes.ts';
import {modals} from '@mantine/modals';
import {useDisclosure} from '@mantine/hooks';
import {useForm} from '@mantine/form';
import settlementToEvacuateService from '../services/settlementToEvacuateService.ts';

const NewPlan = () => {
    const [createSettlementModalOpened, {
        open: openCreateSettlementModal,
        close: closeCreateSettlementModal
    }] = useDisclosure(false);

    useEffect(() => {
        if (!staticDataStore.initialized)
            staticDataStore.fetchData();
    }, []);

    if (staticDataStore.isLoading) {
        return <div>Loading...</div>;
    }

    if (staticDataStore.error) {
        return <div>Error: {staticDataStore.error}</div>;
    }


    const removeSettlement = (settlementId: EnrichedSettlement['Settlement_id']) => {
        modals.openConfirmModal({
            title: 'הסרת יישוב',
            children: (
                <Text size="sm">
                    האם את/ה בטוח/ה שברוצנך להסיר את היישוב?
                </Text>
            ),
            labels: {confirm: 'הסרה', cancel: 'ביטול'},
            onConfirm: async () => {
                await settlementToEvacuateService.delete(settlementId);
                await staticDataStore.fetchData();
            },
        });
    }

    return (
        <Stack justify='space-between' w='100%'>
            <Stack gap="xl" p='md'>
                <Stack>
                    <Card className="flex-col pb-0 gap-6">
                        <Group>
                            <Image w={56} h={56} src="/building.png"/>
                            <Title order={3}>הרצת אלגוריתם שיבוץ למלונות</Title>
                        </Group>
                        <Group>
                            <Box
                                className={`border-2 border-blue-500 px-2 pb-1 fw-700 cursor-pointer ${evacPlanStore.mode === 'static' ? 'border-b-solid' : ''}`}
                                onClick={() => evacPlanStore.mode = 'static'}>
                                אפשרות סטטית
                            </Box>
                            <Box
                                className={`border-2 border-blue-500 px-2 pb-1 fw-700 cursor-pointer ${evacPlanStore.mode === 'dynamic' ? 'border-b-solid' : ''}`}
                                onClick={() => evacPlanStore.mode = 'dynamic'}>
                                אפשרות דינאמית
                            </Box>
                        </Group>
                    </Card>

                    <Accordion variant="separated">
                        <Accordion.Item key={'settlements'} value={'settlements'}>
                            <Accordion.Control disabled={evacPlanStore.mode === 'static'}>
                                <Group>
                                    <IconPercentage size={40}/>
                                    <Stack gap={2}>
                                        <Title order={4}>משתנים דינמים</Title>
                                    </Stack>
                                </Group>
                            </Accordion.Control>
                            <Accordion.Panel>123</Accordion.Panel>
                        </Accordion.Item>
                        <Accordion.Item key={'mode'} value={'mode'}>
                            <Accordion.Control>
                                <Group>
                                    <IconHome size={40}/>
                                    <Stack gap={2}>
                                        <Title order={4} className="flex gap-2 items-end">
                                            ישובים לפינוי
                                            <Text opacity={0.5}>
                                                מס’ חדרים נדרשים
                                            </Text>
                                        </Title>
                                        <Group gap={4}>
                                            <Text>
                                                כל היישובים
                                            </Text>
                                            <Text>
                                                •
                                            </Text>
                                            <Text>
                                                {staticDataStore.allSettlements.length}
                                            </Text>
                                        </Group>
                                    </Stack>
                                </Group>
                            </Accordion.Control>
                            <Accordion.Panel>
                                {Object.entries(staticDataStore.settlementsByEshkol).map(([key, settlements]) => (
                                    <>
                                        <Title order={4}>{settlements[0].Merhav} / {settlements[0].Rishut} / {settlements[0].Eshkol}</Title>
                                        <Group>
                                            {settlements.map((settlement) => (
                                                <Card>
                                                    {settlement.yishuvName}
                                                </Card>
                                            ))}
                                        </Group>
                                    </>
                                ))}
                            </Accordion.Panel>
                        </Accordion.Item>
                        <Accordion.Item key={'hotels'} value={'hotels'}>
                            <Accordion.Control>
                                <Group>
                                    <IconBuildings size={40}/>
                                    <Stack gap={2}>
                                        <Title order={4} className="flex gap-2 items-end">
                                            יעדים להתפנות
                                            <Text opacity={0.5}>
                                                מס’ חדרים זמינים במלון
                                            </Text>
                                        </Title>
                                        <Group gap={4}>
                                            <Text>
                                                כל היעדים
                                            </Text>
                                            <Text>
                                                •
                                            </Text>
                                            <Text>
                                                {staticDataStore.hotelsWithRooms.length}
                                            </Text>
                                        </Group>
                                    </Stack>
                                </Group>
                            </Accordion.Control>
                            <Accordion.Panel>123</Accordion.Panel>
                        </Accordion.Item>
                    </Accordion>

                    <Group>
                        <Title order={3}>ישובים לפינוי</Title>
                        <Button variant="subtle" size='sm' leftSection={<IconPlus size={16}/>}
                                onClick={() => openCreateSettlementModal()}>הוסף</Button>
                        <Modal opened={createSettlementModalOpened} onClose={closeCreateSettlementModal}
                               title="הוספת יישוב">
                            <SelectSettlementToEvacuate onClose={() => closeCreateSettlementModal()}/>
                        </Modal>
                    </Group>
                    <Group>
                        {staticDataStore.allSettlements.map((settlement) => (
                            <Card key={settlement.Settlement_id} shadow="sm" padding="lg" radius="md" withBorder
                                  w={280}>
                                <Group justify="space-between">
                                    <Group wrap='nowrap'>
                                        <IconHome size={24} color="#4C6EF5"/>
                                        <Tooltip label={settlement.Name} multiline>
                                            <Text fw={500} className="truncate max-w-[120px]">{settlement.Name}</Text>
                                        </Tooltip>
                                    </Group>
                                    <ActionIcon variant="outline" color="red" radius="xl" aria-label="delete" size="xs"
                                                onClick={() => removeSettlement(settlement.Settlements_To_Evacuate[0].ID)}>
                                        <IconX/>
                                    </ActionIcon>
                                </Group>
                                <Text size="sm" c="dimmed">
                                    מספר חדרים
                                    נדרשים: {settlement.Settlements_To_Evacuate[0]?.rooms_needed || 'לא ידוע'}
                                </Text>
                            </Card>
                        ))}
                    </Group>
                </Stack>

                <Stack>
                    <Title order={3}>יעדי פינוי</Title>
                    <Group wrap='wrap'>
                        {staticDataStore.hotelsWithRooms.map((hotel) => (
                            <Card key={hotel.Hotel_ID} shadow="sm" padding="lg" radius="md" withBorder w={280}>
                                <Group wrap='nowrap'>
                                    <IconBuilding size={24} color="#4C6EF5"/>
                                    <Tooltip label={hotel.hotel_name} multiline>
                                        <Text fw={500} className="truncate max-w-[200px]">{hotel.hotel_name}</Text>
                                    </Tooltip>
                                </Group>
                                <Text size="sm" c="dimmed">
                                    <u>חדרים
                                        זמינים: {hotel.rooms.reduce((acc, room) => acc + room.free_room_count, 0)}</u>
                                    {hotel.rooms.map((room) => (
                                        <Group key={room.Room_ID} wrap='nowrap' align='center' justify='flex-start'
                                               gap={4}>
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
                <Button px={40} variant='white' leftSection={<IconReload size={20}/>}
                        onClick={() => evacPlanStore.createEvacPlan()}>צור תכנית פינוי</Button>
            </Group>
        </Stack>
    );
};

function getRoomTypeIcon(roomType: string | null | undefined) {
    const roomTypeIcons = new Map([
        ['חדרים משפחתיים', <IconUsersGroup size={20} color="#4C6EF5" opacity={0.8}/>],
        ['חדרי סינגל', <IconUser size={20} color="#4C6EF5" opacity={0.8}/>],
        ['חדרים נגישים', <IconDisabled size={20} color="#4C6EF5" opacity={0.8}/>]
    ]);

    if (!roomType) {
        return null;
    }

    return roomTypeIcons.get(roomType) || null;
}

const SelectSettlementToEvacuate = ({onClose}: { onClose: () => void }) => {
    const [loading, setLoading] = useState(false);
    const form = useForm<{
        settlement: EnrichedSettlement['Settlement_id'] | null,
        numberOfRooms: number | null,
    }>({
        initialValues: {
            settlement: null,
            numberOfRooms: null,
        },

        validate: {
            settlement: (value) => !value ? 'יש לבחור יישוב' : null,
            numberOfRooms: (value) => !value ? 'יש לבחור מספר חדרים' : value <= 0 ? 'יש לבחור מספר חיובי' : null,
        },
    });

    const handleSubmit = (values) => {
        setLoading(true);
        settlementToEvacuateService.create({
            Settlement_ID: values.settlement,
            rooms_needed: values.numberOfRooms,
        }).then(() => {
            onClose();
        }).finally(() => {
            setLoading(false);
            staticDataStore.fetchData();
        });
    };

    return <form onSubmit={form.onSubmit(handleSubmit)}>
        <Select
            label="יישוב"
            placeholder="בחירת יישוב"
            required
            data={staticDataStore.settlementsNotToEvacuate.map((settlement) => ({
                value: settlement.Settlement_id,
                label: settlement.Name
            }))}
            {...form.getInputProps('settlement')}
        />

        <NumberInput
            mt="md"
            required
            placeholder="מספר חדרים"
            label="מספר חדרים"
            {...form.getInputProps('numberOfRooms')}
        />

        <Button type="submit" mt="sm" loading={loading}>
            הוספה
        </Button>
    </form>;
}

export default observer(NewPlan);
