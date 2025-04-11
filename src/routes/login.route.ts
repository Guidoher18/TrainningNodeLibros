import { Router } from 'express';
import { authentication, register } from '../controllers/login.controller';
import asyncHandler from '../helper/asyncHelper';

const router = Router();

// public
router.post('/auth', asyncHandler(authentication));
router.post('/register', asyncHandler(register));

export default router;
