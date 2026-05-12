const mongoose = require('mongoose');

const publicationSchema = new mongoose.Schema({
  facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
  title: { type: String, required: true },
  authors: { type: String, required: true },
  venue: { type: String, required: true }, // Journal or Conference Name
  year: { type: Number, required: true },
  type: { type: String, enum: ['Journal', 'Conference', 'Book', 'Book Chapter'], default: 'Journal' },
  doi: { type: String },
  link: { type: String },
  abstract: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Publication', publicationSchema);
