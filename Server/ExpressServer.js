import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import db from '../DB/dbConnection.js';
import UserRouter from './Routes/Users.js';
import PostRouter from './Routes/Posts.js';
import CommentRouter from './Routes/Comments.js';
// import ProfileRouter from './Routes/Profiles.js';
dotenv.config();

const app = express();
dotenv.config();
const port = process.env.PORT ;
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
app.use('/comments', CommentRouter);



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
