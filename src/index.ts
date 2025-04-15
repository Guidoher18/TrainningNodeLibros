import express from 'express';
import router from './routes/ejemplo.route';
import dotenv from 'dotenv';
import authMiddleware from './middlewares/authMiddleware';

const app = express();

dotenv.config();

const PORT = process.env.PORT ?? 3000;

app.disable('x-powered-by');

// Middleware para parsear json
app.use(express.json());

app.get('/', (req, res) => {
  res.send('<h1>Bienvenido a la API Pública!</h1>');
});

app.use('/protegido', authMiddleware, (req, res) => {
  res.send('<h1>Has accedido a un endpoint privado!</h1>');
});

app.use('/api', router);

app.listen(PORT, () => {
  console.log(`App running on http://localhost:${PORT}`);
});
