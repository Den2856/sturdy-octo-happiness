import { Request, Response, NextFunction } from 'express';
import Theater from '../models/Theater';


export const getTheaters = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const theaters = await Theater.find();
    res.json(theaters);
  } catch (e) {
    next(e);
  }
};

export const createTheater = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, status } = req.body;
    const newTheater = new Theater({ name, status });
    await newTheater.save();
    res.status(201).json(newTheater);
  } catch (e) {
    next(e);
  }
};

export const updateTheater = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const updatedTheater = await Theater.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTheater) {
      res.status(404).json({ message: 'Theater not found' });
      return;
    }
    res.json(updatedTheater);
  } catch (e) {
    next(e);
  }
};

export const deleteTheater = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await Theater.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
};