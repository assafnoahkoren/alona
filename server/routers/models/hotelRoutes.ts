import express, { Request, Response } from "express";
import prisma from "../../db";
import { IDF_hotels, IDF_Rooms } from "@prisma/client";

const router = express.Router();


export interface EnrichedHotel extends IDF_hotels {
  rooms: IDF_Rooms[];
}


router.get('/', async (_req: Request, res: Response<EnrichedHotel[]>) => {
  try {
    const hotels = await prisma.iDF_hotels.findMany();
    const hotelIds = hotels.map(hotel => hotel.Hotel_ID);
    const rooms = await prisma.iDF_Rooms.findMany({
      where: {
        Hotel_ID: { in: hotelIds }
      }
    });
    const enrichedHotels = hotels.map(hotel => ({
      ...hotel,
      rooms: rooms.filter(room => room.Hotel_ID === hotel.Hotel_ID)
    }));
    res.json(enrichedHotels);
  } catch (error) {
    res.status(500).json([]);
  }
});



export default router;
