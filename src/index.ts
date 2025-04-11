import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import session from 'express-session';
import loginRouter from './routes/login.route';
import authMiddleware from './middlewares/authMiddleware';
import sessionConfig from './config/session';
import path from 'path';
import User from './models/User';

const app = express();

dotenv.config();

app.disable('x-powered-by');

// EJS Views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middlewares
app.use(express.json());
app.use(morgan('dev'));
app.use(session(sessionConfig));
app.use(authMiddleware);

// static files
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
  res.render('index');
});

app.use('/login', loginRouter);

app.get('/home', (req, res) => {
  const data = req.session.user as User;

  res.render('home', {
    id: data.id,
    username: data.username,
    email: data.email
  });
});

// logout
app.post('/logout', (req, res) => {
  console.log('ANTES');
  console.log(req.session.user);
  console.log(req.cookies['access_token']);

  req.session.user = null;
  res.clearCookie('access_token');

  console.log('DESPUES');
  console.log(req.session.user);
  console.log(req.cookies['access_token']);

  res.status(200).json({ message: 'Logout exitoso!' });
});

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`App running on http://localhost:${PORT}`);
});
