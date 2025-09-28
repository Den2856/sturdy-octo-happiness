import { Router } from 'express';
import { authMiddleware, requireAdmin } from '../middleware/authMiddleware';
import { listMovies, getMovie, createMovie, updateMovie, deleteMovie } from '../controllers/movies';

const r = Router();
r.use(authMiddleware, requireAdmin);
r.get('/', listMovies);
r.post('/', createMovie);
r.get('/:id', getMovie);
r.put('/:id', updateMovie);
r.delete('/:id', deleteMovie);
export default r;
