import { RequestHandler } from 'express';
import { Movie } from '../models/Movie';

export const listMovies: RequestHandler = async (req, res, next) => {
  try {
    const { q = '', page = 1, limit = 20, status } = req.query as any;
    const where: any = {};
    if (q) where.title = { $regex: String(q), $options: 'i' };
    if (status) where.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Movie.find(where).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Movie.countDocuments(where),
    ]);

    res.json({ items, total });
  } catch (e) {
    next(e);
  }
};
export const getMovie: RequestHandler = async (req, res, next) => {
  try {
    const item = await Movie.findById(req.params.id);
    if (!item) {
      res.status(404).json({ message: 'Not found' });
      return;
    }
    res.json(item);
  } catch (e) {
    next(e);
  }
};

export const createMovie: RequestHandler = async (req, res, next) => {
  try {
    const { title, year, status, coverUrl, startDate, endDate, price, description, runtime, genres } = req.body;
    const movie = await Movie.create({
      title,
      year,
      status,
      coverUrl,
      startDate,
      endDate,
      description,
      runtime,
      price,
      genres,
      rm: 'USD', 
    });
    res.status(201).json(movie);
  } catch (e) {
    next(e);
  }
};

export const updateMovie: RequestHandler = async (req, res, next) => {
  try {
    const { title, year, status, coverUrl, startDate, endDate, description, runtime, price, genres } = req.body;
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      { title, year, status, coverUrl, startDate, endDate, price, description, runtime, genres, rm: 'USD' },
      { new: true }
    );
    if (!updatedMovie) {
      res.status(404).json({ message: 'Movie not found' });
      return;
    }
    res.json(updatedMovie);
  } catch (e) {
    next(e);
  }
};

export const deleteMovie: RequestHandler = async (req, res, next) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
};

