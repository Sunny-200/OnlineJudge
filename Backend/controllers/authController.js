const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.status(200).json({ token, user: { id: existingUser._id, name: existingUser.name, email: existingUser.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
