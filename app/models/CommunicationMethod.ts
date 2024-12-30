import mongoose from 'mongoose';

const CommunicationMethodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  sequence: { type: Number, required: true },
  mandatory: { type: Boolean, default: false },
});

export default mongoose.models.CommunicationMethod || mongoose.model('CommunicationMethod', CommunicationMethodSchema);
