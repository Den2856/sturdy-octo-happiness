import { Router } from 'express';
import { getSeats, createSeat, deleteSeat } from '../controllers/seats';

const router = Router();

router.get('/', getSeats);
router.post('/', createSeat);
router.delete('/:id', deleteSeat);

export default router;
