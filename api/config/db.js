const mongoose = require('mongoose');

// Connection to DB
const connectDB = async () => {
    const conn = await mongoose.connect(process.env.DB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
}

// Supress 'strictQuery' deprecation warning
mongoose.set('strictQuery', true);

module.exports = connectDB;