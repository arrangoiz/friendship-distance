const express = require('express');
require('dotenv').config();
const port = process.env.PORT || 3000;
const connectDB = require('./config/db');

connectDB();

const app = express();

// Body parser middleware handler
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Catch requests to root path
app.get('/', (req, res) => {
    res.send({ message: 'Welcome to Couchsurfing API!' });
});

// Route CRUD requests for Users
const userRouter = require('./routes/users');
app.use('/api/users', userRouter);

app.listen(port, () => {
    console.log(`server listening on port ${port}`);
});