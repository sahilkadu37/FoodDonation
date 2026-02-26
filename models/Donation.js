import mongoose from 'mongoose';

const DonationSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  expiryDate: { type: Date, required: false },  // now optional
  contactNumber: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Donation || mongoose.model('Donation', DonationSchema);
