import express from 'express';
import { protect, verifyAdmin } from '../middleware/authMiddleware.js';
import Enquiry from '../models/Enquiry.js';
import { sendEnquiryNotification } from '../utils/notify.js';

const router = express.Router();

// @desc    Create a new enquiry
// @route   POST /api/enquiries
// @access  Public
router.post('/', async (req, res) => {
  try {
    const enquiry = new Enquiry(req.body);
    await enquiry.save();

    // Send notification after saving
    sendEnquiryNotification(enquiry);

    res.status(201).json(enquiry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Get all enquiries (admin only)
// @route   GET /api/enquiries
// @access  Private/Admin
router.get('/', protect, verifyAdmin, async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update enquiry status
// @route   PUT /api/enquiries/:id
// @access  Private/Admin
router.put('/:id', protect, verifyAdmin, async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }
    enquiry.status = req.body.status || enquiry.status;
    await enquiry.save();
    res.json(enquiry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete an enquiry
// @route   DELETE /api/enquiries/:id
// @access  Private/Admin
router.delete('/:id', protect, verifyAdmin, async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }
    await enquiry.remove();
    res.json({ message: 'Enquiry removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
