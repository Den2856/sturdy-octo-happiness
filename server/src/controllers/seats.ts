import { Request, Response, NextFunction, RequestHandler } from 'express';
import mongoose from 'mongoose';
import { Seat } from '../models/seat';

export const getSeats: RequestHandler = async (req, res, next) => {
  try {
    const { theaterId } = req.query as { theaterId: string };

    if (!theaterId) {
      res.status(400).json({ message: 'Theater ID is required' });
    }

    const theaterObjectId = new mongoose.Types.ObjectId(theaterId);

    const seats = await Seat.find({ theaterId: theaterObjectId });

    if (seats.length > 0) {
      res.json(seats);
    } else {
      res.status(404).json({ message: 'No seats found for this theater' });
    }
  } catch (e) {
    next(e);
  }
};

export const createSeat: RequestHandler = async (req, res, next) => {
  try {
    const { name, type, theaterId } = req.body;
    if (!name || !type || !theaterId) {
      res.status(400).json({ message: 'Name, Type, and Theater ID are required' });
    }

    const theaterObjectId = new mongoose.Types.ObjectId(theaterId);

    const seat = new Seat({ name, type, theaterId: theaterObjectId });
    await seat.save();

    res.status(201).json(seat);
  } catch (e) {
    next(e);
  }
};

// Удаление места
export const deleteSeat: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const seat = await Seat.findByIdAndDelete(id);

    if (!seat) {
      res.status(404).json({ message: 'Seat not found' });
    }

    res.status(204).end();
  } catch (e) {
    next(e);
  }
};
