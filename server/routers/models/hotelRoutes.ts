import express, { Request, Response } from "express";
import prisma from "../../db";
import { IDF_hotels } from "@prisma/client";

const router = express.Router();

router.get('/', async (_req: Request, res: Response<IDF_hotels[]>) => {
  try {
    const hotels = await prisma.iDF_hotels.findMany();
    res.json(hotels);
  } catch (error) {
    res.status(500).json([]);
  }
});

export default router;
