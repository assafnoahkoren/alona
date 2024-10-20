import { Router } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
 import { dirname } from 'path';

 const __filename = fileURLToPath(import.meta.url);
 const __dirname = dirname(__filename);
const staticRouter = Router();

// Serve static files from the 'static' directory
import fs from 'fs';

staticRouter.use('/', (req, res, next) => {
  const filePath = path.join(__dirname, '../static', req.path);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      next();
    } else {
      res.sendFile(filePath);
    }
  });
});

// Fallback to index.html for unmatched routes
staticRouter.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../static', 'index.html'));
});

export default staticRouter;
