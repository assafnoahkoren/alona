import express, { Request, Response } from 'express';
import prisma from './db';
import staticRouter from './staticRouter';
import apiRouter from './apiRouter';

const app = express();
const port = process.env.SERVER_PORT || 3000;

// Define a simple route
app.get('/', async (req: Request, res: Response) => {
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

app.use('/static', staticRouter);
app.use('/api', apiRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
