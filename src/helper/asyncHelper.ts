import { Request, Response } from 'express';

const asyncHandler =
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  (fn: Function) => (req: Request, res: Response) =>
    Promise.resolve(fn(req, res));

export default asyncHandler;
