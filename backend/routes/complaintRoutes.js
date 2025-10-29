const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect, admin } = require('../middleware/authMiddleware');
const {
  submitComplaint,
  getUserComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  searchComplaints,
  getAllComplaints,
  updateComplaintStatus,
  assignComplaint,
  addComment,
  getComplaintStats
} = require('../controllers/complaintController');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/complaints';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5 // Maximum 5 files
  }
});

// User routes (protected)
router.post('/submit', protect, upload.array('photos', 5), submitComplaint);
router.get('/my-complaints', protect, getUserComplaints);
router.get('/search', protect, searchComplaints);
router.get('/:id', protect, getComplaintById);
router.put('/:id', protect, upload.array('photos', 5), updateComplaint);
router.delete('/:id', protect, deleteComplaint);

// Admin routes (protected + admin only)
router.get('/admin/all', protect, admin, getAllComplaints);
router.put('/admin/:id/status', protect, admin, updateComplaintStatus);
router.put('/admin/:id/assign', protect, admin, assignComplaint);
router.get('/admin/stats', protect, admin, getComplaintStats);

// Communication routes
router.post('/:id/comments', protect, addComment);

module.exports = router;
