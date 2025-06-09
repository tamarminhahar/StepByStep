// import dotenv from 'dotenv';
// dotenv.config();

// import express from 'express';
// // import { connectToDatabase } from '../DB/dbConnection.js';
// import UserRouter from './Routes/Users.js';
// import db from '../DB/dbConnection.js';

// const app = express();
// const port = 3000;

// // const db = await connectToDatabase();

// app.use(express.json());
// app.use((req, res, next) => {
//     req.db = db;
//     next();
// });

// import cors from 'cors';

// app.use(cors({
//     origin: 'http://localhost:5173'
//   }));

// app.use('/users', UserRouter);


// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });
import express from 'express';
import db from '../DB/dbConnection.js';
import UserRouter from './Routes/Users.js';

const app = express();
const port = 3000;

app.use(express.json());

app.use((req, res, next) => {
    req.db = db;
    next();
});

import cors from 'cors';

app.use(cors({
    origin: 'http://localhost:5173'
}));

app.use('/users', UserRouter);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
