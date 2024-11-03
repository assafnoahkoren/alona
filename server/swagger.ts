import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'IDF Room Allocation API',
      version: '1.0.0',
      description: 'API for managing room allocations for IDF settlements',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./server/routers/models/*.ts'], // Path to the API routes
};

export const specs = swaggerJsdoc(options);
