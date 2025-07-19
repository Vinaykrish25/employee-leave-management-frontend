import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
  Pagination,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { toast } from "react-toastify";

const AdminEmployees = () => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [formData, setFormData] = useState({
    employee_code: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    gender: "",
    department_id: "",
    city: "",
    mobile_number: "",
    birth_date: "",
    country: "",
    address: "",
  });

  useEffect(() => {
    fetchDepartments();
    fetchEmployees();
  }, []);

  useEffect(() => {
    const filtered = employees.filter(
      (emp) =>
        `${emp.first_name} ${emp.last_name}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.mobile_number.includes(searchTerm)
    );
    setFilteredEmployees(filtered);
    setPage(1);
  }, [searchTerm, employees]);

  const fetchDepartments = async () => {
    try {
      const res = await fetch("https://employee-leave-management-backend-qqodtdesw.vercel.app/departments");
      const data = await res.json();
      setDepartments(data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await fetch("https://employee-leave-management-backend-qqodtdesw.vercel.app/employees");
      const data = await res.json();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = editMode
      ? `https://employee-leave-management-backend-qqodtdesw.vercel.app/employees/${formData.id}`
      : "https://employee-leave-management-backend-qqodtdesw.vercel.app/employees";
    const method = editMode ? "PUT" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        fetchEmployees();
        setOpenModal(false);
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error saving employee:", error);
      toast.error("Failed to save employee");
    }
  };

  const handleView = (employee) => {
    setViewData(employee);
  };

  const handleEdit = (employee) => {
    setFormData({ ...employee });
    setEditMode(true);
    setOpenModal(true);
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    try {
      const res = await fetch(
        `https://employee-leave-management-backend-qqodtdesw.vercel.app/employees/status/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        fetchEmployees();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const openAddModal = () => {
    setFormData({
      employee_code: "",
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      gender: "",
      department_id: "",
      city: "",
      mobile_number: "",
      birth_date: "",
      country: "",
      address: "",
    });
    setEditMode(false);
    setOpenModal(true);
  };

  const paginatedEmployees = filteredEmployees.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">Manage Employees</Typography>
        <Button variant="contained" onClick={openAddModal}>
          Add Employee
        </Button>
      </Box>

      <TextField
        fullWidth
        placeholder="Search employees..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2 }}
      />

      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sl. No.</TableCell>
              <TableCell>Employee Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedEmployees.map((emp, index) => (
              <TableRow key={emp.id}>
                <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                <TableCell>{emp.employee_code}</TableCell>
                <TableCell>
                  {emp.first_name} {emp.last_name}
                </TableCell>
                <TableCell>{emp.email}</TableCell>
                <TableCell>{emp.mobile_number}</TableCell>
                <TableCell>{emp.department}</TableCell>
                <TableCell>
                  <Chip
                    label={emp.status === "Active" ? "Active" : "Inactive"}
                    color={emp.status === "Active" ? "success" : "error"}
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex" flexWrap="nowrap" gap={1}>
                    <Button size="small" onClick={() => handleView(emp)}>
                      View
                    </Button>
                    <Button size="small" onClick={() => handleEdit(emp)}>
                      Edit
                    </Button>
                    <Button
                      size="small"
                      onClick={() => handleStatusToggle(emp.id, emp.status)}
                    >
                      {emp.status === "Active" ? "Deactivate" : "Activate"}
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        count={Math.ceil(filteredEmployees.length / rowsPerPage)}
        page={page}
        onChange={(e, value) => setPage(value)}
        color="primary"
        sx={{ display: "flex", justifyContent: "center" }}
      />

      {/* Add/Edit Modal */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editMode ? "Edit Employee" : "Add New Employee"}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Employee Code"
                  name="employee_code"
                  value={formData.employee_code}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Grid>
              {!editMode && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Grid>
              )}
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Department"
                  name="department_id"
                  value={formData.department_id}
                  onChange={handleChange}
                  required
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Mobile Number"
                  name="mobile_number"
                  value={formData.mobile_number}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Birth Date"
                  name="birth_date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.birth_date}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
            <DialogActions sx={{ mt: 2 }}>
              <Button onClick={() => setOpenModal(false)}>Cancel</Button>
              <Button variant="contained" color="primary" type="submit">
                {editMode ? "Update" : "Create"}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog
        open={!!viewData}
        onClose={() => setViewData(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Employee Details</DialogTitle>
        <DialogContent>
          {viewData && (
            <Box>
              <Typography>
                <strong>Name:</strong> {viewData.first_name}{" "}
                {viewData.last_name}
              </Typography>
              <Typography>
                <strong>Email:</strong> {viewData.email}
              </Typography>
              <Typography>
                <strong>Mobile:</strong> {viewData.mobile_number}
              </Typography>
              <Typography>
                <strong>Department:</strong> {viewData.department}
              </Typography>
              <Typography>
                <strong>Gender:</strong> {viewData.gender}
              </Typography>
              <Typography>
                <strong>City:</strong> {viewData.city}
              </Typography>
              <Typography>
                <strong>Country:</strong> {viewData.country}
              </Typography>
              <Typography>
                <strong>Birth Date:</strong> {viewData.birth_date}
              </Typography>
              <Typography>
                <strong>Address:</strong> {viewData.address}
              </Typography>
              <Typography>
                <strong>Status:</strong> {viewData.status}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewData(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminEmployees;
