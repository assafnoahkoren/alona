import express, { Request, Response } from "express";
import prisma from "../../db";
import { TBL_evacuation_data } from "@prisma/client";

const router = express.Router();

interface EvacuationDataResponse {
  yishuvName: string;
  yishuvNumber: number;
  population: number;
  would_need_room_estimated: number;
}

router.get('/', async (_req: Request, res: Response<EvacuationDataResponse[]>) => {
  try {
    const evacuationData = await prisma.tBL_evacuation_data.findMany({
      select: {
        Yishuv_Name: true,
        Yishuv_Number: true,
        Population_Regular_21_7: true,
        Total_Estimated_Rooms_For_Eligible_Residents_Excluding_Remaining: true,
      }
    });
    const data =  evacuationData.map((item) => ({
        yishuvName: item.Yishuv_Name,
        yishuvNumber: item.Yishuv_Number,
        population: item.Population_Regular_21_7,
        would_need_room_estimated: item.Total_Estimated_Rooms_For_Eligible_Residents_Excluding_Remaining
    }))
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json([]);
  }
});

export default router;
