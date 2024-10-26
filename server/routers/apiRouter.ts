import { Router } from 'express';
import authenticatedRouter from './authenticatedRouter';
import unauthenticatedRouter from './unauthenticatedRouter';
import prisma from '../db';
import bodyParser from 'body-parser';

const apiRouter = Router();

apiRouter.use(bodyParser.json());

apiRouter.get('/', async (req, res) => {
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



apiRouter.use('/auth', authenticatedRouter);
apiRouter.use('/public', unauthenticatedRouter);

export default apiRouter;
