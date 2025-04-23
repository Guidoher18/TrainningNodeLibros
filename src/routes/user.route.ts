import { Router } from 'express';
import asyncHandler from '../helper/asyncHelper';
import {
  getById,
  getAll,
  create,
  update,
  remove
} from '../controllers/user.controller';

const router = Router();

// private
router.get('/', asyncHandler(getAll));
router.get('/:id', asyncHandler(getById));
router.post('/create', asyncHandler(create));
router.put('/update/:id', asyncHandler(update));
router.delete('/delete/:id', asyncHandler(remove));

export default router;
