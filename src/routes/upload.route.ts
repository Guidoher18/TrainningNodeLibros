import { Router } from 'express';
import asyncHandler from '../helper/asyncHelper';
import { uploadImage } from '../controllers/upload.controller';
import upload from '../config/multer';

const router = Router();

// private
router.post('/image', upload.single('image'), asyncHandler(uploadImage));

export default router;
