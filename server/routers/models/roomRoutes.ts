import express, { Request, Response } from "express";
import prisma from "../../db";
import { IDF_Rooms } from "@prisma/client";

const router = express.Router();

router.get('/', async (_req: Request, res: Response<IDF_Rooms[]>) => {
  try {
    const rooms = await prisma.iDF_Rooms.findMany();
    res.json(rooms);
  } catch (error) {
    console.error(error);
    res.status(500).json([]);
  }
});

export default router;
