import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// User Register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password,} = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Form data is missing...' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // Don't hash here - let the pre-save hook handle it
    const newUser = await User.create({
      name,
      email,
      password, // Send plain password, pre-save hook will hash it
      role:'user',
    });
    
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      } // Don't send back password
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User Login (stays the same)
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email' });

    const match = await bcrypt.compare(password, user.password);
    
    if (!match) return res.status(401).json({ message: 'Incorrect password' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({ 
      message: 'Login successful', 
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      } // Don't send back password
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};