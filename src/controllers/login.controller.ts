import { Request, Response } from 'express';
import models from '../models/index';
import User from '../models/User';
import AuthToken from '../authentication/jwt';

// login
export const authentication = async (req: Request, res: Response) => {
  try {
    const data: User = req.body;
    console.log('data :>> ', data);
    // get user from db
    const user = await models.User.findOne({
      where: { email: data.email }
    });
    console.log('user :>> ', user);
    if (user === null) {
      return res.status(401).json({ message: 'Unauthorized. User not found.' });
    }

    // validate username && password
    const isSameUsername = user.username === data.username;
    const isValidPassword = await AuthToken.validPassword(
      data.password,
      user.password
    );

    if (!isSameUsername || !isValidPassword) {
      return res
        .status(403)
        .json({ message: 'Forbidden. Invalid credentials.' });
    }

    // generate Token
    const token = AuthToken.generateToken(user);

    return res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * parseInt(process.env.EXPIRES_IN ?? '12')
      })
      .json({
        message: 'Authentication OK!',
        data: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return res
      .status(400)
      .json({ message: 'An error has ocurred. Try later!' });
  }
};

// register
export const register = async (req: Request, res: Response) => {
  try {
    const data: User = req.body;

    const user = await models.User.findOne({
      where: { email: data.email }
    });

    if (user !== null) {
      return res
        .status(409)
        .json({ message: 'Conflict. User already exists.' });
    }

    models.User.create({
      username: data.username,
      email: data.email,
      password: data.password
    });

    //TODO: REVISAR POR QUÉ NO LLEGA EL ERROR AL CATCH

    //   .catch((error: unknown) => {
    //   res.status(500).json({ message: (error as Error).message });
    // });

    res.status(201).json({ message: 'Your user has been registered!' });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: unknown) {
    res.status(400).json({ message: 'An error has ocurred. Try later!' });
    // res.status(400).json({ message: (error as Error).message });
  }
};
