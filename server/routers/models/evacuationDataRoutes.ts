import express, { Request, Response } from "express";
import prisma from "../../db";

const router = express.Router();

export interface EvacuationDataResponse {
  yishuvName: string;
  yishuvNumber: number;
  population: number;
  would_need_room_estimated: number;
  Eshkol: string;
  Merhav: string;
  Rishut: string;
}

router.get('/', async (_req: Request, res: Response<EvacuationDataResponse[]>) => {
  try {
    const evacuationData = await prisma.tBL_evacuation_data.findMany({
      select: {
        Yishuv_Name: true,
        Yishuv_Number: true,
        Population_Remaining_Estimate_16_7: true,
        Total_Estimated_Rooms_For_Eligible_Residents_Excluding_Remaining: true,
        Eshkol: true,
        Merhav: true,
        Rishut: true,
      }
    });
    const data =  evacuationData.map((item) => ({
        yishuvName: item.Yishuv_Name,
        yishuvNumber: item.Yishuv_Number,
        population: item.Population_Remaining_Estimate_16_7,
        would_need_room_estimated: item.Total_Estimated_Rooms_For_Eligible_Residents_Excluding_Remaining,
        Eshkol: item.Eshkol,
        Merhav: item.Merhav,
        Rishut: item.Rishut,
    }))
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json([]);
  }
});

export default router;
