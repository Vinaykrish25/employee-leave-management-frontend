import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, MenuItem, Button, Paper, Snackbar, Alert, Grid
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const holidays = [
  '2025-01-01',
  '2025-08-15',
  '2025-12-25',
];

const ApplyLeave = () => {
  const token = localStorage.getItem('token');
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [formData, setFormData] = useState({
    leave_type_id: '',
    from_date: null,
    to_date: null,
    description: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetch('https://employee-leave-management-backend.vercel.app/leave-types')
      .then(res => res.json())
      .then(setLeaveTypes)
      .catch(err => console.error('Error fetching leave types:', err));
  }, []);

  const isWeekendOrHoliday = (date) => {
    const isWeekend = date.day() === 0 || date.day() === 6;
    const isHoliday = holidays.includes(date.format('YYYY-MM-DD'));
    return isWeekend || isHoliday;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (key, date) => {
    setFormData(prev => ({ ...prev, [key]: date }));
  };

  const handleSubmit = async () => {
    const { leave_type_id, from_date, to_date, description } = formData;

    if (!leave_type_id || !from_date || !to_date) {
      return setSnackbar({ open: true, message: 'Please fill all required fields.', severity: 'error' });
    }

    if (from_date.isAfter(to_date)) {
      return setSnackbar({ open: true, message: 'From date cannot be after To date.', severity: 'error' });
    }

    try {
      const res = await fetch('https://employee-leave-management-backend.vercel.app/employee-leave/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          leave_type_id,
          from_date: from_date.format('YYYY-MM-DD'),
          to_date: to_date.format('YYYY-MM-DD'),
          description
        })
      });

      const result = await res.json();
      if (res.ok) {
        setSnackbar({ open: true, message: result.message, severity: 'success' });
        setFormData({ leave_type_id: '', from_date: null, to_date: null, description: '' });
      } else {
        setSnackbar({ open: true, message: result.message, severity: 'error' });
      }
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Failed to apply for leave', severity: 'error' });
    }
  };

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h6" mb={3}>Apply for Leave</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="Leave Type"
            name="leave_type_id"
            value={formData.leave_type_id}
            onChange={handleChange}
            required
          >
            {leaveTypes.map((type) => (
              <MenuItem key={type.id} value={type.id}>{type.type}</MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="From Date"
              value={formData.from_date}
              onChange={(newValue) => handleDateChange('from_date', newValue)}
              shouldDisableDate={isWeekendOrHoliday}
              disablePast
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="To Date"
              value={formData.to_date}
              onChange={(newValue) => handleDateChange('to_date', newValue)}
              shouldDisableDate={isWeekendOrHoliday}
              disablePast
              slotProps={{ textField: { fullWidth: true } }}
              minDate={formData.from_date || undefined}
            />
          </LocalizationProvider>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" onClick={handleSubmit}>Submit Leave</Button>
        </Grid>
      </Grid>

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          variant="outlined"
          sx={{
            width: '100%',
            borderLeft: `6px solid ${snackbar.severity === 'success' ? '#4caf50' : '#f44336'}`,
            backgroundColor: '#fff'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default ApplyLeave;
