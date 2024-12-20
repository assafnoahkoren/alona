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
    console.error(error);
    res.status(500).json([]);
  }
});


type Parameters = {
  hotels?: EnrichedHotel[];
  settlement?: EnrichedSettlement[];
  parameters?: {
    fitInRoom: boolean;
    requiredRoomsPopulationPercentage: number;
    mode: 'static' | 'dynamic';
  };
}

router.post('/', async (req: Request<{}, {}, CreateAlgorithmRunDto>, res: Response) => {
  try {
    await prisma.allocations.deleteMany();
    const parameters: Parameters = JSON.parse(req.body.parameters || '{}');

    const newRun = await prisma.algorithm_Run.create({
      data: {
        parameters: JSON.stringify(parameters.parameters)
      }
    });
    const result = await algorithmService.runAllocation({
      hotels: parameters.hotels || [],
      settlements: parameters.settlement || [],
      personsInRooms: 4,
      algorithmRun: newRun,
    });
    let execResult = null;
    if (process.env.EXEC_SP === 'true') {
      execResult = await prisma.$executeRawUnsafe(`EXEC msdb.dbo.SP_Refresh_REPORT`)
    }
  
    res.status(201).json({
      algorithmRun: newRun,
      result: result,
      execResult: execResult
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create algorithm run' });
  }
});

export default router;
