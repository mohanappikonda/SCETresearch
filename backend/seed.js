const mongoose = require('mongoose');
const Faculty = require('./models/Faculty');
const Publication = require('./models/Publication');
const Project = require('./models/Project');
const Patent = require('./models/Patent');
const Workshop = require('./models/Workshop');
const Nptel = require('./models/Nptel');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/research_profile';

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Faculty.deleteMany({});
    await Publication.deleteMany({});
    await Project.deleteMany({});
    await Patent.deleteMany({});
    await Workshop.deleteMany({});
    await Nptel.deleteMany({});

    // Create Faculty
    const faculty1 = await Faculty.create({
      name: 'Dr. Appikonda Mohan Durga Kumar',
      email: 'test@college.edu',
      password: await bcrypt.hash('password123', 10),
      department: 'Computer Science & Engineering',
      designation: 'Professor',
      bio: 'Expert in Artificial Intelligence and Research Methodologies.',
      researchInterests: ['AI', 'Machine Learning', 'Big Data']
    });

    const faculty2 = await Faculty.create({
      name: 'Dr. Jane Smith',
      email: 'jane.smith@college.edu',
      password: await bcrypt.hash('password123', 10),
      department: 'Electronics & Communication',
      designation: 'Associate Professor',
      bio: 'Research focused on Embedded Systems and VLSI.',
      researchInterests: ['Embedded Systems', 'IoT', 'VLSI']
    });

    // Create Publications
    await Publication.create([
      {
        facultyId: faculty1._id,
        title: 'Advances in Deep Learning for Image Processing',
        authors: 'A. M. D. Kumar, et al.',
        venue: 'IEEE Transactions on Pattern Analysis',
        year: 2023,
        type: 'Journal'
      },
      {
        facultyId: faculty1._id,
        title: 'Optimizing Neural Networks for Low-Power Devices',
        authors: 'A. M. D. Kumar',
        venue: 'International Conference on AI',
        year: 2022,
        type: 'Conference'
      }
    ]);

    // Create Projects
    await Project.create([
      {
        facultyId: faculty1._id,
        title: 'AI-driven Smart Campus Initiative',
        fundingAgency: 'UGC',
        amount: 500000,
        status: 'Ongoing'
      }
    ]);

    // Create Patents
    await Patent.create([
      {
        facultyId: faculty1._id,
        title: 'Intelligent System for Crop Monitoring',
        applicationNumber: '202341012345',
        status: 'Published',
        dateOfFiling: new Date('2023-01-01')
      }
    ]);

    // Create Workshops
    await Workshop.create([
      {
        facultyId: faculty1._id,
        title: 'National Workshop on AI & Data Science',
        role: 'Coordinator',
        type: 'Organised',
        date: new Date('2023-05-15')
      },
      {
        facultyId: faculty1._id,
        title: 'International FDP on Machine Learning',
        role: 'Participant',
        type: 'Attended',
        date: new Date('2023-08-20')
      }
    ]);

    // Create NPTEL Certifications
    await Nptel.create([
      {
        facultyId: faculty1._id,
        courseName: 'Deep Learning',
        year: 2023,
        score: 95,
        certificateType: 'Elite+Gold'
      }
    ]);

    console.log('Database seeded successfully with faculty, publications, projects, patents, workshops, and NPTEL certs!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
