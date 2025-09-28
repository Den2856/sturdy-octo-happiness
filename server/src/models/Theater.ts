import { Schema, model } from 'mongoose';

const theaterSchema = new Schema({
  name: { type: String, required: true },
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
});

const Theater = model('Theater', theaterSchema);
export default Theater;