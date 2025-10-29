const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

const volunteer = (req, res, next) => {
  if (req.user && req.user.role === 'volunteer') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as a volunteer' });
  }
};

const ngo = (req, res, next) => {
  if (req.user && req.user.role === 'ngo') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an NGO' });
  }
};

const volunteerOrNgo = (req, res, next) => {
  if (req.user && (req.user.role === 'volunteer' || req.user.role === 'ngo')) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as a volunteer or NGO' });
  }
};

module.exports = { protect, admin, volunteer, ngo, volunteerOrNgo };
