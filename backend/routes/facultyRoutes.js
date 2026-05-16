const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const facultyController = require('../controllers/facultyController');
const auth = require('../middleware/authMiddleware');

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });
const memoryUpload = multer({ storage: multer.memoryStorage() });

// Faculty Profile Routes
router.get('/', facultyController.getAllFaculty);
router.get('/stats', facultyController.getStats);
router.get('/:email', facultyController.getFacultyProfile);
router.post('/update', auth, facultyController.updateFacultyProfile);

// Image Upload
router.post('/upload', auth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const port = process.env.PORT || 5001;
  res.json({ imageUrl: `http://localhost:${port}/uploads/${req.file.filename}` });
});

// Publications & Projects
router.post('/publications', auth, facultyController.addPublication);
router.post('/projects', auth, facultyController.addProject);
router.post('/patents', auth, facultyController.addPatent);
router.post('/workshops', auth, facultyController.addWorkshop);
router.post('/nptel', auth, facultyController.addNptel);
router.post('/bulk-import', auth, memoryUpload.single('file'), facultyController.bulkImportPublications);

module.exports = router;
