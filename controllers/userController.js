const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");

exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let role = 'user';
    if (user.role === 'admin') {
      role = 'admin';
    }

    // Check the user's role before attempting to login
    if (role === 'admin') {
      await adminLogin(req, res, user, password);
    } else {
      await userLogin(req, res, user, password);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const userLogin = async (req, res, user, password) => {
  try {
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id, role: 'user' }, process.env.JWT_SECRET);

    res.status(200).json({ token, username: user.username, role: 'user' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const adminLogin = async (req, res, user, password) => {
  try {
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id, role: 'admin' }, process.env.JWT_SECRET);

    res.status(200).json({ token, username: user.username, role: 'admin' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

