import { RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET!;
const INVITE = process.env.ADMIN_INVITE_CODE!;

export const registerAdmin: RequestHandler = async (req, res, next) => {
  try {
    const { email, password, name, invite } = req.body;
    if (!email || !password || invite !== INVITE) {
      res.status(400).json({ message: 'Invalid data or invite' });
      return;
    }

    if (await User.exists({ email })) {
      res.status(409).json({ message: 'Email exists' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ email, passwordHash, name, role: 'admin' });
    res.status(201).json({ id: user.id, email: user.email, name: user.name, role: user.role });
  } catch (e) {
    next(e);
  }
};

export const loginAdmin: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).lean();
    if (!user || user.role !== 'admin') {
      res.status(401).json({ message: 'Not admin' });
      return;
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      res.status(401).json({ message: 'Bad credentials' });
      return;
    }

    const token = jwt.sign({ id: user._id.toString() }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, role: user.role });
  } catch (e) {
    next(e);
  }
};


export const meAdmin: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findById((req as any).userId).lean();
    if (!user || user.role !== 'admin') {
      res.status(401).json({ message: 'Not admin' });
      return;
    }
    res.json({ id: user._id, email: user.email, name: user.name, role: user.role });
  } catch (e) {
    next(e);
  }
};
