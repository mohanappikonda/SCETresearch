const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  bio: { type: String },
  researchInterests: [{ type: String }],
  image: { type: String, default: '' },
  profileImage: { type: String },
  socialLinks: {
    googleScholar: { type: String },
    linkedIn: { type: String },
    researchGate: { type: String },
    orcid: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('Faculty', facultySchema);
