import express, { Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import { specs } from './swagger';
import staticRouter from './routers/staticRouter';
import apiRouter from './routers/apiRouter';

const app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
const port = process.env.SERVER_PORT || 3000;

// Define a simple route


app.use('/api', apiRouter);
app.use('/', staticRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
