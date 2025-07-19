import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Link,
  Paper,
  useMediaQuery,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";
import { jwtDecode } from "jwt-decode";

const LoginPage = () => {
  const [role, setRole] = useState("Admin");
  const [showPassword, setShowPassword] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        sessionStorage.setItem("loginMessage", "Logging in...");
        sessionStorage.setItem("loginStatus", "info");

        const response = await axiosInstance.post(
          "/users/login",
          values
        );
        const { token, role, username, profile_image } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("username", username);
        localStorage.setItem("profile_image", profile_image);

        sessionStorage.setItem("loginMessage", "Login Successful");
        sessionStorage.setItem("loginStatus", "success");

        navigate(
          role === "Admin" ? "/admin/dashboard" : "/employee/my-profile",
          {
            state: {
              loginMessage: "Login Successful",
              loginStatus: "success",
            },
          }
        );
      } catch (error) {
        const msg = error.response?.data?.message || "Login failed";

        navigate("/login", {
          state: {
            loginMessage: msg,
            loginStatus: "error",
          },
        });

        setErrors({ password: msg });
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role === "Admin") {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          navigate("/admin/dashboard");
        }
      } catch (err) {
        // if decoding fails, just let them stay on login
      }
    }
  }, [navigate]);

  return (
    <Box className="login-container">
      <Paper
        elevation={3}
        className="login-paper"
        sx={{ width: isMobile ? "100%" : 400 }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          {role} Login
        </Typography>

        <Box display="flex" justifyContent="center" mb={2}>
          <ToggleButtonGroup
            value={role}
            exclusive
            onChange={(e, newRole) => newRole && setRole(newRole)}
            size="small"
          >
            <ToggleButton value="Admin">Admin</ToggleButton>
            <ToggleButton value="Employee">User</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            margin="normal"
            value={formik.values.username}
            onChange={formik.handleChange}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            autoComplete="current-password"
            type={showPassword ? "text" : "password"}
            margin="normal"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={2}
          >
            {role === "Employee" && (
              <Link href="#" variant="body2" underline="hover">
                Forgot password?
              </Link>
            )}
            <Button
              type="submit"
              variant="contained"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginPage;
