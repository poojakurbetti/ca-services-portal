import express from 'express';
import Order from '../models/Order.js';
import { protect, verifyAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create new order (checkout)
router.post('/', protect, async (req, res) => {
  try {
    const { services, totalPrice } = req.body;

    if (!services || services.length === 0) {
      return res.status(400).json({ message: 'No services in order' });
    }

    const order = new Order({
      user: req.user._id,
      services,
      totalPrice,
      status: 'pending',
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get logged-in user orders
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('services.serviceId', 'title price');
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get all orders
router.get('/', protect, verifyAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('services.serviceId', 'title price');
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Update order status
router.put('/:id/status', protect, verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status || order.status;
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
