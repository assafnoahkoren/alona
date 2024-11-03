import express, { Request, Response } from "express";
import prisma from "../../db";
import { Algorithm_Run } from "@prisma/client";
import { EnrichedHotel } from "./hotelRoutes";
import { EnrichedSettlement } from "./settlementRoutes";
import algorithmService from "../../services/algorithmService";

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


type Parameters = {
  hotels?: EnrichedHotel[];
  settlement?: EnrichedSettlement[];
}

router.post('/', async (req: Request<{}, {}, CreateAlgorithmRunDto>, res: Response) => {
  try {
    const newRun = await prisma.algorithm_Run.create({
      data: {}
    });
    const parameters: Parameters = JSON.parse(req.body.parameters || '{}');
    const result = await algorithmService.runAllocation({
      hotels: parameters.hotels || [],
      settlements: parameters.settlement || [],
      personsInRooms: 4,
    });
    res.status(201).json({
      algorithmRun: newRun,
      result: result,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create algorithm run' });
  }
});

export default router;
