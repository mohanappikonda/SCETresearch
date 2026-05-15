import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, ListGroup, Badge, Spinner, Alert, Button } from 'react-bootstrap';
import { Typography, Avatar, Box, Divider, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';
import { 
  Description as PubIcon, 
  Assignment as ProjectIcon, 
  Lightbulb as PatentIcon,
  Groups as WorkshopIcon,
  School as NptelIcon,
  Email as EmailIcon,
  Business as DeptIcon,
  PictureAsPdf as PdfIcon
} from '@mui/icons-material';
import { getProfile } from '../services/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ProfilePage = () => {
  const { email } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);
  const profileRef = useRef();

  useEffect(() => {
    getProfile(email || 'test@college.edu')
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Profile could not be loaded.');
        setLoading(false);
      });
  }, [email]);

  const handleDownloadPdf = async () => {
    setExporting(true);
    const element = profileRef.current;
    
    // Temporarily hide buttons for the screenshot
    const buttons = element.querySelectorAll('.no-print');
    buttons.forEach(btn => btn.style.display = 'none');

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#f8fafc'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${data.faculty.name.replace(/\s+/g, '_')}_Portfolio.pdf`);
    } catch (err) {
      console.error('PDF Export Error:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      buttons.forEach(btn => btn.style.display = 'block');
      setExporting(false);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><Spinner animation="grow" /></Box>;
  if (!data) return <Alert variant="warning" className="m-5">{error || 'Faculty not found'}</Alert>;

  return (
    <Box sx={{ pb: 10 }} ref={profileRef}>
      {/* Profile Header */}
      <div className="premium-card p-5 mb-5 overflow-hidden position-relative">
        <Box sx={{ 
          position: 'absolute', top: 0, left: 0, right: 0, height: '8px', 
          background: 'linear-gradient(90deg, var(--primary), var(--accent))' 
        }} />
        <Row className="align-items-center">
          <Col md="auto" className="mb-4 mb-md-0">
            <Avatar 
              src={data.faculty.image} 
              sx={{ width: 150, height: 150, bgcolor: 'var(--primary)', fontSize: '3.5rem', fontWeight: 700, boxShadow: 'var(--shadow-lg)' }}
            >
              {data.faculty.name[0]}
            </Avatar>
          </Col>
          <Col>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="h2" fontWeight="800" sx={{ mb: 1 }}>{data.faculty.name}</Typography>
                <Box display="flex" gap={3} flexWrap="wrap">
                  <Box display="flex" alignItems="center" sx={{ color: 'var(--text-muted)' }}>
                    <DeptIcon sx={{ fontSize: 18, mr: 1 }} />
                    <Typography variant="subtitle1" fontWeight="500">{data.faculty.designation} • {data.faculty.department}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" sx={{ color: 'var(--text-muted)' }}>
                    <EmailIcon sx={{ fontSize: 18, mr: 1 }} />
                    <Typography variant="subtitle1" fontWeight="500">{data.faculty.email}</Typography>
                  </Box>
                </Box>
              </Box>
              <Button 
                variant="outline-primary" 
                className="no-print rounded-pill px-4 fw-bold" 
                onClick={handleDownloadPdf}
                disabled={exporting}
              >
                {exporting ? <Spinner size="sm" className="me-2" /> : <PdfIcon className="me-2" />}
                {exporting ? 'Generating...' : 'Download Portfolio'}
              </Button>
            </Box>
            <Typography variant="body1" sx={{ mt: 3, maxWidth: 800, lineHeight: 1.8, fontSize: '1.1rem' }}>
              {data.faculty.bio || "No bio available."}
            </Typography>
          </Col>
        </Row>
      </div>

      <Row className="g-5">
        <Col lg={8}>
          <Section icon={<PubIcon />} title="Publications" items={data.publications} />
          <Section icon={<ProjectIcon />} title="Research Projects" items={data.projects} />
          <Section icon={<PatentIcon />} title="Patents" items={data.patents} />
          <Section icon={<WorkshopIcon />} title="Workshops Organised/Attended" items={data.workshops} />
          <Section icon={<NptelIcon />} title="NPTEL Certifications" items={data.nptels} />
        </Col>

        <Col lg={4}>
          <div className="premium-card p-4 sticky-top" style={{ top: '100px' }}>
            <Typography variant="h6" fontWeight="700" sx={{ mb: 3 }} className="section-title">Research Expertise</Typography>
            <Box display="flex" flexWrap="wrap" gap={1.5}>
              {data.faculty.researchInterests?.map((interest, i) => (
                <Badge 
                  key={i} 
                  pill 
                  bg="light" 
                  className="px-3 py-2 text-primary border" 
                  style={{ fontSize: '0.9rem', fontWeight: 600 }}
                >
                  {interest}
                </Badge>
              ))}
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            <Typography variant="h6" fontWeight="700" sx={{ mb: 3 }}>Summary Statistics</Typography>
            <StatLine label="Total Publications" value={data.publications?.length} />
            <StatLine label="Funded Projects" value={data.projects?.length} />
            <StatLine label="Patents Filed" value={data.patents?.length} />
            <StatLine label="Workshops" value={data.workshops?.length} />
            <StatLine label="NPTEL Certs" value={data.nptels?.length} />
          </div>
        </Col>
      </Row>
    </Box>
  );
};

const Section = ({ icon, title, items }) => (
  <div className="mb-5">
    <Box display="flex" alignItems="center" mb={3}>
      <Box sx={{ color: 'var(--primary)', mr: 2, display: 'flex' }}>{React.cloneElement(icon, { sx: { fontSize: 28 } })}</Box>
      <Typography variant="h5" fontWeight="800">{title}</Typography>
    </Box>
    <div className="premium-card overflow-hidden">
      <ListGroup variant="flush">
        {items && items.length > 0 ? (
          items.map((it, i) => (
            <ListGroup.Item key={i} className="p-4 border-0 border-bottom">
              <Typography variant="h6" fontWeight="700" sx={{ mb: 0.5 }}>{it.title || it.courseName}</Typography>
              <Typography variant="body2" color="textSecondary">
                {it.venue || it.fundingAgency || it.applicationNumber || it.certificateType} • {it.year || it.status || it.type}
              </Typography>
            </ListGroup.Item>
          ))
        ) : (
          <Box p={4} textAlign="center" color="textSecondary">No data available in this section.</Box>
        )}
      </ListGroup>
    </div>
  </div>
);

const StatLine = ({ label, value }) => (
  <Box display="flex" justifyContent="space-between" mb={2}>
    <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>{label}</Typography>
    <Typography variant="body2" fontWeight="700">{value || 0}</Typography>
  </Box>
);

export default ProfilePage;
