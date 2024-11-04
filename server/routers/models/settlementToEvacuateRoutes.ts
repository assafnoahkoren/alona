import express, { Request, Response } from "express";
import prisma from "../../db";
import { Settlements_To_Evacuate } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';

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
    console.error(error);
    res.status(500).json([]);
  }
});

router.post('/', async (req: Request<{}, {}, CreateSettlementToEvacuateDto>, res: Response) => {
  try {
    const newSettlement = await prisma.settlements_To_Evacuate.create({
      data: {
        ...req.body,
        rooms_needed: req.body.rooms_needed?.toString(),
        ID: uuidv4(),
      },
      include: {
        Settlement: true,
        Algorithm_Run: true
      }
    });
    res.status(201).json(newSettlement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create settlement to evacuate' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.settlements_To_Evacuate.delete({
      where: { ID: id },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete settlement to evacuate' });
  }
});


export default router;
