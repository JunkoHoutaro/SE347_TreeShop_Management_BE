const mongoose = require('mongoose');
// const DB_CONNECTION_STRING = 'mongodb+srv://junko:090702@se347.bzdix.mongodb.net/?retryWrites=true&w=majority&appName=SE347'
require('dotenv').config(); 
const connectDB = async () => {
    try { console.log(process.env.DB_CONNECTION_STRING)
        await mongoose.connect(DB_CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('DB connected');
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
};

module.exports = connectDB;