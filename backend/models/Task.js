const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Road', 'Water', 'Electricity', 'Sanitation', 'Education', 'Healthcare', 'Environment', 'Other'],
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Pending', 'Assigned', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    location: {
      type: String,
      required: true,
    },
    // Task assignment
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Task requirements
    requiredSkills: [{
      type: String,
    }],
    estimatedDuration: {
      type: Number, // in hours
    },
    // Task details
    startDate: {
      type: Date,
    },
    dueDate: {
      type: Date,
    },
    completedDate: {
      type: Date,
    },
    // Progress tracking
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    // Feedback and notes
    adminNotes: {
      type: String,
    },
    volunteerNotes: {
      type: String,
    },
    // Ratings and feedback
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    feedback: {
      type: String,
    },
    // Related complaint
    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
    },
  },
  { timestamps: true }
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task; 