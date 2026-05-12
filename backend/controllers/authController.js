const Faculty = require('../models/Faculty');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password, department, designation } = req.body;
    
    let faculty = await Faculty.findOne({ email });
    if (faculty) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    faculty = new Faculty({
      name,
      email,
      password: hashedPassword,
      department,
      designation
    });

    await faculty.save();
    
    const token = jwt.sign({ id: faculty._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    res.status(201).json({ token, faculty: { id: faculty._id, name, email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const faculty = await Faculty.findOne({ email });
    if (!faculty) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, faculty.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: faculty._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    res.json({ token, faculty: { id: faculty._id, name: faculty.name, email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
