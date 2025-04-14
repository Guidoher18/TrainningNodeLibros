import { Request, Response } from 'express';
import models from '../models/index';
import User from '../models/User';
import AuthToken from '../authentication/jwt';

const resWithToken = (
  message: string,
  status: number,
  user: User,
  res: Response
) => {
  // generate Token
  const token = AuthToken.generateToken(user);

  // set cookie on client
  return res
    .cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * parseInt(process.env.EXPIRES_IN ?? '12')
    })
    .status(status)
    .json({
      message: message,
      data: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      redirect: '/home'
    });
};

// login
export const authentication = async (req: Request, res: Response) => {
  try {
    const data: User = req.body;
    // console.log('data :>> ', data);

    // get user from db
    const user = await models.User.findOne({
      where: { email: data.email }
    });
    // console.log('user :>> ', user);

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

    return resWithToken('Authentication OK!', 200, user, res);
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

    const { dataValues: userCreated } = await models.User.create({
      username: data.username,
      email: data.email,
      password: data.password
    });

    //TODO: REVISAR POR QUÉ NO LLEGA EL ERROR AL CATCH

    //   .catch((error: unknown) => {
    //   res.status(500).json({ message: (error as Error).message });
    // });

    return resWithToken(
      'Your user has been registered!',
      201,
      userCreated,
      res
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: unknown) {
    res.status(400).json({ message: 'An error has ocurred. Try later!' });
    // res.status(400).json({ message: (error as Error).message });
  }
};
