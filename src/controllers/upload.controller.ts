import { Request, Response } from 'express';
import { catchError } from '../helper/common';

export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: 'Error uploading file.' });

    res.json({
      message: 'File uploaded successfully.',
      imageUrl: `/assets/uploads/${req.file.filename}`
    });
  } catch (error: unknown) {
    // console.log('Error uploading file.', error);
    catchError(error, res);
  }
};
