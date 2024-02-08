const Admin = require('../models/admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
const config = require('../config');

exports.adminSignup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({
      username,
      email,
      password: hashedPassword,
    });
    await admin.save();
    res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.adminLogin = async (req, res) => {
    try {
      const { username, password } = req.body;
      const admin = await Admin.findOne({ username });
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }
      const isValidPassword = await bcrypt.compare(password, admin.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid password" });
      }
      const token = jwt.sign({ adminId: admin._id }, config.JWT_SECRET);
      res.status(200).json({ token, username });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
