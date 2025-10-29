const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'volunteer', 'ngo'],
      default: 'user',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'busy', 'available'],
      default: 'active',
    },
    // Password reset fields
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    // For volunteers and NGOs
    skills: [{
      type: String,
    }],
    location: {
      type: String,
    },
    phone: {
      type: String,
    },
    // For NGOs
    organizationName: {
      type: String,
    },
    organizationType: {
      type: String,
    },
    // For volunteers
    volunteerType: {
      type: String,
      enum: ['individual', 'group'],
    },
    // Current task assignment
    currentTask: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
    },
    // Task history
    completedTasks: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
    }],
    // Profile information
    bio: {
      type: String,
    },
    profileImage: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
