import session from 'express-session';

const sessionConfig: session.SessionOptions = {
  secret: process.env.SECRET_SESSION_KEY ?? '',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * parseInt(process.env.EXPIRES_IN ?? '12')
  }
};

export default sessionConfig;
