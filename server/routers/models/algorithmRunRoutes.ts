import express, { Request, Response } from "express";
import prisma from "../../db";
import { Algorithm_Run } from "@prisma/client";

const router = express.Router();

interface CreateAlgorithmRunDto {
  parameters?: string;
  Is_active?: boolean;
  last_run_id?: number;
}

router.get('/', async (_req: Request, res: Response<Algorithm_Run[]>) => {
  try {
    const runs = await prisma.algorithm_Run.findMany({
      include: {
        Settlements_To_Evacuate: true,
        Allocations: true,
        Rooms_SnapShot: true
      }
    });
    res.json(runs);
  } catch (error) {
    res.status(500).json([]);
  }
});

router.post('/', async (req: Request<{}, {}, CreateAlgorithmRunDto>, res: Response) => {
  try {
    const newRun = await prisma.algorithm_Run.create({
      data: req.body
    });
    res.status(201).json(newRun);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create algorithm run' });
  }
});

export default router;
