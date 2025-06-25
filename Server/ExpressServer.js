
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import db from '../DB/dbConnection.js';
import UserRouter from './Routes/Users.js';
import PostRouter from './Routes/Posts.js';
import CommentRouter from './Routes/Comments.js';
import ChatRouter from './Routes/Chat.js';
import calendarRouter from './Routes/Calendar.js';
import notificationRouter from './Routes/Notification.js';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { setupSocket } from './socketHandlers/SetupSocket.js';

dotenv.config();

const app = express();
const port = process.env.PORT;

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  }
});

setupSocket(io); 
app.set('io', io);

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

app.use('/users', UserRouter);
app.use('/posts', PostRouter);
app.use('/comments', CommentRouter);
app.use('/chat', ChatRouter);
app.use('/api/calendar', calendarRouter);
app.use('/api/notification', notificationRouter);


server.listen(port, () => {
    console.log(`Server with Socket.IO is running on http://localhost:${port}`);
});
