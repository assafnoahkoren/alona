import express from 'express';

const authenticatedRouter = express.Router();

// Placeholder endpoints
authenticatedRouter.get('/home', (req, res) => {
  res.send('Home Page');
});

authenticatedRouter.get('/profile', (req, res) => {
  res.send('Profile Page');
});

authenticatedRouter.get('/settings', (req, res) => {
  res.send('Settings Page');
});

export default authenticatedRouter;
