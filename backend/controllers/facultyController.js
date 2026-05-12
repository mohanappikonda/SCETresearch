const Faculty = require('../models/Faculty');
const Publication = require('../models/Publication');
const Project = require('../models/Project');
const Patent = require('../models/Patent');
const Workshop = require('../models/Workshop');
const Nptel = require('../models/Nptel');

// Get faculty profile with publications and projects
exports.getFacultyProfile = async (req, res) => {
  try {
    const faculty = await Faculty.findOne({ email: req.params.email });
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }

    const publications = await Publication.find({ facultyId: faculty._id }).sort({ year: -1 });
    const projects = await Project.find({ facultyId: faculty._id });
    const patents = await Patent.find({ facultyId: faculty._id });
    const workshops = await Workshop.find({ facultyId: faculty._id });
    const nptels = await Nptel.find({ facultyId: faculty._id });

    res.json({
      faculty,
      publications,
      projects,
      patents,
      workshops,
      nptels
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create or update faculty profile
exports.updateFacultyProfile = async (req, res) => {
  try {
    const { email } = req.body;
    const faculty = await Faculty.findOneAndUpdate(
      { email },
      req.body,
      { new: true, upsert: true }
    );
    res.json(faculty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add a publication
exports.addPublication = async (req, res) => {
  try {
    const publication = new Publication(req.body);
    await publication.save();
    res.status(201).json(publication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add a project
exports.addProject = async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add a patent
exports.addPatent = async (req, res) => {
  try {
    const patent = new Patent(req.body);
    await patent.save();
    res.status(201).json(patent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add a workshop
exports.addWorkshop = async (req, res) => {
  try {
    const workshop = new Workshop(req.body);
    await workshop.save();
    res.status(201).json(workshop);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add an NPTEL certification
exports.addNptel = async (req, res) => {
  try {
    const nptel = new Nptel(req.body);
    await nptel.save();
    res.status(201).json(nptel);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Get all faculty members
exports.getAllFaculty = async (req, res) => {
  try {
    const facultyList = await Faculty.find({});
    res.json(facultyList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get summary statistics
exports.getStats = async (req, res) => {
  try {
    const facultyCount = await Faculty.countDocuments();
    const publicationCount = await Publication.countDocuments();
    const projectCount = await Project.countDocuments();
    const patentCount = await Patent.countDocuments();
    const workshopCount = await Workshop.countDocuments({ type: 'Organised' });
    const nptelCount = await Nptel.countDocuments();
    
    // Get recent publications
    const recentPublications = await Publication.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('facultyId', 'name');

    // Get publications per year for chart
    const pubsPerYear = await Publication.aggregate([
      { $group: { _id: "$year", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // Get workshops per year (using date field)
    const workshopsPerYear = await Workshop.aggregate([
      { $group: { _id: { $year: "$date" }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // Get NPTEL per year
    const nptelPerYear = await Nptel.aggregate([
      { $group: { _id: "$year", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // Get faculty per department
    const facultyPerDept = await Faculty.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Get publications per department
    const pubsPerDept = await Publication.aggregate([
      {
        $lookup: {
          from: "faculties",
          localField: "facultyId",
          foreignField: "_id",
          as: "faculty"
        }
      },
      { $unwind: "$faculty" },
      { $group: { _id: "$faculty.department", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      facultyCount,
      publicationCount,
      projectCount,
      patentCount,
      workshopCount,
      nptelCount,
      recentPublications,
      pubsPerYear: pubsPerYear.map(item => ({ year: item._id, count: item.count })),
      workshopsPerYear: workshopsPerYear.map(item => ({ year: item._id, count: item.count })),
      nptelPerYear: nptelPerYear.map(item => ({ year: item._id, count: item.count })),
      facultyPerDept: facultyPerDept.map(item => ({ name: item._id, value: item.count })),
      pubsPerDept: pubsPerDept.map(item => ({ name: item._id, value: item.count }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
