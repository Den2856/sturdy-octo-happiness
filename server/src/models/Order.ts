import { Schema, model, Document } from 'mongoose';

const orderSchema = new Schema({
  movieId: { type: Schema.Types.ObjectId, ref: 'Movie', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  theaterId: { type: Schema.Types.ObjectId, ref: 'Theater', required: true },
  title: { type: String, required: true },
  coverUrl: { type: String },
  price: { type: Number, required: true },
  selectedDate: { type: Date, required: true },
  seats: [{ type: String }],
  bookingInfo: String,
}, { timestamps: true });

const Order = model('Order', orderSchema);
export default Order;
