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
  Button,
  Chip,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  TablePagination,
  TableSortLabel,
  Divider,
} from '@mui/material';
import axios from 'axios';

const AdminLeaveApplications = () => {
  const [leaves, setLeaves] = useState([]);
  const [selected, setSelected] = useState(null);
  const [remark, setRemark] = useState('');
  const [viewDetails, setViewDetails] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState('posting_date');
  const [sortDirection, setSortDirection] = useState('desc');
  const token = localStorage.getItem('token');

  const fetchLeaves = async () => {
    try {
      const url = statusFilter === 'All'
        ? 'https://employee-leave-management-backend-qqodtdesw.vercel.app/leave-details'
        : `https://employee-leave-management-backend-qqodtdesw.vercel.app/leaves/${statusFilter}`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeaves(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [statusFilter]);

  const handleAction = async (status) => {
    if (!selected?.id && !selected?.leave_id) return;
    const leaveId = selected.id || selected.leave_id;
    try {
      setLoadingAction(true);
      await axios.put(
        `https://employee-leave-management-backend-qqodtdesw.vercel.app/leaves/action/${leaveId}`,
        { status, admin_remark: remark },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSnackbar({ open: true, message: 'Leave status updated', severity: 'success' });
      setSelected(null);
      setRemark('');
      fetchLeaves();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Failed to update', severity: 'error' });
    } finally {
      setLoadingAction(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (field) => {
    const isAsc = sortField === field && sortDirection === 'asc';
    setSortField(field);
    setSortDirection(isAsc ? 'desc' : 'asc');
  };

  const extractDate = (dateStr) => dateStr?.split('T')[0] || '';

  const filteredLeaves = leaves.filter(leave => {
    const name = `${leave.first_name || ''} ${leave.last_name || ''}`;
    const type = leave.leave_type || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           type.toLowerCase().includes(searchTerm.toLowerCase());
  }).sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Leave Applications</Typography>

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
        label="Search by name or leave type"
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
              <TableCell>
                <TableSortLabel
                  active={sortField === 'first_name'}
                  direction={sortDirection}
                  onClick={() => handleSort('first_name')}
                >
                  Employee
                </TableSortLabel>
              </TableCell>
              <TableCell>Leave Type</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'posting_date'}
                  direction={sortDirection}
                  onClick={() => handleSort('posting_date')}
                >
                  Posting Date
                </TableSortLabel>
              </TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLeaves.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((leave, idx) => (
              <TableRow key={leave.id || leave.leave_id || idx}>
                <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                <TableCell>{leave.first_name} {leave.last_name}</TableCell>
                <TableCell>{leave.leave_type}</TableCell>
                <TableCell>{extractDate(leave.from_date)}</TableCell>
                <TableCell>{extractDate(leave.to_date)}</TableCell>
                <TableCell>{new Date(leave.posting_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Chip label={leave.status} color={leave.status === 'Approved' ? 'success' : leave.status === 'Not Approved' ? 'error' : 'warning'} size="small" />
                </TableCell>
                <TableCell>
                  <Button size="small" onClick={() => setViewDetails(leave)}>View</Button>
                  {leave.status === 'Pending' && (
                    <Button size="small" onClick={() => setSelected(leave)}>Take Action</Button>
                  )}
                </TableCell>
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
          rowsPerPageOptions={[10, 25, 50, 100]}
        />
      </Paper>

      <Dialog open={!!viewDetails} onClose={() => setViewDetails(null)}>
        <DialogTitle>Leave Details</DialogTitle>
        <DialogContent dividers>
          {viewDetails && (
            <Box>
              <Typography gutterBottom><strong>Employee:</strong> {viewDetails.first_name} {viewDetails.last_name}</Typography>
              <Typography gutterBottom><strong>Leave Type:</strong> {viewDetails.leave_type}</Typography>
              <Typography gutterBottom><strong>From:</strong> {extractDate(viewDetails.from_date)}</Typography>
              <Typography gutterBottom><strong>To:</strong> {extractDate(viewDetails.to_date)}</Typography>
              <Typography gutterBottom><strong>Description:</strong> {viewDetails.description}</Typography>
              <Typography gutterBottom><strong>Status:</strong> {viewDetails.status}</Typography>
              <Typography gutterBottom><strong>Posted On:</strong> {new Date(viewDetails.posting_date).toLocaleDateString()}</Typography>
              {viewDetails.admin_remark && (
                <Typography gutterBottom><strong>Admin Remark:</strong> {viewDetails.admin_remark}</Typography>
              )}
              {viewDetails.action_taken_date && (
                <Typography gutterBottom><strong>Action Taken Date:</strong> {new Date(viewDetails.action_taken_date).toLocaleDateString()}</Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDetails(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!selected} onClose={() => setSelected(null)}>
        <DialogTitle>Take Action on Leave</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Admin Remark"
            multiline
            minRows={2}
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelected(null)} disabled={loadingAction}>Cancel</Button>
          <Button onClick={() => handleAction('Approved')} color="success" disabled={loadingAction}>Approve</Button>
          <Button onClick={() => handleAction('Not Approved')} color="error" disabled={loadingAction}>Reject</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminLeaveApplications;
