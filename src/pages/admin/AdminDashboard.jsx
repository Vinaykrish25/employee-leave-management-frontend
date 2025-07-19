import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import GroupsIcon from '@mui/icons-material/Groups';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { keyframes } from '@emotion/react';

const bounce = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
`;

const thStyle = {
  textAlign: 'left',
  padding: '12px',
  borderBottom: '1px solid #ccc',
  fontWeight: 'bold'
};

const tdStyle = {
  padding: '12px',
  borderBottom: '1px solid #eee'
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Approved':
      return 'green';
    case 'Not Approved':
      return 'red';
    case 'Pending':
      return 'orange';
    default:
      return 'gray';
  }
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const [stats, setStats] = useState({
    total_employees: 0,
    total_departments: 0,
    total_leave_types: 0,
    total_leave_applications: 0
  });

  const [latestLeaves, setLatestLeaves] = useState([]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://employee-leave-management-backend-qqodtdesw.vercel.app/users/admin-dashboard', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        setStats(data.stats);
        setLatestLeaves(data.latestLeaves || []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };

    fetchDashboardStats();
  }, []);

  const summaryCards = [
    {
      label: 'Total Leave Applications',
      value: stats.total_leave_applications,
      icon: <AssignmentTurnedInIcon sx={{ fontSize: 40, color: 'primary.main', animation: `${bounce} 1.5s infinite` }} />,
      route: '/admin/leave-applications'
    },
    {
      label: 'Registered Employees',
      value: stats.total_employees,
      icon: <GroupsIcon sx={{ fontSize: 40, color: 'primary.main', animation: `${bounce} 1.5s infinite` }} />,
      route: '/admin/employees'
    },
    {
      label: 'Total Departments',
      value: stats.total_departments,
      icon: <BusinessCenterIcon sx={{ fontSize: 40, color: 'primary.main', animation: `${bounce} 1.5s infinite` }} />,
      route: '/admin/departments'
    },
    {
      label: 'Leave Types',
      value: stats.total_leave_types,
      icon: <EventNoteIcon sx={{ fontSize: 40, color: 'primary.main', animation: `${bounce} 1.5s infinite` }} />,
      route: '/admin/leave-types'
    }
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Welcome, Admin
      </Typography>

      <Grid container spacing={2}>
        {summaryCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              onClick={() => navigate(card.route)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 2,
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 6,
                  backgroundColor: theme.palette.action.hover
                }
              }}
            >
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {card.label}
                </Typography>
                <Typography variant="h5">{card.value}</Typography>
              </Box>
              {card.icon}
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" mt={4} mb={2}>
        Recent Leave Applications
      </Typography>

      <Box sx={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={thStyle}>Employee</th>
              <th style={thStyle}>Leave Type</th>
              <th style={thStyle}>Posting Date</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {latestLeaves.map((leave) => (
              <tr key={leave.id}>
                <td style={tdStyle}>{leave.employee_name}</td>
                <td style={tdStyle}>{leave.leave_type}</td>
                <td style={tdStyle}>{new Date(leave.posting_date).toLocaleDateString()}</td>
                <td style={{ ...tdStyle, color: getStatusColor(leave.status), fontWeight: 600 }}>
                  {leave.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
