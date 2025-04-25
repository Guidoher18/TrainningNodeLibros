import dotenv from 'dotenv';

dotenv.config();

interface JWTConfig {
  secret: string;
  expiresIn: number;
}

const jwtConfig: JWTConfig = {
  secret: process.env.SECRET_JWT_KEY ?? '',
  expiresIn: 1000 * 60 * 60 * parseInt(process.env.EXPIRES_IN ?? '12')
};

export default jwtConfig;
