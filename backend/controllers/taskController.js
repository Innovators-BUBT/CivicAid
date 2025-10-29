const Task = require('../models/Task');
const User = require('../models/User');
const Complaint = require('../models/Complaint');

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private/Admin
exports.createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      priority,
      location,
      requiredSkills,
      estimatedDuration,
      dueDate,
      complaintId
    } = req.body;

    const task = await Task.create({
      title,
      description,
      category,
      priority,
      location,
      requiredSkills,
      estimatedDuration,
      dueDate,
      assignedBy: req.user._id,
      complaint: complaintId
    });

    const populatedTask = await Task.findById(task._id)
      .populate('assignedBy', 'name email')
      .populate('assignedTo', 'name email role');

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all tasks (admin only)
// @route   GET /api/tasks
// @access  Private/Admin
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({})
      .populate('assignedBy', 'name email')
      .populate('assignedTo', 'name email role')
      .populate('complaint', 'title description')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get available volunteers/NGOs for task assignment
// @route   GET /api/tasks/available-assignees
// @access  Private/Admin
exports.getAvailableAssignees = async (req, res) => {
  try {
    const { skills, category } = req.query;
    
    let query = {
      role: { $in: ['volunteer', 'ngo'] },
      status: 'available',
      currentTask: null
    };

    // Filter by skills if provided
    if (skills) {
      const skillArray = skills.split(',');
      query.skills = { $in: skillArray };
    }

    const availableAssignees = await User.find(query)
      .select('name email role skills location organizationName volunteerType')
      .sort({ createdAt: -1 });

    res.json(availableAssignees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign task to volunteer/NGO
// @route   PUT /api/tasks/:id/assign
// @access  Private/Admin
exports.assignTask = async (req, res) => {
  try {
    const { assigneeId } = req.body;
    const taskId = req.params.id;

    // Check if assignee is available
    const assignee = await User.findById(assigneeId);
    if (!assignee || assignee.status !== 'available' || assignee.currentTask) {
      return res.status(400).json({ message: 'Assignee is not available' });
    }

    // Update task
    const task = await Task.findByIdAndUpdate(
      taskId,
      {
        assignedTo: assigneeId,
        status: 'Assigned',
        startDate: new Date()
      },
      { new: true }
    ).populate('assignedTo', 'name email role');

    // Update assignee status
    await User.findByIdAndUpdate(assigneeId, {
      status: 'busy',
      currentTask: taskId
    });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update task progress
// @route   PUT /api/tasks/:id/progress
// @access  Private (Assigned volunteer/NGO)
exports.updateTaskProgress = async (req, res) => {
  try {
    const { progress, notes } = req.body;
    const taskId = req.params.id;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if user is assigned to this task
    if (task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    const updateData = {
      progress,
      volunteerNotes: notes
    };

    // If progress is 100%, mark as completed
    if (progress === 100) {
      updateData.status = 'Completed';
      updateData.completedDate = new Date();
    } else if (progress > 0) {
      updateData.status = 'In Progress';
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      updateData,
      { new: true }
    ).populate('assignedTo', 'name email role');

    // If task is completed, update assignee status
    if (progress === 100) {
      await User.findByIdAndUpdate(req.user._id, {
        status: 'available',
        currentTask: null,
        $push: { completedTasks: taskId }
      });
    }

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's assigned tasks
// @route   GET /api/tasks/my-tasks
// @access  Private
exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id })
      .populate('assignedBy', 'name email')
      .populate('complaint', 'title description')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Private
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedBy', 'name email')
      .populate('assignedTo', 'name email role')
      .populate('complaint', 'title description');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update task (admin only)
// @route   PUT /api/tasks/:id
// @access  Private/Admin
exports.updateTask = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      priority,
      location,
      requiredSkills,
      estimatedDuration,
      dueDate,
      adminNotes
    } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update task fields
    Object.assign(task, {
      title: title || task.title,
      description: description || task.description,
      category: category || task.category,
      priority: priority || task.priority,
      location: location || task.location,
      requiredSkills: requiredSkills || task.requiredSkills,
      estimatedDuration: estimatedDuration || task.estimatedDuration,
      dueDate: dueDate || task.dueDate,
      adminNotes: adminNotes || task.adminNotes
    });

    const updatedTask = await task.save();
    const populatedTask = await Task.findById(updatedTask._id)
      .populate('assignedBy', 'name email')
      .populate('assignedTo', 'name email role');

    res.json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // If task is assigned, free up the assignee
    if (task.assignedTo) {
      await User.findByIdAndUpdate(task.assignedTo, {
        status: 'available',
        currentTask: null
      });
    }

    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get task statistics
// @route   GET /api/tasks/stats
// @access  Private/Admin
exports.getTaskStats = async (req, res) => {
  try {
    const total = await Task.countDocuments();
    const pending = await Task.countDocuments({ status: 'Pending' });
    const assigned = await Task.countDocuments({ status: 'Assigned' });
    const inProgress = await Task.countDocuments({ status: 'In Progress' });
    const completed = await Task.countDocuments({ status: 'Completed' });

    const categoryStats = await Task.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    const availableVolunteers = await User.countDocuments({
      role: { $in: ['volunteer', 'ngo'] },
      status: 'available'
    });

    const busyVolunteers = await User.countDocuments({
      role: { $in: ['volunteer', 'ngo'] },
      status: 'busy'
    });

    res.json({
      total,
      pending,
      assigned,
      inProgress,
      completed,
      categoryStats,
      availableVolunteers,
      busyVolunteers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 