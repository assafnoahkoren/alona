import express, { Request, Response } from "express";
import prisma from "../../db";
import { Settlements_To_Evacuate } from "@prisma/client";

const router = express.Router();

interface CreateSettlementToEvacuateDto {
  Settlement_ID: string;
  Name?: string;
  rooms_needed?: string;
  run_id?: number;
}

router.get('/', async (_req: Request, res: Response<Settlements_To_Evacuate[]>) => {
  try {
    const settlements = await prisma.settlements_To_Evacuate.findMany({
      include: {
        Settlement: true,
        Algorithm_Run: true
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
