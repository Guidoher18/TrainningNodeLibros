import { Response } from 'express';

export const catchError = (
  error: unknown,
  res: Response,
  status: number = 500,
  msg: string = 'Internal Server Error.'
) => {
  return res.status(status).json({
    message: `${msg} ${(error as Error).message}`
  });
};
