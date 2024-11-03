import express, { Request, Response } from "express";
import prisma from "../../db";
import { IDF_Settlement } from "@prisma/client";

const router = express.Router();

router.get('/', async (_req: Request, res: Response<IDF_Settlement[]>) => {
  try {
    const settlements = await prisma.iDF_Settlement.findMany({
      include: {
        Settlements_To_Evacuate: true
      }
      
    });
    res.json(settlements);
  } catch (error) {
    res.status(500).json([]);
  }
});

export default router;
