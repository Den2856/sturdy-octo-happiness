import { Router } from 'express';
import { getTheaters, createTheater, updateTheater, deleteTheater } from '../controllers/theaters';

const router = Router();

router.get('/', getTheaters);
router.post('/', createTheater);
router.put('/:id', updateTheater);
router.delete('/:id', deleteTheater);

export default router;
