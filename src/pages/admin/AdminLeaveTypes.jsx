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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  TablePagination
} from '@mui/material';
import axios from 'axios';

const AdminLeaveTypes = () => {
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ type: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const token = localStorage.getItem('token');

  const fetchLeaveTypes = async () => {
    const res = await axios.get('http://localhost:5000/api/leave-types', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setLeaveTypes(res.data);
  };

  useEffect(() => {
    fetchLeaveTypes();
  }, []);

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/leave-types/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSnackbar({ open: true, message: 'Leave type updated', severity: 'success' });
      } else {
        await axios.post('http://localhost:5000/api/leave-types', form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSnackbar({ open: true, message: 'Leave type added', severity: 'success' });
      }
      setOpen(false);
      setForm({ type: '', description: '' });
      setEditingId(null);
      fetchLeaveTypes();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Error occurred', severity: 'error' });
    }
  };

  const handleEdit = (type) => {
    setForm({ type: type.type, description: type.description });
    setEditingId(type.id);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/leave-types/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSnackbar({ open: true, message: 'Leave type deleted', severity: 'info' });
      fetchLeaveTypes();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Cannot delete leave type. It is used in one or more leave records', severity: 'error' });
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredTypes = leaveTypes.filter(type =>
    type.type.toLowerCase().includes(search.toLowerCase()) ||
    type.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Manage Leave Types
      </Typography>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Add Leave Type
        </Button>
        <TextField
          label="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
        />
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SL. No.</TableCell>
              <TableCell>Leave Type</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTypes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((type, idx) => (
              <TableRow key={type.id}>
                <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                <TableCell>{type.type}</TableCell>
                <TableCell>{type.description}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => handleEdit(type)}>Edit</Button>
                  <Button size="small" color="error" onClick={() => handleDelete(type.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredTypes.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editingId ? 'Edit' : 'Add'} Leave Type</DialogTitle>
        <DialogContent>
          <TextField
            label="Leave Type"
            fullWidth
            margin="dense"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          />
          <TextField
            label="Description"
            fullWidth
            margin="dense"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>{editingId ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminLeaveTypes;
