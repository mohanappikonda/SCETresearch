import React, { useState } from 'react';
import { Form, Button, Alert, Container, Spinner, Row, Col } from 'react-bootstrap';
import { Typography, Box } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';
import logo from '../assets/logo.png';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    designation: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await register(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center py-5" style={{ minHeight: '80vh' }}>
      <div className="premium-card p-5" style={{ maxWidth: '600px', width: '100%' }}>
        <Box textAlign="center" mb={4}>
          <Box sx={{ 
            width: 70, height: 70, 
            bgcolor: 'white', 
            borderRadius: '16px', 
            mx: 'auto', mb: 2,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--shadow-sm)',
            p: 1
          }}>
            <img src={logo} alt="SCET Logo" style={{ width: '100%', objectFit: 'contain' }} />
          </Box>
          <Typography variant="h4" fontWeight="800">Join SCET Research</Typography>
          <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>
            Create your academic profile to showcase your achievements.
          </Typography>
        </Box>

        {error && <Alert variant="danger" className="border-0 shadow-sm">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold text-uppercase">Full Name</Form.Label>
            <Form.Control 
              required 
              className="py-2 px-3 border-0 bg-light shadow-none"
              style={{ borderRadius: '8px' }}
              placeholder="Dr. John Doe"
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold text-uppercase">Institutional Email</Form.Label>
            <Form.Control 
              type="email" 
              required 
              className="py-2 px-3 border-0 bg-light shadow-none"
              style={{ borderRadius: '8px' }}
              placeholder="name@swarnandhra.ac.in"
              value={formData.email} 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-uppercase">Department</Form.Label>
                <Form.Select 
                  required 
                  className="py-2 px-3 border-0 bg-light shadow-none"
                  style={{ borderRadius: '8px' }}
                  value={formData.department} 
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                >
                  <option value="">Select Dept</option>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                  <option value="Mechanical">Mechanical</option>
                  <option value="Civil">Civil</option>
                  <option value="S&H">S&H</option>
                  <option value="MBA">MBA</option>
                  <option value="MCA">MCA</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-uppercase">Designation</Form.Label>
                <Form.Control 
                  required 
                  className="py-2 px-3 border-0 bg-light shadow-none"
                  style={{ borderRadius: '8px' }}
                  placeholder="Asst. Professor"
                  value={formData.designation} 
                  onChange={(e) => setFormData({...formData, designation: e.target.value})} 
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-4">
            <Form.Label className="small fw-bold text-uppercase">Password</Form.Label>
            <Form.Control 
              type="password" 
              required 
              className="py-2 px-3 border-0 bg-light shadow-none"
              style={{ borderRadius: '8px' }}
              placeholder="••••••••"
              value={formData.password} 
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
            />
          </Form.Group>

          <Button 
            type="submit" 
            className="btn-premium w-100 py-3 shadow-lg mb-3" 
            disabled={loading}
          >
            {loading ? <Spinner size="sm" /> : 'Create Faculty Profile'}
          </Button>
          
          <Box textAlign="center">
            <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>
              Already have an account? <Link to="/login" className="text-primary fw-bold text-decoration-none">Sign In</Link>
            </Typography>
          </Box>
        </Form>
      </div>
    </Container>
  );
};

export default RegisterPage;
