import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { connectToDatabase } from '../DB/dbConnection.js';
import UserRouter from './Routes/Users.js';
import PostRouter from './Routes/Posts.js';

const app = express();
const port = 3000;

const db = await connectToDatabase();
app.use(cors({
    origin: 'http://localhost:5173'
  }));
app.use(express.json());
app.use((req, res, next) => {
    req.db = db;
    next();
});
app.use('/posts', PostRouter);  
app.use('/users', UserRouter);

import cors from 'cors';



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
