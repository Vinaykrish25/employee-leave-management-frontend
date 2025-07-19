import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  TablePagination,
  TextField,
  Tabs,
  Tab
} from '@mui/material';
import axios from 'axios';

const LeaveHistory = () => {
  const [leaves, setLeaves] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await axios.get('https://employee-leave-management-backend-qqodtdesw.vercel.app/employee-leave/history', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLeaves(res.data);
      } catch (err) {
        console.error('Error fetching leave history:', err);
      }
    };

    fetchLeaves();
  }, [token]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const extractDate = (dateStr) => dateStr?.split('T')[0] || '';

  const filteredLeaves = leaves.filter(leave => {
    const matchesStatus = statusFilter === 'All' || leave.status === statusFilter;
    const matchesSearch = `${leave.leave_type} ${leave.department}`.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        My Leave History
      </Typography>

      <Tabs
        value={statusFilter}
        onChange={(e, val) => setStatusFilter(val)}
        sx={{ mb: 2 }}
        textColor="primary"
        indicatorColor="primary"
      >
        {['All', 'Pending', 'Approved', 'Not Approved'].map(status => (
          <Tab key={status} value={status} label={status} />
        ))}
      </Tabs>

      <TextField
        label="Search by leave type or department"
        variant="outlined"
        size="small"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sl. No.</TableCell>
              <TableCell>Leave Type</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Posting Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLeaves.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((leave, idx) => (
              <TableRow key={leave.id}>
                <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                <TableCell>{leave.leave_type}</TableCell>
                <TableCell>{extractDate(leave.from_date)}</TableCell>
                <TableCell>{extractDate(leave.to_date)}</TableCell>
                <TableCell>{leave.department || 'N/A'}</TableCell>
                <TableCell>
                  <Chip
                    label={leave.status}
                    color={leave.status === 'Approved' ? 'success' : leave.status === 'Not Approved' ? 'error' : 'warning'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{new Date(leave.posting_date).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredLeaves.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default LeaveHistory;
