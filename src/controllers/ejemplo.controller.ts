import { Request, Response } from 'express';

export const saludo = (req: Request, res: Response) => {
  res.json({ message: 'Hola desde el controlador!' });
};
