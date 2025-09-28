import mongoose from 'mongoose';

const SeatSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  theaterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Theater', required: true },
}, { timestamps: true });

export const Seat = mongoose.model('Seat', SeatSchema);
