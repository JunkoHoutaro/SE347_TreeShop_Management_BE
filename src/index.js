const express = require('express');
const parseFilters = require('./middleware/parseFilters');
const parseSorts = require('./middleware/parseSorts');
require('dotenv').config();
const corsConfig = require('./configs/cors');
const connectDB = require('./configs/db');
const configCloudinary = require('./configs/cloudinary')
const route = require('./routes');

// Kết nối database
connectDB();
configCloudinary();
// Khởi tạo ứng dụng Express
const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(corsConfig);

// Middleware cho bộ lọc và sắp xếp
app.use(parseFilters, parseSorts);

// Định nghĩa route
app.use('/api', route);
app.get('/', (req, res) => {
    res.json('Hello world 12345!');
});

console.log(process.env.PORT);
const PORT = process.env.PORT || 302;
app.listen(PORT, () => {
    console.log(`Example app listening on PORT ${PORT}`);
});
