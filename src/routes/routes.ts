import { Router } from 'express';

const router = Router();

router.get('/saludo', (req, res) => {
  res.json({ saludo: 'Hola desde otra ruta!' });
});

export default router;
