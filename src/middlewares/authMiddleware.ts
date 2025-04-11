import { NextFunction, Request, Response } from 'express';
import jwt from '../authentication/jwt';
import { JwtPayload } from 'jsonwebtoken';

declare module 'express-session' {
  interface SessionData {
    user?: string | JwtPayload | null;
  }
}

// by default all ep require JWT
const pathPublicos = ['/', '/login/.*', '/assets/.+', '/favicon.+'];

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  req.session.user = null;

  const pathPublicosRegex = pathPublicos.map((path) => new RegExp(`^${path}$`));
  const esPathPublico = pathPublicosRegex.some((regex) => regex.test(req.path));

  console.log(`Path: ${req.path}`);
  console.log('esPathPublico :>> ', esPathPublico);

  if (!esPathPublico) {
    console.log('COOKIES');
    console.log(req.headers.cookie);

    const token: string = JSON.parse(req.headers.cookie as string) ?? '';

    console.log(`Token: ${token}`);

    if (token.length === 0) {
      res.status(401).json({ message: 'Unauthorized. No token provided.' });
    }

    const data = jwt.verifyToken(token);

    if (!data) {
      res.status(403).json({ message: 'Forbidden. Invalid token.' });
    }

    req.session.user = data;
  }

  next();
};

export default authMiddleware;
