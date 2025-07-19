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
import axiosInstance from '../../utils/axiosInstance';

const AdminDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ department_code: '', name: '', short_name: '' });
  const [editingId, setEditingId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const token = localStorage.getItem('token');

  const fetchDepartments = async () => {
    const res = await axiosInstance.get('/departments', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setDepartments(res.data);
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await axiosInstance.put(`/departments/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSnackbar({ open: true, message: 'Department updated successfully', severity: 'success' });
      } else {
        await axiosInstance.post('/departments', form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSnackbar({ open: true, message: 'Department added successfully', severity: 'success' });
      }
      setOpen(false);
      setForm({ department_code: '', name: '', short_name: '' });
      setEditingId(null);
      fetchDepartments();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Operation failed', severity: 'error' });
    }
  };

  const handleEdit = (dept) => {
    setForm({
      department_code: dept.department_code,
      name: dept.name,
      short_name: dept.short_name
    });
    setEditingId(dept.id);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/departments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSnackbar({ open: true, message: 'Department deleted', severity: 'info' });
      fetchDepartments();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Cannot delete department. It is assigned to one or more employees', severity: 'error' });
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredDepartments = departments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(search.toLowerCase()) ||
      dept.department_code.toLowerCase().includes(search.toLowerCase()) ||
      dept.short_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Manage Departments
      </Typography>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Add Department
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
              <TableCell>Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Short Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDepartments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((dept, idx) => (
              <TableRow key={dept.id}>
                <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                <TableCell>{dept.department_code}</TableCell>
                <TableCell>{dept.name}</TableCell>
                <TableCell>{dept.short_name}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => handleEdit(dept)}>Edit</Button>
                  <Button size="small" color="error" onClick={() => handleDelete(dept.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredDepartments.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editingId ? 'Edit' : 'Add'} Department</DialogTitle>
        <DialogContent>
          <TextField
            label="Department Code"
            fullWidth
            margin="dense"
            value={form.department_code}
            onChange={(e) => setForm({ ...form, department_code: e.target.value })}
          />
          <TextField
            label="Department Name"
            fullWidth
            margin="dense"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            label="Short Name"
            fullWidth
            margin="dense"
            value={form.short_name}
            onChange={(e) => setForm({ ...form, short_name: e.target.value })}
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

export default AdminDepartments;
