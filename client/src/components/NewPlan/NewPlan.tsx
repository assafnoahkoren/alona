import { useEffect, useState } from 'react';
import { staticDataStore } from '../../stores/static-data-store.ts';
import { observer } from 'mobx-react-lite';
import MapComponent from '../MapComponent.tsx';
import {
    Accordion,
    ActionIcon, Box,
    Button,
    Card,
    Chip,
    Divider,
    Group, Image,
    Modal, NumberInput, Pill, Select,
    Slider,
    Space,
    Stack,
    Switch,
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
    IconX, IconPercentage, IconBuildings,
    IconSend,
    IconUsers,
    IconExclamationCircle,
    IconCheck
} from '@tabler/icons-react';
import { evacPlanStore } from '../../stores/evac-plan-store.ts';
import { EnrichedSettlement } from '../../../../server/routers/models/settlementRoutes.ts';
import { modals } from '@mantine/modals';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import settlementToEvacuateService from '../../services/settlementToEvacuateService.ts';
import SettlementSwitch from './SettlementSwitch.tsx';

const NewPlan = () => {

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
            labels: { confirm: 'הסרה', cancel: 'ביטול' },
            onConfirm: async () => {
                await settlementToEvacuateService.delete(settlementId);
                await staticDataStore.fetchData();
            },
        });
    }

    return (
        <Stack justify='space-between' w='100%' gap='0'>
            <Group h='100%' align='flex-start'>
                <Stack flex={1} gap="xl" p='md'>
                    <Stack className='overflow-y-auto'>
                        <Card className="flex-col pb-0 gap-6">
                            <Group>
                                <Image w={56} h={56} src="/building.png" />
                                <Title order={3}>הרצת אלגוריתם שיבוץ למלונות</Title>
                            </Group>
                            <Group>
                                <Box
                                    className={`border-2 border-blue-500 px-2 pb-1 fw-700 cursor-pointer ${evacPlanStore.mode === 'static' ? 'border-b-solid' : ''}`}
                                    onClick={() => evacPlanStore.mode = 'static'}>
                                    אפשרות סטטיסטית
                                </Box>
                                <Box
                                    className={`border-2 border-blue-500 px-2 pb-1 fw-700 cursor-pointer ${evacPlanStore.mode === 'dynamic' ? 'border-b-solid' : ''}`}
                                    onClick={() => evacPlanStore.mode = 'dynamic'}>
                                    אפשרות פרמטרית
                                </Box>
                            </Group>
                        </Card>

                        <Accordion variant="separated">
                            <Accordion.Item key={'settlements'} value={'settlements'}>
                                <Accordion.Control disabled={evacPlanStore.mode === 'static'}>
                                    <Group>
                                        <IconPercentage size={40} />
                                        <Stack gap={2}>
                                            <Title order={4}>משתנים דינמים</Title>
                                        </Stack>
                                    </Group>
                                </Accordion.Control>
                                <Accordion.Panel>
                                    <Group className='w-full'>
                                        <Stack gap={4}>
                                            <Group justify='space-between'>
                                                <Text>אחוז דורשי מלון</Text>
                                                <Text fw='bold'>
                                                    {evacPlanStore.requiredRoomsPopulationPercentage}%
                                                </Text>
                                            </Group>

                                            <Slider className='w-[300px] mb-4'
                                                onChangeEnd={(value) => evacPlanStore.requiredRoomsPopulationPercentage = value}
                                                defaultValue={evacPlanStore.requiredRoomsPopulationPercentage}
                                                color="blue"
                                                size="xl"
                                                marks={[
                                                    { value: 20, label: '20%' },
                                                    { value: 50, label: '50%' },
                                                    { value: 80, label: '80%' },
                                                ]}
                                            />
                                        </Stack>
                                        <Space h={16} />
                                        <Stack gap={4}>
                                            <Group justify='space-between'>
                                                <Text>כמות נפשות לחדר</Text>
                                                <Text fw='bold'>
                                                    {evacPlanStore.fitInRoom}
                                                </Text>
                                            </Group>
                                            <Slider className='w-[300px] mb-4'
                                                onChangeEnd={(value) => evacPlanStore.fitInRoom = value}
                                                defaultValue={evacPlanStore.fitInRoom}
                                                color="blue"
                                                size="xl"
                                                min={0}
                                                max={10}
                                                step={0.5}
                                                marks={[
                                                    { value: 2, label: '2' },
                                                    { value: 5, label: '5' },
                                                    { value: 8, label: '8' },
                                                ]}
                                            />
                                        </Stack>

                                    </Group>
                                </Accordion.Panel>
                            </Accordion.Item>
                            <Accordion.Item key={'mode'} value={'mode'}>
                                <Accordion.Control>
                                    <Group>
                                        <IconHome size={40} />
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
                                                    {staticDataStore.evacuationData.length}
                                                </Text>
                                                <Space w={16} />
                                                <Text>
                                                    מיועדים לפינוי
                                                </Text>
                                                <Text>
                                                    •
                                                </Text>
                                                <Text>
                                                    {evacPlanStore.getAllSettlementData().filter(data => data.markedForEvac).length}
                                                </Text>
                                            </Group>
                                        </Stack>
                                    </Group>
                                </Accordion.Control>
                                <Accordion.Panel className='bg-[#00000005] rounded-md'>
                                    <Group className='py-4'>
                                        <Text>פעולות</Text>
                                        <Button onClick={() => evacPlanStore.toggleAllSelection()}>
                                            {evacPlanStore.isAnySettlementSelected() ? 'בטל הכל' : 'בחר הכל'}
                                        </Button>
                                        {staticDataStore.getMerhavim().map(merhav => (
                                            <Button onClick={() => evacPlanStore.toggleMerhavSelection(merhav)}
                                                variant={evacPlanStore.isMerhavSelected(merhav) ? 'filled' : 'outline'}>
                                                {evacPlanStore.isMerhavSelected(merhav) ? 'בטל' : 'בחר'} {merhav}
                                            </Button>
                                        ))}

                                    </Group>
                                    <Stack className='max-h-[250px] overflow-y-auto'>
                                        {Object.entries(staticDataStore.settlementsByEshkol).map(([key, settlements]) => (
                                            <>
                                                <Group gap={6}>
                                                    <Title order={4}>{settlements[0].Merhav} / {settlements[0].Rishut} / {settlements[0].Eshkol}</Title>
                                                    <Button size='xs' px={10} variant='subtle'
                                                        onClick={() => evacPlanStore.toggleSettlementSelection(settlements)}>
                                                        {evacPlanStore.isAnyOfSettlementSelected(settlements) ? 'בטל הכל' : 'בחר הכל'}
                                                    </Button>
                                                </Group>
                                                <Group gap={40}>
                                                    {settlements.map((settlement) => (
                                                        <SettlementSwitch settlement={settlement} />
                                                    ))}
                                                </Group>
                                            </>
                                        ))}

                                    </Stack>
                                </Accordion.Panel>
                            </Accordion.Item>
                            <Accordion.Item key={'hotels'} value={'hotels'}>
                                <Accordion.Control>
                                    <Group>
                                        <IconBuildings size={40} />
                                        <Stack gap={2}>
                                            <Title order={4} className="flex gap-2 items-end">
                                                יעדי קליטה
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
                                <Accordion.Panel className='bg-[#00000005] rounded-md'>
                                    <Group className='py-4'>
                                        <Text>פעולות</Text>
                                        <Button onClick={() => evacPlanStore.toggleHotels(staticDataStore.hotelsWithRooms)}>
                                            {evacPlanStore.isAnyHotelOfHotelsSelected(staticDataStore.hotelsWithRooms) ? 'בטל הכל' : 'בחר הכל'}
                                        </Button>
                                    </Group>
                                    <Stack className='max-h-[250px] overflow-y-auto'>
                                        {sortEntriesByCity(Object.entries(staticDataStore.hotelsWithRoomsMapByCity)).map(([city, hotels]) => (
                                            <Stack>
                                                <Group gap={6}>
                                                    <Title order={5}>
                                                        {city}
                                                    </Title>
                                                    <Button size='xs' px={10} variant='subtle'
                                                        onClick={() => evacPlanStore.toggleHotels(hotels)}>
                                                        {evacPlanStore.isAnyHotelOfHotelsSelected(hotels) ? 'בטל עיר' : 'בחר עיר'}
                                                    </Button>
                                                </Group>
                                                <Group wrap='wrap'>
                                                    {hotels.map((hotel) => (
                                                        <Card key={hotel.Hotel_ID} padding="lg" radius="md" withBorder w={280} className='overflow-visible cursor-pointer'
                                                            onClick={() => evacPlanStore.toggle_markedForAcceptance(hotel.Hotel_ID)}>
                                                            <Group wrap='nowrap'>
                                                                <Tooltip label={hotel.hotel_name + ' (' + hotel.rooms.reduce((acc, room) => acc + room.free_room_count, 0) + ')'} multiline>
                                                                    <Text fw={500} className="truncate max-w-[200px]">{hotel.hotel_name} ({hotel.rooms.reduce((acc, room) => acc + room.free_room_count, 0)})</Text>
                                                                </Tooltip>
                                                            </Group>
                                                            <Space h={4} />
                                                            <Group key={hotel.Hotel_ID + '-rooms'} wrap='nowrap' align='center' justify='flex-start'>
                                                                {hotel.rooms.map((room) => (
                                                                    room.free_room_count ? <Tooltip label={room.Room_type}>
                                                                        <Group align='center' justify='center' gap={4}>
                                                                            {getRoomTypeIcon(room.Room_type)} {room.free_room_count}
                                                                        </Group>
                                                                    </Tooltip> : null
                                                                ))}
                                                            </Group>
                                                            <Group justify='center' className='absolute left-0 top-0 w-full '>
                                                                <Switch className='relative -translate-y-1/2'
                                                                    checked={evacPlanStore.getHotelData(hotel.Hotel_ID).markedForAcceptance}
                                                                    onChange={(event) => evacPlanStore.set_markedForAcceptance(hotel.Hotel_ID, event.currentTarget.checked)}
                                                                />
                                                            </Group>
                                                        </Card>
                                                    ))}
                                                </Group>

                                                <Divider />
                                            </Stack>
                                        ))}
                                    </Stack>
                                </Accordion.Panel>
                            </Accordion.Item>
                        </Accordion>
                    </Stack>
                </Stack>
                {/* <Stack w={400} h='100%' p='0'>
                    <MapComponent />
                </Stack> */}
            </Group>
            <Group className='bg-white p-4' justify='space-between'>
                <Group align='center'>
                    <Title order={5}>
                        חדרים זמינים: {evacPlanStore.getTotalAvailableRooms().toLocaleString()}
                    </Title>
                    <Title order={5}>
                        חדרים נדרשים: {evacPlanStore.getTotalRequiredRooms().toLocaleString()}
                    </Title>
                    <Chip
                        className='flex'
                        icon={evacPlanStore.roomsDifferenceIsNegative() ? <IconExclamationCircle /> : <IconCheck />}
                        classNames={{
                            iconWrapper: 'overflow-visible',
                        }}
                        color={evacPlanStore.roomsDifferenceIsNegative() ? 'red' : 'green'}
                        variant="light"
                        checked
                    >
                        <span className='mx-2'>
                            {evacPlanStore.roomsDifferenceIsNegative() ? (
                                `חדרים חסרים: ${Math.abs(evacPlanStore.getRoomsDifference()).toLocaleString()}`
                            ): (
                                `חדרים פנויים: ${evacPlanStore.getRoomsDifference().toLocaleString()}`
                            )}
                        </span>
                    </Chip>
                </Group>
                <Button px={40} variant='filled' leftSection={<IconSend size={20} />}
                    onClick={() => evacPlanStore.createEvacPlan()}>שליחה</Button>

            </Group>
        </Stack>
    );
};

function getRoomTypeIcon(roomType: string | null | undefined) {
    const roomTypeIcons = new Map([
        ['חדרים משפחתיים', <IconUsersGroup size={20} color="#4C6EF5" opacity={0.8} />],
        ['חדרי סינגל', <IconUser size={20} color="#4C6EF5" opacity={0.8} />],
        ['חדרים נגישים', <IconDisabled size={20} color="#4C6EF5" opacity={0.8} />],
        ['חדרים זוגיים', <IconUsers size={20} color="#4C6EF5" opacity={0.8} />],
    ]);

    if (!roomType) {
        return null;
    }

    return roomTypeIcons.get(roomType) || null;
}

const SelectSettlementToEvacuate = ({ onClose }: { onClose: () => void }) => {
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

function sortEntriesByCity(entries: [string, any][]) {
    return entries.sort((a, b) => a[0].localeCompare(b[0]));
}
