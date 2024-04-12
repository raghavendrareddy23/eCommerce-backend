const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const subCategoryRoutes = require('./routes/subCategoryRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishListRoutes = require('./routes/wishListRoutes');
const addressRoutes = require('./routes/addressRoutes');
const orderRoutes = require('./routes/orderRoutes');
const orderController = require('./controllers/orderController');
const couponRoutes = require('./routes/couponRoutes');
const dotenv = require("dotenv");
const connectDB = require('./utils/db');
const cors = require('cors');
const cron = require('cron'); 

const app = express();

// Middleware
app.use(express.json({
    verify: (req, res, buf) => {
        if (req.originalUrl.startsWith('/orders/webhook/stripe')) {
            req.rawBody = buf.toString();
        }
    },
}));
app.use(cors());

app.use('/user', userRoutes);
app.use('/category', categoryRoutes);
app.use('/subcategory', subCategoryRoutes);
app.use('/product', productRoutes);
app.use('/cart', cartRoutes);
app.use('/wishlist', wishListRoutes);
app.use('/address', addressRoutes);
app.use('/orders', orderRoutes);
app.use('/coupon', couponRoutes);
app.post('/orders/webhook/stripe', orderController.webhook);

connectDB();

const job = new cron.CronJob('*/12 * * * *', () => {
    console.log('Cron job is running every 12 minutes in India...');
}, null, true, 'Asia/Kolkata'); 

job.start();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
