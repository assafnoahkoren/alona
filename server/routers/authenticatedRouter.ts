import express, { Request, Response } from "express";
import prisma from "../db";
import { RoomAllocator } from "../RoomAllocator";
import settlementRoutes from './models/settlementToEvacuateRoutes';
import roomRoutes from './models/roomRoutes';
import hotelRoutes from './models/hotelRoutes';
import idfSettlementRoutes from './models/settlementRoutes';
import allocationRoutes from './models/allocationRoutes';
import algorithmRunRoutes from './models/algorithmRunRoutes';
import evacuationDataRoutes from "./models/evacuationDataRoutes";

const authenticatedRouter = express.Router();

// Mount the routes
authenticatedRouter.use('/settlements-to-evacuate', settlementRoutes);
authenticatedRouter.use('/rooms', roomRoutes);
authenticatedRouter.use('/hotels', hotelRoutes);
authenticatedRouter.use('/settlements', idfSettlementRoutes);
authenticatedRouter.use('/allocations', allocationRoutes);
authenticatedRouter.use('/algorithm-runs', algorithmRunRoutes);
authenticatedRouter.use('/evacuation-data', evacuationDataRoutes);
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
   await prisma.algorithm_Run.create({
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
