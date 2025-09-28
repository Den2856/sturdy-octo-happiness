import { Schema, model, Document } from 'mongoose';

export interface MovieDoc extends Document {
  title: string;
  year?: number;
  status: 'draft' | 'published';
  coverUrl?: string;
  backdropUrl?: string;
  description?: string;
  genres?: string[];
  runtime?: string;
  rating?: number;
  startDate?: string;
  endDate?: string;
  price?: number;
  rm: string;
  createdAt: Date;
  updatedAt: Date;
}

const movieSchema = new Schema<MovieDoc>(
  {
    title: { type: String, required: true, index: true },
    year: Number,
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    coverUrl: String,
    backdropUrl: String,
    description: String,
    genres: [String],
    runtime: String,
    rating: Number,
    startDate: String,
    endDate: String,
    price: Number,
    rm: { type: String, default: 'USD' }
  },
  { timestamps: true }
);

export const Movie = model<MovieDoc>('Movie', movieSchema);
