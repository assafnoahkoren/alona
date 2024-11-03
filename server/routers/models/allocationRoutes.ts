import express, { Request, Response } from "express";
import prisma from "../../db";
import { Allocations } from "@prisma/client";

const router = express.Router();

interface CreateAllocationDto {
  Hotel_ID?: string;
  Settelment_ID?: string;
  Rooms?: string;
  run_id?: number;
}

router.get('/', async (_req: Request, res: Response<Allocations[]>) => {
  try {
    const allocations = await prisma.allocations.findMany({
      include: {
        Algorithm_Run: true
      }
    });
    res.json(allocations);
  } catch (error) {
    res.status(500).json([]);
  }
});

router.post('/', async (req: Request<{}, {}, CreateAllocationDto>, res: Response) => {
  try {
    const newAllocation = await prisma.allocations.create({
      data: req.body,
      include: {
        Algorithm_Run: true
      }
    });
    res.status(201).json(newAllocation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create allocation' });
  }
});

export default router;
