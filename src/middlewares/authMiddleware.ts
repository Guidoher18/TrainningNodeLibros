import { NextFunction, Request, Response } from 'express';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Recuopero el token
  const token = req.headers.authorization;
  console.log(`Token: ${token}`);

  if (!token) {
    res.status(401).json({ message: 'Unauthorized. No token provided.' });
  }

  if (token !== 'mi-token-secreto') {
    res.status(403).json({ message: 'Forbidden. Invalid token.' });
  }

  next();
};

export default authMiddleware;
