import { Request, Response } from 'express';
import models from '../models/index';
import User from '../models/User';
import { catchError } from '../helper/common';
import userToDto from '../dto/user.dto';

export const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // console.log('id :>> ', id);
    const user = await models.User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'Not Found. User not found.' });
    }

    return res.status(200).json(userToDto(user));
  } catch (error: unknown) {
    catchError(error, res);
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const users = await models.User.findAll();
    return res.json(userToDto(users));
  } catch (error: unknown) {
    catchError(error, res);
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const user: User = req.body;

    // console.log('user :>> ', user);
    const newUser = await models.User.create({ ...user });

    return res.status(201).json(userToDto(newUser));
  } catch (error: unknown) {
    catchError(error, res);
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user: User = req.body;
    const userToUpdate = await models.User.findByPk(id);

    if (!userToUpdate) {
      return res.status(404).json({ message: 'Not Found. User not found.' });
    }

    await userToUpdate.update(user);
    return res.status(200).json(userToDto(userToUpdate));
  } catch (error: unknown) {
    catchError(error, res);
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await models.User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'Not Found. User not found.' });
    }

    await user.destroy();
    return res.status(200).json({ message: 'User deleted.' });
  } catch (error: unknown) {
    catchError(error, res);
  }
};

export default { getById, getAll, create, update, remove };
