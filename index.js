const express = require('express');
const mongoose = require('mongoose');
// const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes')
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


connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
