import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import UserModel from '../models/UserSchema';

export const register = async (req: Request, res: Response) => {
  const { email, password ,name} = req.body;
  try {
    const existing = await UserModel.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserModel({ email, password: hashedPassword,name});
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    console.log('Login attempt:', { email, password });
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    console.log('User found:', user);
    const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: '8h' });
    console.log('Token generated:', token);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
