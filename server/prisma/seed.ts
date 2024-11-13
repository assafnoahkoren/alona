import { PrismaClient, IDF_hotels, IDF_Settlement, IDF_Rooms, TBL_evacuation_data } from '@prisma/client';
import fs from 'fs';
import path from 'path';
const prisma = new PrismaClient();
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  // const hotels: IDF_hotels[] = [];

  // const hotelsData = fs.readFileSync(path.join(__dirname, 'hotels.csv'), 'utf8');
  // const rows = hotelsData.split('\n').slice(1); // Assuming the first line is the header
  // rows.forEach((row) => {
  //   const [Hotel_ID, hotel_name, City, ADDRESS] = row.split(',');
  //   hotels.push({
  //     Hotel_ID: Hotel_ID?.trim(),
  //     hotel_name: hotel_name?.trim(),
  //     City: City?.trim(),
  //     ADDRESS: ADDRESS?.trim(),
  //   });
  // });
  // try {
  //   await prisma.iDF_hotels.createMany({
  //     data: hotels,
  //   });  
  // } catch (error) {
  //   console.log(error);
  // }
  


  // const sttlementsData = fs.readFileSync(path.join(__dirname, 'sttlements.csv'), 'utf8');
  // const sttlementsRows = sttlementsData.split('\n').slice(1); // Assuming the first line is the header
  // const sttlements: IDF_Settlement[] = [];
  // sttlementsRows.forEach((row) => {
  //   const [Settlement_id, Name, Settlement_sign] = row.split(',');
  //   sttlements.push({
  //     Settlement_id: Settlement_id?.trim(),
  //     Name: Name?.trim(),
  //     Settlement_sign: Settlement_sign?.trim(),
  //   });
  // });
  // try {
  //   await prisma.iDF_Settlement.createMany({
  //     data: sttlements,
  //   });
  // } catch (error) {
  //   console.log(error);
  // }


  // const roomsData = fs.readFileSync(path.join(__dirname, 'rooms.csv'), 'utf8');
  // const roomsRows = roomsData.split('\n').slice(1); // Assuming the first line is the header
  // const rooms: IDF_Rooms[] = [];
  // roomsRows.forEach((row) => {
  //   // Room_ID,Hotel_ID,Room_type,free_room_count

  //   const [Room_ID, Hotel_ID, Room_type, free_room_count] = row.split(',');
  //   rooms.push({
  //     Hotel_ID: Hotel_ID?.trim(),
  //     Room_type: Room_type?.trim(),
  //     free_room_count: parseInt(free_room_count?.trim()),
  //   });
  // });
  // try {
  //   await prisma.iDF_Rooms.createMany({
  //     data: rooms,
  //   });
  // } catch (error) {
  //   console.log(error);
  // }

  const evacuationData = fs.readFileSync(path.join(__dirname, 'evacuation_data.csv'), 'utf8');
  const evacuationRows = evacuationData.split('\n').slice(1); // Assuming the first line is the header

  const evacuations: TBL_evacuation_data[] = [];
  evacuationRows.forEach((row) => {
    // Room_ID,Hotel_ID,Room_type,free_room_count

    const [Merhav, Eshkol, Rishut, Yishuv_Code, Yishuv_Number, Yishuv_Name, Religion, Population_Regular_21_7, Self_Evacuated, Population_Remaining_Estimate_16_7, Departure_Ratio_Regular, Independent_Evacuees_Current_Population, Evacuation_By_Buses, Will_Not_Evacuate, Age_0_2, Age_2_12, Age_0_12, Age_12_18, Age_0_2_Remaining, Age_2_12_Remaining, Age_0_12_Remaining, Age_12_18_Remaining, Bus_Count, Families_With_Children_Count, Families_With_Children_Evacuated_Count, Rooms_Required_For_Families_With_Children_Evacuated, Residents_Without_Family_Evacuated_Count, Rooms_For_Residents_Without_Minor_Children, Total_Rooms_Required_All_Evacuees, Total_Rooms_Required_For_Bus_Evacuees, Total_Rooms_Required_For_Independent_Evacuees_After_Order, Total_Rooms_Required_All_Evacuees_After_Order, Total_Estimated_Rooms_For_Residents_Outside_Yishuv_July_24, Total_Estimated_Rooms_For_Eligible_Residents_Excluding_Remaining] = row.split(',');
    const parseDataToInt = (value: string) => {
      return Number.parseInt(value?.trim());
    };
    if (isNaN(parseDataToInt(Yishuv_Number?.trim()))) {
      return;
    }
    if (isNaN(parseDataToInt(Population_Regular_21_7?.trim()))) {
      return;
    }
    evacuations.push({
       Merhav: Merhav?.trim(),
       Eshkol: Eshkol?.trim(),
       Rishut: Rishut?.trim(),
       Yishuv_Code: parseDataToInt(Yishuv_Code?.trim()),
       Yishuv_Number: parseDataToInt(Yishuv_Number?.trim()),
       Yishuv_Name: Yishuv_Name?.trim(),
       Religion: Religion?.trim(),
       Population_Regular_21_7: parseDataToInt(Population_Regular_21_7?.trim()),
       Self_Evacuated: parseDataToInt(Self_Evacuated?.trim()),
       Population_Remaining_Estimate_16_7: parseDataToInt(Population_Remaining_Estimate_16_7?.trim()),
       Departure_Ratio_Regular: parseFloat(Departure_Ratio_Regular?.trim()),
       Independent_Evacuees_Current_Population: parseDataToInt(Independent_Evacuees_Current_Population?.trim()),
       Evacuation_By_Buses: parseDataToInt(Evacuation_By_Buses?.trim()),
       Will_Not_Evacuate: parseDataToInt(Will_Not_Evacuate?.trim()),
       Age_0_2: parseDataToInt(Age_0_2?.trim()),
       Age_2_12: parseDataToInt(Age_2_12?.trim()),
       Age_0_12: parseDataToInt(Age_0_12?.trim()),
       Age_12_18: parseDataToInt(Age_12_18?.trim()),
       Age_0_2_Remaining: parseDataToInt(Age_0_2_Remaining?.trim()),
       Age_2_12_Remaining: parseDataToInt(Age_2_12_Remaining?.trim()),
       Age_0_12_Remaining: parseDataToInt(Age_0_12_Remaining?.trim()),
       Age_12_18_Remaining: parseDataToInt(Age_12_18_Remaining?.trim()),
       Bus_Count: parseDataToInt(Bus_Count?.trim()),
       Families_With_Children_Count: parseDataToInt(Families_With_Children_Count?.trim()),
       Families_With_Children_Evacuated_Count: parseDataToInt(Families_With_Children_Evacuated_Count?.trim()),
       Rooms_Required_For_Families_With_Children_Evacuated: parseDataToInt(Rooms_Required_For_Families_With_Children_Evacuated?.trim()),
       Residents_Without_Family_Evacuated_Count: parseDataToInt(Residents_Without_Family_Evacuated_Count?.trim()),
       Rooms_For_Residents_Without_Minor_Children: parseDataToInt(Rooms_For_Residents_Without_Minor_Children?.trim()),
       Total_Rooms_Required_All_Evacuees: parseDataToInt(Total_Rooms_Required_All_Evacuees?.trim()),
       Total_Rooms_Required_For_Bus_Evacuees: parseDataToInt(Total_Rooms_Required_For_Bus_Evacuees?.trim()),
       Total_Rooms_Required_For_Independent_Evacuees_After_Order: parseDataToInt(Total_Rooms_Required_For_Independent_Evacuees_After_Order?.trim()),
       Total_Estimated_Rooms_For_Residents_Outside_Yishuv_July_24: parseDataToInt(Total_Estimated_Rooms_For_Residents_Outside_Yishuv_July_24?.trim()),
       Total_Estimated_Rooms_For_Eligible_Residents_Excluding_Remaining: parseDataToInt(Total_Estimated_Rooms_For_Eligible_Residents_Excluding_Remaining?.trim()),
       Total_Rooms_Required_All_Evacuees_After_Order: parseDataToInt(Total_Rooms_Required_All_Evacuees_After_Order?.trim()),
       
    });
  });
  try {
    await prisma.tBL_evacuation_data.createMany({
      data: evacuations,
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

