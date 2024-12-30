const mongoose = require('mongoose');
require('dotenv').config(); 

const connectDB = async () => {
    try {
        const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING;
        if (!DB_CONNECTION_STRING) {
            throw new Error('DB_CONNECTION_STRING is not defined in the environment variables.');
        }

        await mongoose.connect(DB_CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('DB connected');
    } catch (error) {
        console.error('Error connecting to database:', error.message);
        process.exit(1); // Dừng ứng dụng nếu kết nối thất bại
    }
};

module.exports = connectDB;
