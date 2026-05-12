import React, { useState } from 'react';
import { Form, Button, Alert, Container, Spinner } from 'react-bootstrap';
import { Typography, Box, Paper } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { Lock as LockIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

import logo from '../assets/logo.png';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login({ email, password });
      navigate('/edit');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <div className="premium-card p-5" style={{ maxWidth: '480px', width: '100%' }}>
        <Box textAlign="center" mb={5}>
          <Box sx={{ 
            width: 80, height: 80, 
            bgcolor: 'white', 
            borderRadius: '20px', 
            mx: 'auto', mb: 3,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--shadow-md)',
            p: 1.5,
            border: '1px solid rgba(0,0,0,0.05)'
          }}>
            <img 
              src={logo} 
              alt="SCET Logo" 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              onError={(e) => {
                e.target.src = "https://ui-avatars.com/api/?name=SCET&background=2563eb&color=fff&bold=true";
              }}
            />
          </Box>
          <Typography variant="h4" fontWeight="800" sx={{ mb: 1 }}>Faculty Portal</Typography>
          <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>
            Swarnandhra College of Engineering & Technology
          </Typography>
        </Box>

        {error && <Alert variant="danger" className="border-0 shadow-sm">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold small text-uppercase">Institutional Email</Form.Label>
            <Form.Control 
              type="email" 
              required 
              className="py-3 px-4 border-0 bg-light shadow-none"
              style={{ borderRadius: '10px' }}
              placeholder="name@college.edu"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </Form.Group>

          <Form.Group className="mb-5">
            <Form.Label className="fw-semibold small text-uppercase">Security Password</Form.Label>
            <Form.Control 
              type="password" 
              required 
              className="py-3 px-4 border-0 bg-light shadow-none"
              style={{ borderRadius: '10px' }}
              placeholder="••••••••"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </Form.Group>

          <Button 
            type="submit" 
            className="btn-premium w-100 py-3 shadow-lg" 
            disabled={loading}
          >
            {loading ? <Spinner size="sm" /> : 'Secure Login'}
          </Button>
          
          <Box mt={4} textAlign="center">
            <Typography variant="body2" sx={{ color: 'var(--text-muted)', mb: 2 }}>
              New to the portal? <Link to="/register" className="text-primary fw-bold text-decoration-none">Create an Account</Link>
            </Typography>
            <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>
              Protected by SCET Institutional Security Protocols.
            </Typography>
          </Box>
        </Form>
      </div>
    </Container>
  );
};

export default LoginPage;
