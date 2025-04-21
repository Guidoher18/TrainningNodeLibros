import { Router } from 'express';
import asyncHandler from '../helper/asyncHelper';
import {
  getEditions,
  getWorks,
  importEdition
} from '../controllers/search.controller';

const router = Router();

// private
router.get('/worksearch', asyncHandler(getWorks));
router.get('/edition/:id', asyncHandler(getEditions));
router.post('/import/:id', asyncHandler(importEdition));

export default router;
