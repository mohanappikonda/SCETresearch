import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Alert, Spinner, Modal } from 'react-bootstrap';
import { Typography, Box, Divider, List, ListItem, ListItemText, Avatar } from '@mui/material';
import { 
  Add as AddIcon, 
  PhotoCamera as PhotoIcon, 
  Description as PubIcon, 
  Assignment as ProjectIcon, 
  Lightbulb as PatentIcon,
  Groups as WorkshopIcon,
  School as NptelIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { getProfile, updateProfile, addPublication, addProject, addPatent, addWorkshop, addNptel, uploadImage } from '../services/api';

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

      {message && <Alert variant={message.type} className="mb-4">{message.text}</Alert>}

      <Row className="g-5">
        <Col lg={7}>
          <div className="premium-card p-5">
            <Typography variant="h5" fontWeight="700" mb={4}>Personal Information</Typography>
            <Box display="flex" alignItems="center" mb={4} gap={4}>
              <Avatar src={formData.image} sx={{ width: 100, height: 100, bgcolor: 'var(--primary)' }}>{formData.name[0]}</Avatar>
              <Box>
                <input type="file" id="image-upload" style={{ display: 'none' }} onChange={handleImageUpload} accept="image/*" />
                <label htmlFor="image-upload"><Button variant="outline-primary" as="span" className="rounded-pill px-3">Change Photo</Button></label>
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
                {sec.items.slice(0, 3).map((it, j) => <ListItem key={j} sx={{ px: 0 }}><ListItemText primary={it.title || it.courseName} /></ListItem>)}
              </List>
            </div>
          ))}
        </Col>
      </Row>

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

      {/* Publication Modal */}
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

      {/* Project Modal */}
      <Modal show={showProjModal} onHide={() => setShowProjModal(false)} centered>
        <Modal.Header closeButton className="border-0 px-4 pt-4"><Modal.Title className="fw-bold">Add Research Project</Modal.Title></Modal.Header>
        <Modal.Body className="px-4 pb-4">
          <Form onSubmit={e => { e.preventDefault(); handleAddItem('proj', newProj); }}>
            <Form.Group className="mb-3"><Form.Label className="small fw-bold">Project Title</Form.Label><Form.Control className="bg-light border-0" required onChange={e => setNewProj({...newProj, title: e.target.value})} /></Form.Group>
            <Form.Group className="mb-3"><Form.Label className="small fw-bold">Funding Agency</Form.Label><Form.Control className="bg-light border-0" required onChange={e => setNewProj({...newProj, fundingAgency: e.target.value})} /></Form.Group>
            <Form.Group className="mb-3"><Form.Label className="small fw-bold">Status</Form.Label>
              <Form.Select className="bg-light border-0" onChange={e => setNewProj({...newProj, status: e.target.value})}>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </Form.Select>
            </Form.Group>
            <Button type="submit" className="btn-premium w-100">Add Project</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Patent Modal */}
      <Modal show={showPatModal} onHide={() => setShowPatModal(false)} centered>
        <Modal.Header closeButton className="border-0 px-4 pt-4"><Modal.Title className="fw-bold">Add Patent</Modal.Title></Modal.Header>
        <Modal.Body className="px-4 pb-4">
          <Form onSubmit={e => { e.preventDefault(); handleAddItem('pat', newPat); }}>
            <Form.Group className="mb-3"><Form.Label className="small fw-bold">Patent Title</Form.Label><Form.Control className="bg-light border-0" required onChange={e => setNewPat({...newPat, title: e.target.value})} /></Form.Group>
            <Form.Group className="mb-3"><Form.Label className="small fw-bold">Application Number</Form.Label><Form.Control className="bg-light border-0" required onChange={e => setNewPat({...newPat, applicationNumber: e.target.value})} /></Form.Group>
            <Form.Group className="mb-3"><Form.Label className="small fw-bold">Status</Form.Label>
              <Form.Select className="bg-light border-0" onChange={e => setNewPat({...newPat, status: e.target.value})}>
                <option value="Filed">Filed</option>
                <option value="Published">Published</option>
                <option value="Granted">Granted</option>
              </Form.Select>
            </Form.Group>
            <Button type="submit" className="btn-premium w-100">Add Patent</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Workshop Modal */}
      <Modal show={showWorkModal} onHide={() => setShowWorkModal(false)} centered>
        <Modal.Header closeButton className="border-0 px-4 pt-4"><Modal.Title className="fw-bold">Add Workshop</Modal.Title></Modal.Header>
        <Modal.Body className="px-4 pb-4">
          <Form onSubmit={e => { e.preventDefault(); handleAddItem('work', newWork); }}>
            <Form.Group className="mb-3"><Form.Label className="small fw-bold">Title</Form.Label><Form.Control className="bg-light border-0" required onChange={e => setNewWork({...newWork, title: e.target.value})} /></Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3"><Form.Label className="small fw-bold">Date</Form.Label><Form.Control className="bg-light border-0" type="date" required onChange={e => setNewWork({...newWork, date: e.target.value})} /></Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3"><Form.Label className="small fw-bold">Type</Form.Label>
                  <Form.Select className="bg-light border-0" onChange={e => setNewWork({...newWork, type: e.target.value})}>
                    <option value="Organised">Organised</option>
                    <option value="Attended">Attended</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3"><Form.Label className="small fw-bold">Venue</Form.Label><Form.Control className="bg-light border-0" onChange={e => setNewWork({...newWork, venue: e.target.value})} /></Form.Group>
            <Button type="submit" className="btn-premium w-100">Add Workshop</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Box>
  );
};

export default EditProfile;
