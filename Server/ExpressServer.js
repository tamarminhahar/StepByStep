import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import db from '../DB/dbConnection.js';
import UserRouter from './Routes/Users.js';
import PostRouter from './Routes/Posts.js';
import CommentRouter from './Routes/Comments.js';
import cookieParser from 'cookie-parser';



dotenv.config();

const app = express();
app.use(cookieParser());

dotenv.config();
const port = 3000; 
app.use(cors({
    origin: 'http://localhost:5173',
     credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

app.use((req, res, next) => {
    
    req.db = db;
    next();
});
app.use('/posts', PostRouter);  
app.use('/users', UserRouter);
app.use('/comments', CommentRouter);



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
