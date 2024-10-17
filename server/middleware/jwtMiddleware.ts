import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface DecodedJWT {
  userId: string;
  email: string;
  // Add other fields as needed
}

declare module 'express-serve-static-core' {
  interface Request {
    decodedJwt?: DecodedJWT;
  }
}

const jwtMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, 'your-secret-key') as DecodedJWT;
    req.decodedJwt = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export default jwtMiddleware;
