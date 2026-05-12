import React, { useState, useEffect } from 'react';
import { Row, Col, Spinner, Form, InputGroup } from 'react-bootstrap';
import { Typography, Box, Avatar, Button } from '@mui/material';
import { Search as SearchIcon, Visibility as ViewIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { getFacultyList } from '../services/api';

const FacultyList = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getFacultyList()
      .then(res => {
        setFaculty(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredFaculty = faculty.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (f.researchInterests && f.researchInterests.some(ri => ri.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
      <Spinner animation="grow" variant="primary" />
    </Box>
  );

  return (
    <Box sx={{ pb: 8 }}>
      <Box mb={6} className="text-center">
        <Typography variant="h3" fontWeight="900" sx={{ mb: 2, color: 'var(--text-main)' }}>
          SCET Research Directory
        </Typography>
        <Typography variant="h6" sx={{ color: 'var(--text-muted)', fontWeight: 400, maxWidth: '800px', mx: 'auto', mb: 5 }}>
          Explore the academic profiles, publications, and professional achievements of our distinguished faculty at Swarnandhra College of Engineering & Technology.
        </Typography>
        
        <Box sx={{ maxWidth: '600px', mx: 'auto' }}>
          <InputGroup className="shadow-lg rounded-pill overflow-hidden border-0 bg-white p-1">
            <InputGroup.Text className="bg-transparent border-0 ps-4">
              <SearchIcon sx={{ color: 'var(--primary)', fontSize: 28 }} />
            </InputGroup.Text>
            <Form.Control 
              placeholder="Search by name, department, or research interest..." 
              className="border-0 py-3 shadow-none fs-5"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Box>
      </Box>

      <Row className="g-4">
        {filteredFaculty.map((f, index) => (
          <Col key={index} lg={4} md={6}>
            <div className="premium-card h-100 overflow-hidden">
              <Box sx={{ height: 120, background: 'linear-gradient(45deg, var(--primary), #3b82f6)' }} />
              <Box className="p-4 text-center">
                <Avatar 
                  src={f.image}
                  sx={{ 
                    width: 110, 
                    height: 110, 
                    mx: 'auto', 
                    mt: -8, 
                    border: '4px solid white',
                    boxShadow: 'var(--shadow-md)',
                    bgcolor: 'var(--background)',
                    color: 'var(--primary)',
                    fontSize: '2.5rem',
                    fontWeight: 700
                  }}
                >
                  {f.name[0]}
                </Avatar>
                <Typography variant="h5" fontWeight="700" sx={{ mt: 2, mb: 0.5 }}>{f.name}</Typography>
                <Typography variant="subtitle2" sx={{ color: 'var(--text-muted)', mb: 1 }}>{f.designation}</Typography>
                <Box 
                  display="inline-block" 
                  sx={{ 
                    px: 2, 
                    py: 0.5, 
                    bgcolor: 'var(--background)', 
                    borderRadius: '20px', 
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: 'var(--primary)',
                    mb: 3
                  }}
                >
                  {f.department}
                </Box>
                
                <Box>
                  <Button 
                    component={Link} 
                    to={`/profile/${f.email}`}
                    className="btn-premium w-100"
                    startIcon={<ViewIcon />}
                  >
                    View Research Profile
                  </Button>
                </Box>
              </Box>
            </div>
          </Col>
        ))}
      </Row>
      
      {filteredFaculty.length === 0 && (
        <Box textAlign="center" py={10}>
          <Typography variant="h5" sx={{ color: 'var(--text-muted)' }}>No faculty members match your search.</Typography>
        </Box>
      )}
    </Box>
  );
};

export default FacultyList;
