import express, { Request, Response } from "express";
import prisma from "../../db";
import { Settlements_To_Evacuate } from "@prisma/client";

const router = express.Router();

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

export default router;
