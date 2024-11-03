import express, { Request, Response } from "express";
import prisma from "../../db";
import { IDF_Settlement, Settlements_To_Evacuate } from "@prisma/client";


const router = express.Router();
export interface EnrichedSettlement extends IDF_Settlement {
  Settlements_To_Evacuate: Settlements_To_Evacuate[];
}

router.get('/', async (_req: Request, res: Response<EnrichedSettlement[]>) => {
  try {
    const settlements = await prisma.iDF_Settlement.findMany({
      include: {
        Settlements_To_Evacuate: true
      }
    });
    res.json(settlements as EnrichedSettlement[]);
  } catch (error) {
    res.status(500).json([]);
  }
});


export default router;
