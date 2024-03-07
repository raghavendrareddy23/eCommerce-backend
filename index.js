const express = require('express');
const mongoose = require('mongoose');
// const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes')
const subCategoryRoutes = require('./routes/subCategoryRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishListRoutes = require('./routes/wishListRoutes');
const addressRoutes = require('./routes/addressRoutes');
const orderRoutes = require('./routes/orderRoutes');
const dotenv = require("dotenv");
const connectDB = require('./utils/db');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
// app.use('/admin', adminRoutes);
app.use('/user', userRoutes);
app.use('/category', categoryRoutes);
app.use('/subcategory', subCategoryRoutes);
app.use('/product', productRoutes);
app.use('/cart', cartRoutes);
app.use('/wishlist', wishListRoutes);
app.use('/address', addressRoutes);
app.use('/orders', orderRoutes);


connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
