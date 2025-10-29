const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    titleBangla: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: true,
    },
    descriptionBangla: {
      type: String,
      required: false,
    },
    language: {
      type: String,
      enum: ['English', 'Bangla', 'Both'],
      default: 'English',
    },
    photos: [{
      url: {
        type: String,
        required: true,
      },
      filename: String,
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    location: {
      type: String,
      required: true,
    },
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
    area: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        // Natural Disasters
        'Flood', 'Earthquake', 'Landslide', 'Drought', 'Storm', 'Wildfire',
        // Local Issues
        'Road', 'Water', 'Electricity', 'Sanitation', 'Education', 'Healthcare', 'Environment',
        // Accidents
        'Traffic Accident', 'Building Collapse', 'Gas Leak', 'Fire Incident', 'Medical Emergency',
        // Other
        'Other'
      ],
    },
    subCategory: {
      type: String,
      enum: [
        // Natural Disasters
        'Minor', 'Moderate', 'Severe', 'Critical',
        // Local Issues
        'Infrastructure', 'Service', 'Maintenance', 'Development',
        // Accidents
        'Minor Injury', 'Major Injury', 'Property Damage', 'No Injury',
        // Other
        'General'
      ],
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Pending', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Cancelled'],
      default: 'Pending',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    assignedAt: {
      type: Date,
    },
    resolvedAt: {
      type: Date,
    },
    adminNotes: {
      type: String,
    },
    estimatedResolutionTime: {
      type: Number, // in hours
    },
    actualResolutionTime: {
      type: Number, // in hours
    },
    // For tracking assignment history
    assignmentHistory: [{
      assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      assignedAt: {
        type: Date,
        default: Date.now,
      },
      notes: String,
    }],
    // For tracking status changes
    statusHistory: [{
      status: String,
      changedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      changedAt: {
        type: Date,
        default: Date.now,
      },
      notes: String,
    }],
    // For admin-complainant communication
    comments: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
      isAdmin: {
        type: Boolean,
        default: false,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
    // For search and analytics
    tags: [String],
    isUrgent: {
      type: Boolean,
      default: false,
    },
    canEdit: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Index for better search performance
complaintSchema.index({ location: 'text', area: 'text', title: 'text', description: 'text' });
complaintSchema.index({ user: 1, createdAt: -1 });
complaintSchema.index({ status: 1, priority: 1 });
complaintSchema.index({ area: 1, category: 1 });

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint; 