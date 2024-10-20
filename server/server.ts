import express, { Request, Response } from 'express';
import staticRouter from './routers/staticRouter';
import apiRouter from './routers/apiRouter';

const app = express();
const port = process.env.SERVER_PORT || 3000;

// Define a simple route


app.use('/', staticRouter);
app.use('/api', apiRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
