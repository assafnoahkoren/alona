import { Router } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
 import { dirname } from 'path';

 const __filename = fileURLToPath(import.meta.url);
 const __dirname = dirname(__filename);
const staticRouter = Router();

// Serve static files from the 'static' directory
staticRouter.use('/', (req, res) => {
  const filePath = path.join(__dirname, '../static', req.path);
  res.sendFile(filePath);
});

export default staticRouter;
