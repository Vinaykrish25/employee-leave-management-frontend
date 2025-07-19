import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";

const EmployeeProfile = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          "https://employee-leave-management-backend.vercel.app/employee-profile/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load profile");
        }

        setFormData({
          username: data.username || "",
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          mobile_number: data.mobile_number || "",
          city: data.city || "",
          country: data.country || "",
          address: data.address || "",
          profile_image: data.profile_image || "",
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFormData((prev) => ({
        ...prev,
        profile_image: URL.createObjectURL(file),
      }));
    }
  };

  const handleUpdate = async () => {
    const form = new FormData();
    form.append("username", formData.username);
    form.append("first_name", formData.first_name);
    form.append("last_name", formData.last_name);
    form.append("email", formData.email);
    form.append("mobile_number", formData.mobile_number);
    if (selectedFile) {
      form.append("profile_image", selectedFile);
    }

    try {
      const res = await fetch(
        "https://employee-leave-management-backend.vercel.app/employee-profile/profile",
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        }
      );

      const result = await res.json();
      if (res.ok) {
        setEditing(false);
        setSnackbar({
          open: true,
          message: "Profile updated successfully",
          severity: "success",
        });
        if (result.profile_image) {
          setFormData((prev) => ({
            ...prev,
            profile_image: result.profile_image,
          }));
        }
      } else {
        setSnackbar({
          open: true,
          message: result.message || "Failed to update profile",
          severity: "error",
        });
      }
    } catch (err) {
      console.error("Update error:", err);
      setSnackbar({
        open: true,
        message: "Error updating profile",
        severity: "error",
      });
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Paper sx={{ p: 4 }}>
      <Box display="flex" alignItems="center" gap={2} mb={4}>
        <Avatar
          src={
            formData.profile_image
              ? `https://employee-leave-management-backend.vercel.app${formData.profile_image}`
              : ""
          }
          alt={formData.first_name}
          sx={{ width: 64, height: 64 }}
        >
          {!formData.profile_image && formData.first_name?.[0]}
        </Avatar>

        <Typography variant="h5">My Profile</Typography>
      </Box>

      <Grid container spacing={2}>
        {[
          { name: "username", label: "Username" },
          { name: "first_name", label: "First Name" },
          { name: "last_name", label: "Last Name" },
          { name: "email", label: "Email" },
          { name: "mobile_number", label: "Mobile Number" },
          { name: "city", label: "City" },
          { name: "country", label: "Country" },
          { name: "address", label: "Address" },
        ].map(({ name, label }) => (
          <Grid item xs={12} sm={6} key={name}>
            <TextField
              fullWidth
              label={label}
              name={name}
              value={formData[name] || ""}
              onChange={handleChange}
              disabled={!editing}
            />
          </Grid>
        ))}

        {editing && (
          <Grid item xs={12}>
            <Button variant="outlined" component="label">
              Upload Profile Image
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={handleImageChange}
              />
            </Button>
          </Grid>
        )}
      </Grid>

      <Box mt={3}>
        {editing ? (
          <>
            <Button variant="contained" onClick={handleUpdate} sx={{ mr: 2 }}>
              Save
            </Button>
            <Button variant="outlined" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </>
        ) : (
          <Button variant="contained" onClick={() => setEditing(true)}>
            Edit Profile
          </Button>
        )}
      </Box>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="outlined"
          sx={{
            width: "100%",
            borderLeft: `6px solid ${
              snackbar.severity === "success" ? "#4caf50" : "#f44336"
            }`,
            backgroundColor: "#fff",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default EmployeeProfile;
