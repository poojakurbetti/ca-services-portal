import express from 'express';
import { protect, verifyAdmin } from '../middleware/authMiddleware.js';
import Service from '../models/Service.js';

const router = express.Router();

// @desc Create a new service
// @route POST /api/services
// @access Private/Admin
router.post('/', protect, verifyAdmin, async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc Get all services
// @route GET /api/services
// @access Public
router.get('/', async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Get single service by ID
// @route GET /api/services/:id
// @access Public
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Update a service
// @route PUT /api/services/:id
// @access Private/Admin
router.put('/:id', protect, verifyAdmin, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    Object.assign(service, req.body);
    await service.save();
    res.json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc Delete a service
// @route DELETE /api/services/:id
// @access Private/Admin
router.delete('/:id', protect, verifyAdmin, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    await service.remove();
    res.json({ message: 'Service removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
