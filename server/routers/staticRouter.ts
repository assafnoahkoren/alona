import { Router } from 'express';
import path from 'path';

const staticRouter = Router();

// Serve static files from the 'static' directory
staticRouter.use('/', (req, res) => {
  const filePath = path.join(__dirname, 'static', req.path);
  res.sendFile(filePath);
});

export default staticRouter;
