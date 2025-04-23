import { Request, Response } from 'express';
import models from '../models/index';
import { catchError } from '../helper/common';
import sequelize from '../config/db';
import Book from '../models/Book';
import userToDto from '../dto/user.dto';
import User from '../models/User';

export const getBooksByUser = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;

    const userBooks = await models.UserBook.findAll({
      where: { userID: userID }
    });

    if (userBooks.length === 0) {
      return res.json({ message: "The user hasn't got any book associated." });
    }

    const booksIds: string = userBooks
      .map((userBook) => userBook.bookID)
      .join(', ');

    console.log('booksIds :>> ', booksIds);

    const [results, metadata] = await sequelize.query(
      `SELECT * FROM Books WHERE id IN (${booksIds})`
    );

    return res.status(200).json(results);
  } catch (error: unknown) {
    catchError(error, res);
  }
};

/**
 * Create a relationship between an user and one o some book(s).
 */
export const create = async (req: Request, res: Response) => {
  try {
    const { userID, booksIDs } = req.body;

    const booksIds: string[] = booksIDs.split(',');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userBooks: any[] = [];

    booksIds.forEach((bookID) => {
      userBooks.push({
        userID: parseInt(userID),
        bookID: parseInt(bookID)
      });
    });

    const newBook = await models.UserBook.bulkCreate(userBooks);

    return res.status(201).json(newBook);
  } catch (error: unknown) {
    catchError(error, res);
  }
};

export const getUsersByBook = async (req: Request, res: Response) => {
  try {
    const { bookID } = req.params;

    const userBooks = await models.UserBook.findAll({
      where: { bookID: bookID }
    });

    if (userBooks.length === 0) {
      return res.json({ message: "The book hasn't got any user associated." });
    }

    const usersIds: string = userBooks
      .map((userBook) => userBook.userID)
      .join(', ');

    const [results, metadata] = await sequelize.query(
      `SELECT * FROM Users WHERE id IN (${usersIds})`
    );

    return res.status(200).json(userToDto(results as User[]));
  } catch (error: unknown) {
    catchError(error, res);
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const { userID, bookID } = req.params;
    const userBooks = await models.UserBook.findOne({
      where: { userID: userID, bookID: bookID }
    });

    if (!userBooks) {
      return res.status(404).json({ message: 'Not Found. Entity not found.' });
    }

    await userBooks.destroy();
    return res.status(200).json({ message: 'Entity deleted.' });
  } catch (error: unknown) {
    catchError(error, res);
  }
};

/*
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


*/
// export default { getById, getAll, create, update, remove };

export default { getBooksByUser, getUsersByBook, create };
