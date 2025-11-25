import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js'; //User model

const router = Router();

/**
 The login and registration system's routing file.
 */

// Register a new user
router.post(
  '/register',
  [// Validation rules
    body('name')
      .isString()
      .isLength({ min: 2 })
      .withMessage('Name must be at least 2 characters'),
    body('email')
      .isEmail()
      .withMessage('Invalid email address'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    try {
      // Check validations
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password } = req.body;

      // Check if email is already registered
      const existing = await User.findOne({ email });
      if (existing) {
      return res.status(409).json({ error: 'This email is already registered in the system' });      }

      // Encrypt the password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Create the user in the database
      const user = await User.create({
        name,
        email,
        passwordHash,
        role: 'user', //Creator acting as a regular user
      });

      // Create a JWT token for the new user
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role ,name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
      );

      // Return the user data and token without a password
      res.status(201).json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error during registration ' });
    }
  }
);


// User login
 
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password required'),
  ],
  async (req, res) => {
    try {
      // Check validations
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
      return res.status(401).json({ error: 'Incorrect email or password' });      }

      // Check password
      const passwordOk = await bcrypt.compare(password, user.passwordHash);
      if (!passwordOk) {
      return res.status(401).json({ error: 'Incorrect email or password' });      }

      // Create JWT token
      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role ,name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
      );

      res.json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error while connecting' });    }
  }
);

export default router;
