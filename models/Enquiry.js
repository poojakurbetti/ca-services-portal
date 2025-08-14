import mongoose from 'mongoose';
import { protect, verifyAdmin } from '../middleware/authMiddleware.js';

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String },
    services: [
      {
        serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
        title: String,
        price: Number
      }
    ],
    status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' }
  },
  { timestamps: true }
);

const Enquiry = mongoose.model('Enquiry', enquirySchema);
export default Enquiry;
