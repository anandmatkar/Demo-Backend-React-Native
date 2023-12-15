import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectToDatabase } from './src/database/connection.js'; // Import the database connection function
import Router from './src/routes/indexRouter.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());

// Connect to the database
connectToDatabase();

// Middleware, routes, and server setup remain the same
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.static('uploads'));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use('/api/v1', Router);

app.get('/test', (req, res) => {
  res.status(200).json({
    msg: 'Ok',
  });
});
