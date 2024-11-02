import express, { Request, Response } from "express";
import prisma from "../../db";
import { Algorithm_Run } from "@prisma/client";

const router = express.Router();

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

export default router;
