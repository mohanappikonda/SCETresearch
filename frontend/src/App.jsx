import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Container, Navbar, Nav, Button, Row, Col } from 'react-bootstrap';
import { Typography, Box } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import FacultyList from './pages/FacultyList';
import ProfilePage from './pages/ProfilePage';
import EditProfile from './pages/EditProfile';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import logo from './assets/logo.png';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
};

const Navigation = () => {
  const { user, logout } = useAuth();
  return (
    <Navbar expand="lg" className="glass-nav py-3 mb-5 sticky-top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-3 text-decoration-none">
          <div style={{ 
            width: '60px', 
            height: '60px', 
            background: 'white', 
            borderRadius: '14px',
            padding: '5px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(0,0,0,0.05)'
          }}>
            <img 
              src={logo} 
              alt="SCET Logo"
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              onError={(e) => {
                e.target.src = "https://ui-avatars.com/api/?name=SCET&background=2563eb&color=fff&bold=true";
              }}
            />
          </div>
          <div className="d-flex flex-column">
            <span className="fw-bold fs-4 text-primary line-height-1">Swarnandhra</span>
            <span className="text-secondary small fw-bold text-uppercase tracking-wider" style={{ fontSize: '0.7rem' }}>
              College of Engineering & Technology
            </span>
            <span className="text-muted extra-small" style={{ fontSize: '0.6rem' }}>
              (AUTONOMOUS)
            </span>
          </div>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 shadow-none" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/" className="px-3 fw-medium">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/faculty" className="px-3 fw-medium">Faculty Directory</Nav.Link>
            {user ? (
              <>
                <Nav.Link as={Link} to="/edit" className="px-3 fw-medium">Management</Nav.Link>
                <Button 
                  variant="link" 
                  className="text-danger fw-semibold px-3 text-decoration-none" 
                  onClick={logout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Nav.Link as={Link} to="/login" className="ms-lg-3">
                <Button className="btn-premium px-4">Faculty Login</Button>
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

const Footer = () => (
  <footer className="py-5 mt-5 bg-white border-top">
    <Container>
      <Row className="gy-4">
        <Col md={6}>
          <Box display="flex" alignItems="center" gap={3} mb={3}>
            <img src={logo} alt="SCET Logo" style={{ height: '50px' }} />
            <div>
              <Typography variant="h6" fontWeight="700" color="primary" sx={{ lineHeight: 1.2 }}>
                Swarnandhra
              </Typography>
              <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontWeight: 600 }}>
                College of Engineering & Technology
              </Typography>
            </div>
          </Box>
          <Typography variant="body2" color="textSecondary" sx={{ maxWidth: '400px' }}>
            A premier institution dedicated to excellence in engineering education and research.
            (Autonomous), Accredited by NAAC with 'A' Grade.
          </Typography>
          <Box mt={2}>
            <Typography variant="caption" display="block" color="textSecondary">
              Seetharampuram, Narsapur - 534 280
            </Typography>
            <Typography variant="caption" display="block" color="textSecondary">
              West Godavari District, Andhra Pradesh, India
            </Typography>
          </Box>
        </Col>
        <Col md={6} className="text-md-end d-flex flex-column justify-content-between">
          <Box>
            <Typography variant="subtitle2" fontWeight="700" gutterBottom>Quick Links</Typography>
            <div className="d-flex flex-column gap-1">
              <Link to="/" className="text-decoration-none text-muted small">Dashboard</Link>
              <Link to="/faculty" className="text-decoration-none text-muted small">Faculty Directory</Link>
              <a href="https://swarnandhra.ac.in" target="_blank" rel="noreferrer" className="text-decoration-none text-muted small">Official Website</a>
            </div>
          </Box>
          <Typography variant="body2" color="textSecondary" className="mt-4">
            © {new Date().getFullYear()} SCET Research Portal. All Rights Reserved.
          </Typography>
        </Col>
      </Row>
    </Container>
  </footer>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App d-flex flex-column min-vh-100">
          <Navigation />
          <Container fluid="lg" className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/faculty" element={<FacultyList />} />
              <Route path="/profile/:email" element={<ProfilePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/edit" element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              } />
            </Routes>
          </Container>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
