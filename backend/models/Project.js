const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
  title: { type: String, required: true },
  fundingAgency: { type: String, required: true },
  amount: { type: Number },
  duration: { type: String },
  status: { type: String, enum: ['Ongoing', 'Completed'], default: 'Ongoing' },
  role: { type: String, default: 'Principal Investigator' }, // PI, Co-PI, etc.
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
