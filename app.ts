import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import mainRoutes from './routes/main';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import cookie from 'cookie-parser';
import { auth } from './middleware/auth';
import profileRoutes from './routes/profile';
import { notFound } from './middleware/error';

const app = express();

app.use(cors({ credentials: true }));
app.use(cookie());
app.use(morgan('short'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(auth());

app.use('/', mainRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/profile', profileRoutes);

app.use(notFound);

export default app;
