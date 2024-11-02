import express, { Request, Response } from "express";
import prisma from "../db";
import { RoomAllocator } from "../RoomAllocator";
import { Algorithm_Run, Allocations, IDF_hotels, IDF_Rooms, IDF_Settlement, Settlements_To_Evacuate } from "@prisma/client";

const authenticatedRouter = express.Router();

// Get all Settlements to Evacuate
authenticatedRouter.get('/settlements-to-evacuate', async (_req: Request, res: Response<Settlements_To_Evacuate[]>) => {
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

// Get all IDF Rooms
authenticatedRouter.get('/idf-rooms', async (_req: Request, res: Response<IDF_Rooms[]>) => {
  try {
    const rooms = await prisma.iDF_Rooms.findMany();
    res.json(rooms);
  } catch (error) {
    res.status(500).json([]);
  }
});

// Get all IDF Hotels
authenticatedRouter.get('/idf-hotels', async (_req: Request, res: Response<IDF_hotels[]>) => {
  try {
    const hotels = await prisma.iDF_hotels.findMany();
    res.json(hotels);
  } catch (error) {
    res.status(500).json([]);
  }
});

// Get all IDF Settlements
authenticatedRouter.get('/idf-settlements', async (_req: Request, res: Response<IDF_Settlement[]>) => {
  try {
    const settlements = await prisma.iDF_Settlement.findMany({
      include: {
        Settlements_To_Evacuate: true
      }
    });
    res.json(settlements);
  } catch (error) {
    res.status(500).json([]);
  }
});

// Get all Allocations
authenticatedRouter.get('/allocations', async (_req: Request, res: Response<Allocations[]>) => {
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

// Get all Algorithm Runs
authenticatedRouter.get('/algorithm-runs', async (_req: Request, res: Response<Algorithm_Run[]>) => {
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
export type Group = {
  name: string,
  rooms: number,
}

export type Residence = {
  id: string,
  name: string,
  rooms: number,
}

export type AssignmentSettings = {
  roomCapacity: number,
}

type Reservation = {
  id: string,
  phoneNumber: string,
  idNumber: string,
  amount: number,
  residenceId: string,
  settlement: string,
  link: string,
  arrivedAt?: string,
}


export type GroupName = string;
export type ResidenceName = string;
export type Allocations = Record<GroupName, Record<ResidenceName, number>>;

type Scenario = {
  groups: Group[];
  residences: Residence[];
  persons_in_rooms: number;
};

const state = {
  persons_in_rooms: 4,
  groups: [] as Group[],
  residences: [] as Residence[],
  allocations: {} as Allocations,
  reservations: {} as Record<string, Reservation>, // idNumber -> residence[]
  allocationsLeft: {} as Allocations,
}

authenticatedRouter.post('/run-scenario', async (req: Request, res: Response) => {
  const body: Scenario = req.body;
  await prisma.algorithm_Run.updateMany({
    where: {
      Is_active: true,
    },
    data: {
      Is_active: false,
    },
  });
  const run = await prisma.algorithm_Run.create({
    data: {
      parameters: JSON.stringify(body),
      Is_active: true,
    },
  });

  const residences: Residence[] = body.residences.map((residence) => {
    const [name, city] = residence.name?.split("-").map((s) => s.trim());
    const id = residence.id || residence.name;
    return {
      id: id,
      name: name,
      rooms: residence.rooms,
      city: city,
      code: id,
    };
  });

  const roomAllocator = new RoomAllocator(body.groups, residences);
  roomAllocator.assignRooms();
  const results = roomAllocator.getAssignmentsAsArray();

  state.persons_in_rooms = body.persons_in_rooms || 4;
  state.groups = body.groups;
  state.residences = residences;
  state.allocations = roomAllocator.assignments || {};
  state.allocationsLeft = JSON.parse(JSON.stringify(state.allocations));
  state.reservations = {};

  res.json({
    query: req.query,
    body: body,
    results: results,
  });
});

export default authenticatedRouter;
