const mongoose = require('mongoose');

const workshopSchema = new mongoose.Schema({
  facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
  title: { type: String, required: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ['Organised', 'Attended'], default: 'Organised' },
  duration: { type: String }, // e.g. "3 Days"
  venue: { type: String },
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Workshop', workshopSchema);
