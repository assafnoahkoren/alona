import express, { Request, Response } from "express";
import prisma from "../../db";
import { Allocations } from "@prisma/client";

const router = express.Router();

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

export default router;
