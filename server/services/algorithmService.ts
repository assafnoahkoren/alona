import { IDF_Rooms } from "@prisma/client";
import { EnrichedHotel } from "../routers/models/hotelRoutes";
import { EnrichedSettlement } from "../routers/models/settlementRoutes";

export interface AlgorithmInput {
  hotels: EnrichedHotel[];
  settlements: EnrichedSettlement[];
  personsInRooms: number;
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
    const availableRooms = getRooms(input.hotels);
    const availableRoomsByHotel = groupRoomsByHotel(availableRooms);
    const neededRooms = input.settlements.map((settlement) => ({
      settlementID: settlement.Settlement_id,
      rooms: settlement.Settlements_To_Evacuate[0].rooms_needed,
    }));
    return {
      allocations: {},
      unallocated: availableRoomsByHotel,
      duration: 0,
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
