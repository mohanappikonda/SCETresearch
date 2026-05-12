import React, { useState, useEffect } from 'react';
import { Row, Col, Spinner, Tab, Tabs } from 'react-bootstrap';
import { Typography, Box, Grid } from '@mui/material';
import { 
  People as PeopleIcon, 
  Description as PubIcon, 
  Assignment as ProjectIcon,
  Timeline as ActivityIcon,
  BarChart as ChartIcon,
  Lightbulb as PatentIcon,
  Groups as WorkshopIcon,
  School as NptelIcon
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { getStats } from '../services/api';
import logo from '../assets/logo.png';

const StatCard = ({ title, value, icon, color }) => (
  <div className="premium-card p-4 h-100">
    <Box display="flex" alignItems="center">
      <Box sx={{ 
        bgcolor: `${color}.50`, 
        p: 2, 
        borderRadius: '12px', 
        mr: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: `${color}.main`
      }}>
        {React.cloneElement(icon, { sx: { fontSize: 32 } })}
      </Box>
      <Box>
        <Typography variant="h4" fontWeight="700" sx={{ color: 'var(--text-main)' }}>{value}</Typography>
        <Typography variant="subtitle2" sx={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>
          {title}
        </Typography>
      </Box>
    </Box>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState('publications');

  useEffect(() => {
    getStats()
      .then(res => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
      <Spinner animation="grow" variant="primary" />
    </Box>
  );

  return (
    <Box sx={{ pb: 8 }} className="fade-in">
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, var(--primary) 0%, #1e40af 100%)', 
          borderRadius: '24px', 
          p: { xs: 4, md: 6 }, 
          mb: 6,
          color: 'white',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ position: 'absolute', top: -50, right: -50, opacity: 0.1, width: '300px' }}>
          <img src={logo} alt="" style={{ width: '100%', filter: 'brightness(0) invert(1)' }} />
        </Box>
        <Typography variant="h2" fontWeight="900" sx={{ mb: 2, letterSpacing: '-0.02em' }}>
          SCET Research Analytics
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400, maxWidth: '700px', lineHeight: 1.6 }}>
          Driving academic excellence through data. Comprehensive performance metrics for Swarnandhra College of Engineering & Technology.
        </Typography>
      </Box>

      <Row className="g-4 mb-6">
        <Col md={4} lg={2}>
          <StatCard title="Faculty" value={stats?.facultyCount || 0} icon={<PeopleIcon />} color="primary" />
        </Col>
        <Col md={4} lg={2}>
          <StatCard title="Papers" value={stats?.publicationCount || 0} icon={<PubIcon />} color="success" />
        </Col>
        <Col md={4} lg={2}>
          <StatCard title="Projects" value={stats?.projectCount || 0} icon={<ProjectIcon />} color="warning" />
        </Col>
        <Col md={4} lg={2}>
          <StatCard title="Patents" value={stats?.patentCount || 0} icon={<PatentIcon />} color="info" />
        </Col>
        <Col md={4} lg={2}>
          <StatCard title="Workshops" value={stats?.workshopCount || 0} icon={<WorkshopIcon />} color="secondary" />
        </Col>
        <Col md={4} lg={2}>
          <StatCard title="NPTEL" value={stats?.nptelCount || 0} icon={<NptelIcon />} color="error" />
        </Col>
      </Row>

      <Row className="g-4">
        <Col lg={8}>
          <div className="premium-card p-5 h-100">
            <Tabs
              id="dashboard-tabs"
              activeKey={key}
              onSelect={(k) => setKey(k)}
              className="mb-4 custom-tabs"
            >
              <Tab eventKey="publications" title="Publications">
                <Box sx={{ height: 350, width: '100%', mt: 3 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats?.pubsPerYear}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="year" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip cursor={{ fill: '#f1f5f9' }} />
                      <Bar dataKey="count" fill="var(--primary)" radius={[6, 6, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Tab>
              <Tab eventKey="workshops" title="Workshops">
                <Box sx={{ height: 350, width: '100%', mt: 3 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats?.workshopsPerYear}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="year" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip cursor={{ fill: '#f1f5f9' }} />
                      <Bar dataKey="count" fill="var(--accent)" radius={[6, 6, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Tab>
              <Tab eventKey="nptel" title="NPTEL Certs">
                <Box sx={{ height: 350, width: '100%', mt: 3 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats?.nptelPerYear}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="year" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip cursor={{ fill: '#f1f5f9' }} />
                      <Bar dataKey="count" fill="#ef4444" radius={[6, 6, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Tab>
              <Tab eventKey="department" title="Dept. Distribution">
                <Box sx={{ height: 350, width: '100%', mt: 3 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats?.facultyPerDept}
                        innerRadius={80}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {stats?.facultyPerDept?.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#2563eb', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'][index % 5]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="middle" align="right" layout="vertical" />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Tab>
            </Tabs>
          </div>
        </Col>
        
        <Col lg={4}>
          <div className="premium-card p-5 h-100">
            <Box display="flex" alignItems="center" mb={4}>
              <ActivityIcon sx={{ mr: 2, color: 'var(--accent)' }} />
              <Typography variant="h5" fontWeight="700">Recent Highlights</Typography>
            </Box>
            <div className="activity-timeline">
              {stats?.recentPublications?.map((pub, index) => (
                <Box key={index} sx={{ 
                  mb: 4, 
                  pl: 3, 
                  borderLeft: '2px solid', 
                  borderColor: index === 0 ? 'var(--primary)' : 'var(--border)',
                  position: 'relative'
                }}>
                  <Box sx={{ 
                    position: 'absolute', 
                    left: -7, 
                    top: 4, 
                    width: 12, 
                    height: 12, 
                    borderRadius: '50%', 
                    bgcolor: index === 0 ? 'var(--primary)' : 'var(--border)',
                    border: '2px solid white'
                  }} />
                  <Typography variant="subtitle2" fontWeight="700" sx={{ mb: 0.5 }}>{pub.title}</Typography>
                  <Typography variant="caption" color="textSecondary" display="block">
                    {pub.facultyId?.name} • {pub.year}
                  </Typography>
                </Box>
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </Box>
  );
};

export default Dashboard;
