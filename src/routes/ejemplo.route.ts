import { Router } from 'express';
import { saludo } from '../controllers/ejemplo.controller';

const router = Router();

router.get('/saludo', saludo);

export default router;
