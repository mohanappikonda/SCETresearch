import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Alert, Spinner, Modal } from 'react-bootstrap';
import { Typography, Box, Divider, List, ListItem, ListItemText, Avatar, Paper } from '@mui/material';
import { 
  Add as AddIcon, 
  PhotoCamera as PhotoIcon, 
  Description as PubIcon, 
  Assignment as ProjectIcon, 
  Lightbulb as PatentIcon,
  Groups as WorkshopIcon,
  School as NptelIcon,
  CloudUpload as UploadIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { 
  getProfile, updateProfile, addPublication, addProject, 
  addPatent, addWorkshop, addNptel, uploadImage, bulkImport 
} from '../services/api';

import logo from '../assets/logo.png';

const EditProfile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: user?.email || '',
    department: '',
    designation: '',
    bio: '',
    researchInterests: '',
    image: ''
  });
  const [publications, setPublications] = useState([]);
  const [projects, setProjects] = useState([]);
  const [patents, setPatents] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [nptels, setNptels] = useState([]);
  const [facultyId, setFacultyId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState(null);

  const [showPubModal, setShowPubModal] = useState(false);
  const [showProjModal, setShowProjModal] = useState(false);
  const [showPatModal, setShowPatModal] = useState(false);
  const [showWorkModal, setShowWorkModal] = useState(false);
  const [showNptelModal, setShowNptelModal] = useState(false);
  
  const [newPub, setNewPub] = useState({ title: '', venue: '', year: '', type: 'Journal' });
  const [newProj, setNewProj] = useState({ title: '', fundingAgency: '', status: 'Ongoing' });
  const [newPat, setNewPat] = useState({ title: '', applicationNumber: '', status: 'Filed' });
  const [newWork, setNewWork] = useState({ title: '', date: '', type: 'Organised' });
  const [newNptel, setNewNptel] = useState({ courseName: '', year: '', session: 'Jan-Apr', certificateType: 'Elite' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    getProfile(formData.email)
      .then(res => {
        const { faculty, publications, projects, patents, workshops, nptels } = res.data;
        setFormData({
          ...formData,
          name: faculty.name || '',
          department: faculty.department || '',
          designation: faculty.designation || '',
          bio: faculty.bio || '',
          image: faculty.image || '',
          researchInterests: faculty.researchInterests ? faculty.researchInterests.join(', ') : ''
        });
        setFacultyId(faculty._id);
        setPublications(publications || []);
        setProjects(projects || []);
        setPatents(patents || []);
        setWorkshops(workshops || []);
        setNptels(nptels || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const data = new FormData();
    data.append('image', file);
    uploadImage(data)
      .then(res => {
        setFormData({ ...formData, image: res.data.imageUrl });
        setUploading(false);
      })
      .catch(err => {
        console.error(err);
        setUploading(false);
      });
  };

  const handleBulkImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!facultyId) return alert('Please save your profile first.');

    setImporting(true);
    const data = new FormData();
    data.append('file', file);
    data.append('facultyId', facultyId);

    bulkImport(data)
      .then(res => {
        setMessage({ type: 'success', text: res.data.message });
        setImporting(false);
        fetchData();
      })
      .catch(err => {
        console.error(err);
        setMessage({ type: 'danger', text: 'Import failed. Check file format.' });
        setImporting(false);
      });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    const dataToSave = {
      ...formData,
      researchInterests: formData.researchInterests.split(',').map(i => i.trim()).filter(i => i !== '')
    };
    updateProfile(dataToSave)
      .then(() => {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setSaving(false);
      })
      .catch(() => {
        setMessage({ type: 'danger', text: 'Failed to update profile.' });
        setSaving(false);
      });
  };

  const handleAddItem = (type, data) => {
    if (!facultyId) return alert('Save basic info first');
    let apiCall;
    if (type === 'pub') apiCall = addPublication;
    else if (type === 'proj') apiCall = addProject;
    else if (type === 'pat') apiCall = addPatent;
    else if (type === 'work') apiCall = addWorkshop;
    else if (type === 'nptel') apiCall = addNptel;

    apiCall({ ...data, facultyId })
      .then(() => {
        setShowPubModal(false); setShowProjModal(false); setShowPatModal(false);
        setShowWorkModal(false); setShowNptelModal(false);
        fetchData();
      })
      .catch(err => console.error(err));
  };

  if (loading) return <Box textAlign="center" mt={10}><Spinner animation="grow" /></Box>;

  return (
    <Box sx={{ pb: 10 }}>
      <Box mb={5} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h3" fontWeight="800">Faculty Management</Typography>
          <Typography variant="h6" color="textSecondary">Update your institutional research profile.</Typography>
        </Box>
        <img src={logo} alt="SCET Logo" style={{ height: '60px', opacity: 0.8 }} />
      </Box>

      {message && <Alert variant={message.type} className="mb-4" dismissible onClose={() => setMessage(null)}>{message.text}</Alert>}

      <Row className="g-5">
        <Col lg={7}>
          <div className="premium-card p-5 mb-4">
            <Typography variant="h5" fontWeight="700" mb={4}>Personal Information</Typography>
            <Box display="flex" alignItems="center" mb={4} gap={4}>
              <Avatar src={formData.image} sx={{ width: 100, height: 100, bgcolor: 'var(--primary)' }}>{formData.name[0]}</Avatar>
              <Box>
                <input type="file" id="image-upload" style={{ display: 'none' }} onChange={handleImageUpload} accept="image/*" />
                <label htmlFor="image-upload">
                  <Button variant="outline-primary" as="span" className="rounded-pill px-3">
                    {uploading ? <Spinner size="sm" /> : <PhotoIcon className="me-2" />}
                    Change Photo
                  </Button>
                </label>
              </Box>
            </Box>
            <Form onSubmit={handleProfileSubmit}>
              <Row>
                <Col md={6}><Form.Group className="mb-3"><Form.Label>Full Name</Form.Label><Form.Control value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></Form.Group></Col>
                <Col md={6}><Form.Group className="mb-3"><Form.Label>Email</Form.Label><Form.Control value={formData.email} disabled /></Form.Group></Col>
              </Row>
              <Form.Group className="mb-4"><Form.Label>Bio</Form.Label><Form.Control as="textarea" rows={3} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} /></Form.Group>
              <Button type="submit" className="btn-premium px-5" disabled={saving}>Save Profile</Button>
            </Form>
          </div>

          <Paper elevation={0} className="premium-card p-5 border-dashed" style={{ border: '2px dashed #e2e8f0', background: '#f8fafc' }}>
            <Box display="flex" alignItems="center" gap={3}>
              <Box sx={{ p: 2, background: 'white', borderRadius: '12px', color: 'var(--primary)', boxShadow: 'var(--shadow-sm)' }}>
                <UploadIcon fontSize="large" />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight="700">Bulk Import Publications</Typography>
                <Typography variant="body2" color="textSecondary">Upload an Excel (.xlsx) file with columns: Title, Venue, Year, Type</Typography>
              </Box>
              <Box ml="auto">
                <input type="file" id="bulk-upload" style={{ display: 'none' }} onChange={handleBulkImport} accept=".xlsx, .xls" />
                <label htmlFor="bulk-upload">
                  <Button variant="primary" as="span" className="rounded-pill px-4" disabled={importing}>
                    {importing ? <Spinner size="sm" /> : 'Select File'}
                  </Button>
                </label>
              </Box>
            </Box>
          </Paper>
        </Col>

        <Col lg={5}>
          {[
            { title: 'Publications', items: publications, setter: setShowPubModal, icon: <PubIcon /> },
            { title: 'Projects', items: projects, setter: setShowProjModal, icon: <ProjectIcon /> },
            { title: 'Patents', items: patents, setter: setShowPatModal, icon: <PatentIcon /> },
            { title: 'Workshops', items: workshops, setter: setShowWorkModal, icon: <WorkshopIcon /> },
            { title: 'NPTEL Certs', items: nptels, setter: setShowNptelModal, icon: <NptelIcon /> }
          ].map((sec, i) => (
            <div key={i} className="premium-card p-4 mb-3">
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" color="var(--primary)">{sec.icon}<Typography variant="h6" fontWeight="700" ml={1} color="textPrimary">{sec.title}</Typography></Box>
                <Button variant="link" onClick={() => sec.setter(true)}><AddIcon /></Button>
              </Box>
              <Divider sx={{ my: 1.5 }} />
              <List dense>
                {sec.items.slice(0, 3).map((it, j) => (
                  <ListItem key={j} sx={{ px: 0 }}>
                    <ListItemText 
                      primary={it.title || it.courseName} 
                      secondary={`${it.venue || it.year || ''}`}
                      primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }}
                    />
                  </ListItem>
                ))}
                {sec.items.length === 0 && <Typography variant="caption" color="textSecondary">No items added yet.</Typography>}
              </List>
            </div>
          ))}
        </Col>
      </Row>

      {/* Modals for adding items (same as before but kept for completeness) */}
      <Modal show={showPubModal} onHide={() => setShowPubModal(false)} centered>
        <Modal.Header closeButton className="border-0 px-4 pt-4"><Modal.Title className="fw-bold">Add Publication</Modal.Title></Modal.Header>
        <Modal.Body className="px-4 pb-4">
          <Form onSubmit={e => { e.preventDefault(); handleAddItem('pub', newPub); }}>
            <Form.Group className="mb-3"><Form.Label className="small fw-bold">Title</Form.Label><Form.Control className="bg-light border-0" required onChange={e => setNewPub({...newPub, title: e.target.value})} /></Form.Group>
            <Form.Group className="mb-3"><Form.Label className="small fw-bold">Venue/Journal</Form.Label><Form.Control className="bg-light border-0" required onChange={e => setNewPub({...newPub, venue: e.target.value})} /></Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3"><Form.Label className="small fw-bold">Year</Form.Label><Form.Control className="bg-light border-0" type="number" required onChange={e => setNewPub({...newPub, year: e.target.value})} /></Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3"><Form.Label className="small fw-bold">Type</Form.Label>
                  <Form.Select className="bg-light border-0" onChange={e => setNewPub({...newPub, type: e.target.value})}>
                    <option value="Journal">Journal</option>
                    <option value="Conference">Conference</option>
                    <option value="Book Chapter">Book Chapter</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Button type="submit" className="btn-premium w-100">Add Publication</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Other modals (Project, Patent, Workshop, Nptel) would follow same pattern */}
      <Modal show={showNptelModal} onHide={() => setShowNptelModal(false)} centered>
        <Modal.Header closeButton className="border-0 px-4 pt-4"><Modal.Title className="fw-bold">Add NPTEL Certification</Modal.Title></Modal.Header>
        <Modal.Body className="px-4 pb-4">
          <Form onSubmit={e => { e.preventDefault(); handleAddItem('nptel', newNptel); }}>
            <Form.Group className="mb-3"><Form.Label className="small fw-bold">Course Name</Form.Label><Form.Control className="bg-light border-0" required onChange={e => setNewNptel({...newNptel, courseName: e.target.value})} /></Form.Group>
            <Form.Group className="mb-3"><Form.Label className="small fw-bold">Year</Form.Label><Form.Control className="bg-light border-0" type="number" required onChange={e => setNewNptel({...newNptel, year: e.target.value})} /></Form.Group>
            <Form.Group className="mb-3"><Form.Label className="small fw-bold">Certificate Type</Form.Label>
              <Form.Select className="bg-light border-0" onChange={e => setNewNptel({...newNptel, certificateType: e.target.value})}>
                <option value="Elite">Elite</option>
                <option value="Elite+Silver">Elite+Silver</option>
                <option value="Elite+Gold">Elite+Gold</option>
                <option value="Successfully Completed">Successfully Completed</option>
              </Form.Select>
            </Form.Group>
            <Button type="submit" className="btn-premium w-100">Add Certificate</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Box>
  );
};

export default EditProfile;
