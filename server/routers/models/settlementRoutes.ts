import express, { Request, Response } from "express";
import prisma from "../../db";
import { IDF_Settlement } from "@prisma/client";
import { SettlementToEvacuate } from "../../../client/src/services/settlementService";

const router = express.Router();
export interface EnrichSettlement extends IDF_Settlement {
  Settlements_To_Evacuate: SettlementToEvacuate[];
}

router.get('/', async (_req: Request, res: Response<EnrichSettlement[]>) => {
  try {
    const settlements = await prisma.iDF_Settlement.findMany({
      include: {
        Settlements_To_Evacuate: true
      }
    });
    res.json(settlements as EnrichSettlement[]);
  } catch (error) {
    res.status(500).json([]);
  }
});


export default router;
