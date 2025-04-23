import { Router } from 'express';
import asyncHandler from '../helper/asyncHelper';
import {
  create,
  getBooksByUser,
  getUsersByBook,
  remove
} from '../controllers/userBook.controller';

const router = Router();

// private
router.get('/:userID', asyncHandler(getBooksByUser));
router.get('/book/:bookID', asyncHandler(getUsersByBook));
router.post('/create', asyncHandler(create));
router.delete('/delete/:userID/:bookID', asyncHandler(remove));

export default router;
