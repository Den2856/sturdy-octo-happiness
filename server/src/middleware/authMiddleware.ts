import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User'; // <-- не хватало импорта

const JWT_SECRET = process.env.JWT_SECRET!;

export const authMiddleware: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Нет токена' });
    return;
  }

  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string };
    (req as any).userId = payload.id;
    next();
    return;
  } catch {
    res.status(401).json({ message: 'Авторизуйтесь для продолжения' });
    return;
  }
};

export const requireAdmin: RequestHandler = async (req, res, next) => {
  const userId = (req as any).userId;
  if (!userId) {
    res.status(401).json({ message: 'No auth' });
    return;
  }
  const user = await User.findById(userId).lean();
  if (!user || user.role !== 'admin') {
    res.status(403).json({ message: 'Admins only' });
    return;
  }
  next();
};
