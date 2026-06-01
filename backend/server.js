import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import testRoutes from './routes/testRoutes.js';

dotenv.config();

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tests', testRoutes);

// Base Route
app.get('/', (req, res) => {
  res.send('RankFlow API running successfully.');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in production mode on port ${PORT}`);
});