import mongoose from 'mongoose';

const CommunicationSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  methodId: { type: mongoose.Schema.Types.ObjectId, ref: 'CommunicationMethod', required: true },
  date: { type: Date, required: true },
  notes: { type: String },
});

export default mongoose.models.Communication || mongoose.model('Communication', CommunicationSchema);
