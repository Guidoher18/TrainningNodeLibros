import jwt, { JwtPayload } from 'jsonwebtoken';
import jwtConfig from '../config/jwtConfig';
import User from '../models/User';
import bcrypt from 'bcryptjs';

class AuthToken {
  static generateToken(user: User): string {
    const token: string = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email
      },
      jwtConfig.secret,
      {
        expiresIn: jwtConfig.expiresIn
      }
    );

    return token;
  }

  static verifyToken(token: string): string | JwtPayload | null {
    try {
      return jwt.verify(token, jwtConfig.secret);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return null;
    }
  }

  static async validPassword(
    password: string,
    passwordHash: string
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(password, passwordHash);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return false;
    }
  }
}

export default AuthToken;
