import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  linkedInProfile: { type: String },
  emails: [{ type: String }],
  phoneNumbers: [{ type: String }],
  comments: { type: String },
  communicationPeriodicity: { type: Number, default: 14 },
  highlightDisabled: { type: Boolean, default: false },
});

export default mongoose.models.Company || mongoose.model('Company', CompanySchema);
