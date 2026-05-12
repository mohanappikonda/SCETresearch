const mongoose = require('mongoose');

const nptelSchema = new mongoose.Schema({
  facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
  courseName: { type: String, required: true },
  year: { type: Number, required: true },
  session: { type: String, enum: ['Jan-Apr', 'Jul-Oct'], default: 'Jan-Apr' },
  score: { type: Number },
  certificateType: { type: String, enum: ['Elite', 'Elite+Silver', 'Elite+Gold', 'Successfully Completed'], default: 'Elite' }
}, { timestamps: true });

module.exports = mongoose.model('Nptel', nptelSchema);
