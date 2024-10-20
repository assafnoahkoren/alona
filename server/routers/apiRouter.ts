import { Router } from 'express';
import authenticatedRouter from './authenticatedRouter';
import unauthenticatedRouter from './unauthenticatedRouter';

const apiRouter = Router();

apiRouter.use('/auth', authenticatedRouter);
apiRouter.use('/public', unauthenticatedRouter);

export default apiRouter;
