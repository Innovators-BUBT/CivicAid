const Complaint = require('../models/Complaint');
const User = require('../models/User');

// Submit a new complaint
exports.submitComplaint = async (req, res) => {
  try {
    const {
      title,
      titleBangla,
      description,
      descriptionBangla,
      language,
      location,
      coordinates,
      area,
      category,
      subCategory,
      priority,
      tags
    } = req.body;

    const complaintData = {
      title,
      description,
      location,
      area,
      category,
      subCategory,
      priority: priority || 'Medium',
      user: req.user.id,
      tags: tags || [],
      language: language || 'English'
    };

    // Add Bangla fields if provided
    if (titleBangla) complaintData.titleBangla = titleBangla;
    if (descriptionBangla) complaintData.descriptionBangla = descriptionBangla;
    if (coordinates) complaintData.coordinates = coordinates;

    // Add photos if uploaded
    if (req.files && req.files.length > 0) {
      complaintData.photos = req.files.map(file => ({
        url: file.path,
        filename: file.originalname
      }));
    }

    const complaint = await Complaint.create(complaintData);

    // Populate user info for response
    await complaint.populate('user', 'name email');

    res.status(201).json({
      success: true,
      data: complaint,
      message: 'Complaint submitted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting complaint',
      error: error.message
    });
  }
};

// Get all complaints for a user
exports.getUserComplaints = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category } = req.query;
    const skip = (page - 1) * limit;

    const filter = { user: req.user.id };
    if (status) filter.status = status;
    if (category) filter.category = category;

    const complaints = await Complaint.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('assignedTo', 'name role');

    const total = await Complaint.countDocuments(filter);

    res.json({
      success: true,
      data: complaints,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching complaints',
      error: error.message
    });
  }
};

// Get a single complaint by ID
exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('assignedTo', 'name role')
      .populate('assignedBy', 'name role')
      .populate('comments.user', 'name role');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Check if user can access this complaint
    if (complaint.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: complaint
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching complaint',
      error: error.message
    });
  }
};

// Update a complaint (only if it can be edited)
exports.updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Check if user can edit this complaint
    if (complaint.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own complaints'
      });
    }

    if (!complaint.canEdit) {
      return res.status(400).json({
        success: false,
        message: 'This complaint cannot be edited anymore'
      });
    }

    // Only allow editing certain fields
    const allowedUpdates = ['title', 'titleBangla', 'description', 'descriptionBangla', 'location', 'area', 'category', 'subCategory', 'priority', 'tags'];
    const updates = {};

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Add new photos if uploaded
    if (req.files && req.files.length > 0) {
      const newPhotos = req.files.map(file => ({
        url: file.path,
        filename: file.originalname
      }));
      updates.photos = [...complaint.photos, ...newPhotos];
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    res.json({
      success: true,
      data: updatedComplaint,
      message: 'Complaint updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating complaint',
      error: error.message
    });
  }
};

// Delete a complaint
exports.deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Check if user can delete this complaint
    if (complaint.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own complaints'
      });
    }

    // Only allow deletion if complaint is still pending
    if (complaint.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete complaint that is already being processed'
      });
    }

    await Complaint.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Complaint deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting complaint',
      error: error.message
    });
  }
};

// Search complaints by location/area
exports.searchComplaints = async (req, res) => {
  try {
    const { q, area, category, status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const filter = { user: req.user.id };

    if (q) {
      filter.$text = { $search: q };
    }
    if (area) filter.area = area;
    if (category) filter.category = category;
    if (status) filter.status = status;

    const complaints = await Complaint.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('assignedTo', 'name role');

    const total = await Complaint.countDocuments(filter);

    res.json({
      success: true,
      data: complaints,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching complaints',
      error: error.message
    });
  }
};

// Admin: Get all complaints
exports.getAllComplaints = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const { page = 1, limit = 20, status, priority, category, area, assignedTo } = req.query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (area) filter.area = area;
    if (assignedTo) filter.assignedTo = assignedTo;

    const complaints = await Complaint.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'name email phone')
      .populate('assignedTo', 'name role')
      .populate('assignedBy', 'name role');

    const total = await Complaint.countDocuments(filter);

    res.json({
      success: true,
      data: complaints,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching complaints',
      error: error.message
    });
  }
};

// Admin: Update complaint status
exports.updateComplaintStatus = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const { status, adminNotes, estimatedResolutionTime } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    const updates = {};
    if (status) {
      updates.status = status;
      updates.statusHistory = [
        ...complaint.statusHistory,
        {
          status,
          changedBy: req.user.id,
          notes: adminNotes || ''
        }
      ];
    }
    if (adminNotes) updates.adminNotes = adminNotes;
    if (estimatedResolutionTime) updates.estimatedResolutionTime = estimatedResolutionTime;

    // Set resolvedAt if status is resolved
    if (status === 'Resolved') {
      updates.resolvedAt = new Date();
      if (complaint.assignedAt) {
        updates.actualResolutionTime = Math.round((Date.now() - complaint.assignedAt.getTime()) / (1000 * 60 * 60));
      }
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    res.json({
      success: true,
      data: updatedComplaint,
      message: 'Complaint status updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating complaint status',
      error: error.message
    });
  }
};

// Admin: Assign complaint to department/user
exports.assignComplaint = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const { assignedTo, notes } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Verify assigned user exists and has appropriate role
    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser || !['admin', 'volunteer'].includes(assignedUser.role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user assignment'
      });
    }

    const updates = {
      assignedTo,
      assignedBy: req.user.id,
      assignedAt: new Date(),
      status: 'Assigned'
    };

    if (notes) {
      updates.assignmentHistory = [
        ...complaint.assignmentHistory,
        {
          assignedTo,
          assignedBy: req.user.id,
          notes
        }
      ];
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('user', 'name email').populate('assignedTo', 'name role');

    res.json({
      success: true,
      data: updatedComplaint,
      message: 'Complaint assigned successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error assigning complaint',
      error: error.message
    });
  }
};

// Add comment to complaint
exports.addComment = async (req, res) => {
  try {
    const { message } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Check if user can comment on this complaint
    if (complaint.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const comment = {
      user: req.user.id,
      message,
      isAdmin: req.user.role === 'admin'
    };

    complaint.comments.push(comment);
    await complaint.save();

    await complaint.populate('comments.user', 'name role');

    res.json({
      success: true,
      data: complaint.comments[complaint.comments.length - 1],
      message: 'Comment added successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding comment',
      error: error.message
    });
  }
};

// Get complaint statistics
exports.getComplaintStats = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const stats = await Complaint.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0] } },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0] } },
          urgent: { $sum: { $cond: [{ $eq: ['$priority', 'Urgent'] }, 1, 0] } }
        }
      }
    ]);

    const areaStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$area',
          count: { $sum: 1 },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0] } }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const categoryStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {},
        byArea: areaStats,
        byCategory: categoryStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
}; 