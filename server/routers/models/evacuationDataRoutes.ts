import express, { Request, Response } from "express";
import prisma from "../../db";
import { TBL_evacuation_data } from "@prisma/client";

const router = express.Router();

router.get('/', async (_req: Request, res: Response<TBL_evacuation_data[]>) => {
  try {
    const evacuationData = await prisma.tBL_evacuation_data.findMany();
    res.json(evacuationData);
  } catch (error) {
    console.error(error);
    res.status(500).json([]);
  }
});

export default router;
