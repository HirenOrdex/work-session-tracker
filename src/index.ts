import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { config } from './config';
import sessionRoutes from './routes/sessionRoutes';
import authRoutes from './routes/authRoutes'; // if using authentication

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/session', sessionRoutes);
app.use('/api/auth', authRoutes); // Enable if using login

mongoose.connect(config.mongoUri)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  })
  .catch(err => console.error('MongoDB error:', err));
