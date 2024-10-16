import { PrismaClient, IDF_hotels, IDF_Settlement, IDF_Rooms } from '@prisma/client';
import fs from 'fs';
import path from 'path';
const prisma = new PrismaClient();
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  const hotels: IDF_hotels[] = [];

  const hotelsData = fs.readFileSync(path.join(__dirname, 'hotels.csv'), 'utf8');
  const rows = hotelsData.split('\n').slice(1); // Assuming the first line is the header
  rows.forEach((row) => {
    const [Hotel_ID, hotel_name, City, ADDRESS] = row.split(',');
    hotels.push({
      Hotel_ID: Hotel_ID?.trim(),
      hotel_name: hotel_name?.trim(),
      City: City?.trim(),
      ADDRESS: ADDRESS?.trim(),
    });
  });
  try {
    await prisma.iDF_hotels.createMany({
      data: hotels,
    });  
  } catch (error) {
    console.log(error);
  }
  


  const sttlementsData = fs.readFileSync(path.join(__dirname, 'sttlements.csv'), 'utf8');
  const sttlementsRows = sttlementsData.split('\n').slice(1); // Assuming the first line is the header
  const sttlements: IDF_Settlement[] = [];
  sttlementsRows.forEach((row) => {
    const [Settlement_id, Name, Settlement_sign] = row.split(',');
    sttlements.push({
      Settlement_id: Settlement_id?.trim(),
      Name: Name?.trim(),
      Settlement_sign: Settlement_sign?.trim(),
    });
  });
  try {
    await prisma.iDF_Settlement.createMany({
      data: sttlements,
    });
  } catch (error) {
    console.log(error);
  }

  const roomsData = fs.readFileSync(path.join(__dirname, 'rooms.csv'), 'utf8');
  const roomsRows = roomsData.split('\n').slice(1); // Assuming the first line is the header
  const rooms: IDF_Rooms[] = [];
  roomsRows.forEach((row) => {
    // Room_ID,Hotel_ID,Room_type,free_room_count

    const [Room_ID, Hotel_ID, Room_type, free_room_count] = row.split(',');
    rooms.push({
      Room_ID: parseInt(Room_ID?.trim()),
      Hotel_ID: Hotel_ID?.trim(),
      Room_type: Room_type?.trim(),
      free_room_count: parseInt(free_room_count?.trim()),
    });
  });
  try {
    await prisma.rooms_SnapShot.createMany({
      data: rooms,
    });
  } catch (error) {
    console.log(error);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
