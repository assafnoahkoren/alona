import { Algorithm_Run, IDF_Rooms } from "@prisma/client";
import { EnrichedHotel } from "../routers/models/hotelRoutes";
import { EnrichedSettlement } from "../routers/models/settlementRoutes";
import prisma from "../db";

export interface AlgorithmInput {
  hotels: EnrichedHotel[];
  settlements: EnrichedSettlement[];
  personsInRooms: number;
  algorithmRun: Algorithm_Run;
}

type HotelID_RoomType_Key = `${string}-${string}`;
type SettlementID = string;
type RoomsByHotel = Record<HotelID_RoomType_Key, IDF_Rooms[]>;
export interface AlgorithmOutput {
  allocations: Record<SettlementID, RoomsByHotel>;
  unallocated: RoomsByHotel;
  duration: number;
}

const algorithmService = {
  runAllocation: async (input: AlgorithmInput): Promise<AlgorithmOutput> => {
    const startTime = Date.now();
    
    // Get initial available rooms
    const availableRooms = getRooms(input.hotels);
    let availableRoomsByHotel = groupRoomsByHotel(availableRooms);
    
    // Get settlements' needed rooms
    const neededRooms = input.settlements.map((settlement) => ({
      settlementID: settlement.Settlement_id,
      rooms: parseInt(settlement.Settlements_To_Evacuate[0].rooms_needed || "0"),
    }));

    const allocations: Record<SettlementID, RoomsByHotel> = {};

    // Allocate rooms for each settlement
    for (const { settlementID, rooms: neededRoomCount } of neededRooms) {
      allocations[settlementID] = {};
      let remainingNeeded = neededRoomCount;

      // Try to allocate from each available hotel-room combination
      Object.entries(availableRoomsByHotel).forEach(([hotelRoomKey, rooms]) => {
        if (remainingNeeded <= 0) return;

        rooms.forEach(room => {
          if (remainingNeeded <= 0 || room.free_room_count <= 0) return;

          // Calculate rooms to allocate
          const roomsToAllocate = Math.min(room.free_room_count, remainingNeeded);

          // Create allocation
          if (!allocations[settlementID][hotelRoomKey]) {
            allocations[settlementID][hotelRoomKey] = [];
          }

          // Add allocated rooms
          allocations[settlementID][hotelRoomKey].push({
            ...room,
            free_room_count: roomsToAllocate
          });

          // Update remaining counts
          room.free_room_count -= roomsToAllocate;
          remainingNeeded -= roomsToAllocate;
        });
      });
    }
    
    Object.keys(allocations).forEach((settlementID: SettlementID) => {
      Object.keys(allocations[settlementID]).forEach((hotelRoomIdTypeKey: any) => {
        allocations[settlementID][hotelRoomIdTypeKey].forEach(async (room: IDF_Rooms) => {
          await prisma.allocations.create({
            data: {

              Hotel_ID: room.Hotel_ID,
              Settelment_ID: settlementID,
              Rooms: room.free_room_count.toString(),
              run_id: input.algorithmRun.ID,
            }
          })
        });
      });
    });

    return {
      allocations,
      unallocated: availableRoomsByHotel,
      duration: Date.now() - startTime
    };
  },
};

const getRooms = (hotels: EnrichedHotel[]) => {
  const rooms = hotels.flatMap((hotel) => hotel.rooms);
  const groupedRooms: Record<string, IDF_Rooms> = {};

  rooms.forEach((room) => {
    if (!room.Room_type) return;
    const key = `${room.Hotel_ID}-${room.Room_type}`;
    if (!groupedRooms[key]) {
      groupedRooms[key] = room;
    } else {
      groupedRooms[key].free_room_count += room.free_room_count;
    }
  });

  return groupedRooms;
};

const groupRoomsByHotel = (rooms: Record<string, IDF_Rooms>) => {
  const roomsByHotel: RoomsByHotel = {};
  for (const room of Object.values(rooms)) {
    const key: HotelID_RoomType_Key = `${room.Hotel_ID}-${room.Room_type}`;
    if (!roomsByHotel[key]) {
      roomsByHotel[key] = [];
    }
    roomsByHotel[key].push(room);
  }
  return roomsByHotel;
};

export default algorithmService;
