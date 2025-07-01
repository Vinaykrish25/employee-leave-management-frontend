import React, { useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Avatar } from "@mui/material";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  AppBar,
  Typography,
  CssBaseline,
  ListItemButton,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import CategoryIcon from "@mui/icons-material/Category";
import PeopleIcon from "@mui/icons-material/People";
import LockResetIcon from "@mui/icons-material/LockReset";
import LogoutIcon from "@mui/icons-material/Logout";
import { jwtDecode } from "jwt-decode";
import { Snackbar, Alert } from "@mui/material";

const drawerWidth = 240;

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const username = localStorage.getItem("username") || "Admin";
  const profileImage = localStorage.getItem("profile_image");

  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const isLoginPage = location.pathname === "/login";

    if (!token || !role) {
      if (!isLoginPage) navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.clear();
        navigate("/login");
      } else if (role !== "Admin") {
        localStorage.clear();
        navigate("/login");
      }
    } catch (err) {
      localStorage.clear();
      navigate("/login");
    }
  }, [navigate, location.pathname]);

  const links = [
    { label: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
    {
      label: "Departments",
      icon: <CategoryIcon />,
      path: "/admin/departments",
    },
    {
      label: "Leave Types",
      icon: <CategoryIcon />,
      path: "/admin/leave-types",
    },
    { label: "Employees", icon: <PeopleIcon />, path: "/admin/employees" },
    {
      label: "Leave Applications",
      icon: <GroupIcon />,
      path: "/admin/leave-applications",
    },
    {
      label: "Change Password",
      icon: <LockResetIcon />,
      path: "/admin/change-password",
    },
    {
      label: "Logout",
      icon: <LogoutIcon />,
      onClick: async () => {
        const token = localStorage.getItem("token");
        try {
          await fetch("http://localhost:5000/api/users/logout", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (error) {
          console.error("Logout error:", error);
        }

        localStorage.clear();

        setSnackbar({
          open: true,
          message: "Logged out successfully",
          severity: "success",
        });

        // Delay navigate to show toast
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 1000);
      },
    },
  ];

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="fixed" sx={{ zIndex: 1201 }}>
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              Admin Panel
            </Typography>
            <Box
              sx={{
                marginLeft: "auto",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography variant="body1">{username}</Typography>
              <Avatar src={profileImage || undefined}>
                {!profileImage && username.charAt(0).toUpperCase()}
              </Avatar>
            </Box>
          </Toolbar>
        </AppBar>

        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <Toolbar />

          <Box sx={{ overflow: "auto" }}>
            <List>
              {links.map(({ label, icon, path, onClick }) => (
                <ListItem key={label} disablePadding>
                  <ListItemButton
                    selected={location.pathname === path}
                    onClick={() => {
                      if (onClick) {
                        onClick();
                      } else {
                        navigate(path);
                      }
                    }}
                  >
                    {icon && <ListItemText primary={label} />}
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Outlet />
        </Box>
      </Box>

      {/* Move snackbar here outside layout */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ zIndex: 2000 }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AdminLayout;
