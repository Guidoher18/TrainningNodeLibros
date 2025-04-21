import { Request, Response } from 'express';
import { catchError } from '../helper/common';
import models from '../models';

/**
 * By default, the search endpoint returns works instead of editions. A work is a collection of editions; for example there is only one work for The Wonderful Wizard of Oz (OL18417W), but there are 1029 editions, over many languages! Sometimes you might want to fetch data about editions as well as works.
 * More info: https://openlibrary.org/dev/docs/api/search
 */
export const getWorks = async (req: Request, res: Response) => {
  try {
    const { q, fields = 'edition_key title', work_page, work_size } = req.query;

    if ([q, fields, work_page, work_size].includes(undefined)) {
      return res.status(400).json({
        message:
          'Bad request. Missing parameters: "q", "work_page", "work_size" are required, "fields" is optional.'
      });
    }

    await fetch(
      `https://openlibrary.org/search.json?q=${q}&fields=${(
        fields as string
      ).replace(' ', '%20')}&page=${work_page}&limit=${work_size}`
    )
      .then((data) => data.json())
      .then((data) => {
        // console.log('data :>> ', data);
        return res.json({
          numFound: data.numFound,
          q: data.q,
          docs: data.docs
        });
      });
  } catch (error) {
    catchError(error, res);
  }
};

const getEd = async (req: Request) => {
  const { id } = req.params;
  return await fetch(`https://openlibrary.org/works/${id}.json`).then((data) =>
    data.json()
  );
};

/**
 * Returns an specific edition (book) by id. For example: /OL18417W
 */
export const getEditions = async (req: Request, res: Response) => {
  try {
    await getEd(req).then((data) => {
      return res.json(data);
    });
  } catch (error) {
    catchError(error, res);
  }
};

const getProp = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any,
  name: string,
  join: boolean = false
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any => {
  const value = data[name];
  if (Array.isArray(value) && join) {
    return value.join(', ');
  }

  return value ?? 'Unknown';
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getBook = (data: any): any => {
  const getReadingTime = (pages: number | string): string => {
    const minutosAHorasYMinutos = (minutos: number) => {
      const horas = Math.floor(minutos / 60);
      const mins = minutos - horas * 60;
      let resultado = '';

      if (horas > 0) resultado += `${horas}h`;
      if (mins > 0 || horas === 0) {
        resultado += (horas > 0 ? ' ' : '') + `${mins}m`;
      }

      return resultado.trim();
    };

    if (typeof pages === 'number') return minutosAHorasYMinutos(5 * pages);
    return 'Unknown';
  };

  return {
    title: getProp(data, 'title'),
    author: getProp(data, 'authors', true),
    image_url: `https://covers.openlibrary.org/b/isbn/${getProp(
      data,
      'isbn_10'
    )}-M.jpg`,
    genre: getProp(data, 'subjects', true),
    publisher: getProp(data, 'publishers', true),
    pages: getProp(data, 'number_of_pages'),
    published_date: getProp(data, 'publish_date'),
    sinopsis: 'unknown',
    reading_time: getReadingTime(getProp(data, 'number_of_pages'))
  };
};

export const importEdition = async (req: Request, res: Response) => {
  try {
    await getEd(req).then(async (data) => {
      const obj = getBook(data);
      // console.log('data :>> ', obj);
      const newBook = await models.Book.create({ ...obj });

      return res.status(201).json(newBook);
    });
  } catch (error) {
    catchError(error, res);
  }
};
