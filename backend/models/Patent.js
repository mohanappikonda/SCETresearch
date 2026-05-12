const mongoose = require('mongoose');

const patentSchema = new mongoose.Schema({
  facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
  title: { type: String, required: true },
  applicationNumber: { type: String, required: true },
  dateOfFiling: { type: Date },
  status: { type: String, enum: ['Published', 'Granted', 'Filed'], default: 'Filed' },
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Patent', patentSchema);
