import express from 'express';
import Alert from '../models/Alert.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all alerts
router.get('/', async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching alerts', error });
  }
});

// Create alert (Admin only)
router.post('/', verifyAdmin, async (req, res) => {
  const { title, message } = req.body;
  try {
    const newAlert = new Alert({ title, message });
    await newAlert.save();
    res.status(201).json(newAlert);
  } catch (error) {
    res.status(500).json({ message: 'Error creating alert', error });
  }
});

// Update alert (Admin only)
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const updatedAlert = await Alert.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedAlert);
  } catch (error) {
    res.status(500).json({ message: 'Error updating alert', error
