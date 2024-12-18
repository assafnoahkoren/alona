import { Router } from "express";
import authenticatedRouter from "./authenticatedRouter";
import unauthenticatedRouter from "./unauthenticatedRouter";
import prisma from "../db";
import bodyParser from "body-parser";

const apiRouter = Router();

apiRouter.use(bodyParser.json());
apiRouter.post("/auth/login", async (req, res) => {
  const user = await prisma.user.findFirst({
    where: {
      email: { equals: req.body.email },
      password: { equals: req.body.password },
    },
  });
  res.send(user);
});

apiRouter.post("/auth/register", async (req, res) => {
  const user = await prisma.user.create({
    data: { email: req.body.email, password: req.body.password, isAdmin: true },
  });
  res.send(user);
});
apiRouter.use("/auth", authenticatedRouter);
apiRouter.use("/public", unauthenticatedRouter);
apiRouter.get("/", async (req, res) => {
  const hotelsCount = await prisma.iDF_hotels.count();
  const settlementsCount = await prisma.iDF_Settlement.count();
  const roomsCount = await prisma.iDF_Rooms.count();
  const bookingsCount = await prisma.iDF_Booking.count();

  const runs = await prisma.algorithm_Run.count();
  const allocations = await prisma.allocations.count();
  const rooms_SnapShot = await prisma.rooms_SnapShot.count();

  res.json({
    views: {
      hotels: hotelsCount,
      settlements: settlementsCount,
      rooms: roomsCount,
      bookings: bookingsCount,
    },
    tables: {
      runs,
      allocations,
      rooms_SnapShot,
    },
  });
});

export default apiRouter;
