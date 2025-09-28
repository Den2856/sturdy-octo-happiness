import { Router } from 'express';
import { registerAdmin, loginAdmin, meAdmin } from '../controllers/adminAuth';
import { authMiddleware } from '../middleware/authMiddleware';

const r = Router();
r.post('/register', registerAdmin);
r.post('/login', loginAdmin);
r.get('/me', authMiddleware, meAdmin);
export default r;
