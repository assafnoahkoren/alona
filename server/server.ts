import express from 'express';
import staticRouter from './routers/staticRouter';
import apiRouter from './routers/apiRouter';
import morgan from 'morgan';
const app = express();
const port = process.env.SERVER_PORT || 3000;

// Use morgan middleware for logging
app.use(morgan('combined'));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});


app.use('/api', apiRouter);
app.use('/', staticRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
