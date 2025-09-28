import { Schema, model, Document } from 'mongoose';

export interface UserDoc extends Document {
  email: string;
  passwordHash: string;
  name?: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  verificationCode: string;
  codeExpires: Date;
}

const userSchema = new Schema<UserDoc>(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    name: { type: String },
    avatar: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    verificationCode: String,
    codeExpires: Date,
  },
  { timestamps: true }
);

export const User = model<UserDoc>('User', userSchema);
