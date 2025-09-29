import dotenv from 'dotenv'
dotenv.config()

import path from 'node:path';
import express, { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import axios from 'axios';

import authRouter from './routes/auth'
import { getMovie, listMovies } from './controllers/movies';

import adminAuthRoutes from './routes/adminAuth';
import adminMovieRoutes from './routes/adminMovies';

import orderRoutes from './routes/orders';
import theaterRoutes from './routes/theaters';
import seatsRoutes from './routes/seats'
import userRoutes from './routes/users';
import emailRoutes from './routes/emailRoutes';

const app = express()
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'
const ADMIN_URL  = process.env.ADMIN_URL  || 'http://localhost:5174'

app.use(express.json())

app.use(cookieParser())

// 3) CORS с конкретным origin и credentials: true
app.use(cors({
  origin: [CLIENT_URL, ADMIN_URL, 'https://sturdy-octo-happiness-seven.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}))

app.use('/api/tmdb', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await axios.get('http://www.omdbapi.com/', {
      params: {
        apikey: '2fc86ace',
        t: req.query.title,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching from OMDb:", error);
    next(error);
  }
});

app.get('/', (_req: Request, res: Response) => {
  res.send('✅ API is running')
})

app.use(express.json());

// 4) Монтируем роуты
app.use('/api/auth', authRouter)
app.get('/api/movies', listMovies);
app.get('/api/movies/:id', getMovie);

app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/movies', adminMovieRoutes);
app.use('/api/theaters', theaterRoutes);
app.use('/api/seats', seatsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/email', emailRoutes);
app.use('/api', orderRoutes);

const adminDist = path.join(__dirname, './admin');
app.use('/admin', express.static(adminDist, { index: false }));

app.get(/^\/admin(\/.*)?$/, (_req, res) => {
  res.sendFile(path.join(adminDist, 'index.html'));
});


app.use((
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err)
  res.status(err.status || 500).json({ message: err.message || 'Server Error' })
})

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    console.log('✅ MongoDB connected')
    const port = process.env.PORT || 4004
    app.listen(port, () => {
      console.log(`🚀 Server listening on port ${port}`)
    })
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err)
    process.exit(1)
  })
