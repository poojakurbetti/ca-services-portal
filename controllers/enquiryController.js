import Enquiry from '../models/Enquiry.js';

// @desc    Create a new enquiry
// @route   POST /api/enquiries
// @access  Public
export const createEnquiry = async (req, res) => {
  try {
    const { name, email, phone, message, serviceId } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const enquiry = new Enquiry({
      name,
      email,
      phone,
      message,
      service: serviceId || null,
      status: 'pending',
    });

    const createdEnquiry = await enquiry.save();
    res.status(201).json(createdEnquiry);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create enquiry', error: error.message });
  }
};

// @desc    Get all enquiries
// @route   GET /api/enquiries
// @access  Admin
export const getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().populate('service', 'title price');
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch enquiries', error: error.message });
  }
};

// @desc    Get single enquiry by ID
// @route   GET /api/enquiries/:id
// @access  Admin
export const getEnquiryById = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id).populate('service', 'title price');
    if (enquiry) {
      res.json(enquiry);
    } else {
      res.status(404).json({ message: 'Enquiry not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch enquiry', error: error.message });
  }
};

// @desc    Update enquiry status
// @route   PUT /api/enquiries/:id
// @access  Admin
export const updateEnquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const enquiry = await Enquiry.findById(req.params.id);

    if (enquiry) {
      enquiry.status = status || enquiry.status;
      const updatedEnquiry = await enquiry.save();
      res.json(updatedEnquiry);
    } else {
      res.status(404).json({ message: 'Enquiry not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update enquiry', error: error.message });
  }
};

// @desc    Delete an enquiry
// @route   DELETE /api/enquiries/:id
// @access  Admin
export const deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);

    if (enquiry) {
      await enquiry.deleteOne();
      res.json({ message: 'Enquiry removed' });
    } else {
      res.status(404).json({ message: 'Enquiry not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete enquiry', error: error.message });
  }
};
