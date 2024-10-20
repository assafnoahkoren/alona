import { Router } from 'express';
import authenticatedRouter from './routers/authenticatedRouter';
import unauthenticatedRouter from './routers/unauthenticatedRouter';

const apiRouter = Router();

apiRouter.use('/auth', authenticatedRouter);
apiRouter.use('/public', unauthenticatedRouter);

export default apiRouter;
