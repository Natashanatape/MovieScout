const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const Joi = require('joi');

// Validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  username: Joi.string().min(3).max(30).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

class AuthController {
  static async register(req, res) {
    try {
      const { error } = registerSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { email, password, username } = req.body;

      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const user = await User.create({ email, password, username });
      const token = generateToken(user.id);

      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
        token,
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }

  static async login(req, res) {
    try {
      const { error } = loginSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { email, password } = req.body;

      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValidPassword = await User.verifyPassword(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = generateToken(user.id);

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role || 'user',
        },
        token,
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }

  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      const user = await User.findByEmail(email);
      if (!user) {
        // Don't reveal if user exists or not (security)
        return res.json({ message: 'If that email exists, a reset link has been sent' });
      }

      // Generate reset token
      const resetToken = require('crypto').randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

      // Save token to database
      await User.saveResetToken(user.id, resetToken, resetTokenExpiry);

      // Send email (for now just log it)
      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
      console.log('Password Reset Link:', resetLink);
      console.log('Send this link to:', email);

      res.json({ message: 'If that email exists, a reset link has been sent' });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ error: 'Failed to process request' });
    }
  }

  static async resetPassword(req, res) {
    try {
      const { token, password } = req.body;

      if (!token || !password) {
        return res.status(400).json({ error: 'Token and password required' });
      }

      // Find user by reset token
      const user = await User.findByResetToken(token);
      if (!user) {
        return res.status(400).json({ error: 'Invalid or expired reset token' });
      }

      // Update password
      await User.updatePassword(user.id, password);

      // Clear reset token
      await User.clearResetToken(user.id);

      res.json({ message: 'Password reset successful' });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ error: 'Failed to reset password' });
    }
  }

  static async getMe(req, res) {
    try {
      res.json({ user: req.user });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get user data' });
    }
  }
}

module.exports = AuthController;
