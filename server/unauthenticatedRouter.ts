import { Router } from 'express';

const unauthenticatedRouter = Router();

// Placeholder endpoint for unauthenticated route
unauthenticatedRouter.get('/public', (req, res) => {
  res.send('Public endpoint');
});

export default unauthenticatedRouter;
