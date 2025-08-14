import mongoose from 'mongoose';

const subServiceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number }, // optional for quote-based services
  },
  { _id: false }
);

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // main service title
    description: { type: String, required: true },
    price: { type: Number }, // keep optional for flexibility
    category: { type: String }, // optional for grouping services
    subServices: [subServiceSchema], // nested sub-services
  },
  { timestamps: true }
);

const Service = mongoose.model('Service', serviceSchema);
export default Service;
