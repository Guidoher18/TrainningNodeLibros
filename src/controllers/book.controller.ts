import { Request, Response } from 'express';
import models from '../models/index';
import Book from '../models/Book';
import { catchError } from '../helper/common';

export const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // console.log('id :>> ', id);
    const book = await models.Book.findByPk(id);

    if (!book) {
      return res.status(404).json({ message: 'Not Found. Book not found.' });
    }

    return res.status(200).json(book);
  } catch (error: unknown) {
    catchError(error, res);
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const books = await models.Book.findAll();
    return res.json(books);
  } catch (error: unknown) {
    catchError(error, res);
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const book: Book = req.body;

    // console.log('book :>> ', book);
    const newBook = await models.Book.create({ ...book });

    return res.status(201).json(newBook);
  } catch (error: unknown) {
    catchError(error, res);
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const book: Book = req.body;
    const bookToUpdate = await models.Book.findByPk(id);

    if (!bookToUpdate) {
      return res.status(404).json({ message: 'Not Found. Book not found.' });
    }

    await bookToUpdate.update(book);
    return res.status(200).json(bookToUpdate);
  } catch (error: unknown) {
    catchError(error, res);
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const book = await models.Book.findByPk(id);

    if (!book) {
      return res.status(404).json({ message: 'Not Found. Book not found.' });
    }

    await book.destroy();
    return res.status(200).json({ message: 'Book deleted.' });
  } catch (error: unknown) {
    catchError(error, res);
  }
};

export default { getById, getAll, create, update, remove };
