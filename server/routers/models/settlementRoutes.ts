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

router.post('/', async (req: Request<{}, {}, CreateSettlementToEvacuateDto>, res: Response) => {
  try {
    const newSettlement = await prisma.settlements_To_Evacuate.create({
      data: req.body,
      include: {
        Settlement: true,
        Algorithm_Run: true
      }
    });
    res.status(201).json(newSettlement);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create settlement to evacuate' });
  }
});

export default router;
