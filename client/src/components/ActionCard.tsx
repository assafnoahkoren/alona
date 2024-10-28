import { Card, Image, Text } from '@mantine/core';
import { IconDots } from '@tabler/icons-react';
import React from 'react';

interface ActionCardProps {
  title: string;
  subtitle: string;
}

const ActionCard: React.FC<ActionCardProps> = ({ title, subtitle }) => {
  return (
    <Card shadow="sm" w={350} h={180} radius="md" className='flex justify-center cursor-pointer hover:shadow-md transition-shadow hover:scale-[1.01] scale-100 transition-transform'>
      <Card.Section p="xl">
        <IconDots size={20} opacity={0.5} className='absolute top-2 left-2'/>  
        <Image src={`/money-illustration.png`} alt={title} w={52} mb={20} />
        <Text fw={500}>{title}</Text>
        <Text>{subtitle}</Text>
      </Card.Section>
    </Card>
  );
};

export default ActionCard;
