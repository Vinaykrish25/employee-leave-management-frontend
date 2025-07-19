import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Avatar,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import HistoryIcon from "@mui/icons-material/History";
import LockResetIcon from "@mui/icons-material/LockReset";
import LogoutIcon from "@mui/icons-material/Logout";

const drawerWidth = 240;

const EmployeeLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState({ username: "", profile_image: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    const fetchUser = async () => {
      try {
        const res = await fetch(
          "https://employee-leave-management-backend-qqodtdesw.vercel.app/employee-profile/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (res.ok) {
          setUser({
            username: data.username,
            profile_image: data.profile_image,
          });
        }
      } catch (err) {
        console.error("Error fetching profile info:", err);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    try {
      await fetch("https://employee-leave-management-backend-qqodtdesw.vercel.app/users/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Logout failed:", err);
    }
    localStorage.clear();
    navigate("/login");
  };

  const links = [
    {
      label: "My Profile",
      path: "/employee/my-profile",
      icon: <AccountCircleIcon />,
    },
    {
      label: "Apply Leave",
      path: "/employee/apply-leave",
      icon: <AssignmentIndIcon />,
    },
    {
      label: "Leave History",
      path: "/employee/leave-history",
      icon: <HistoryIcon />,
    },
    {
      label: "Change Password",
      path: "/employee/change-password",
      icon: <LockResetIcon />,
    },
    { label: "Logout", onClick: handleLogout, icon: <LogoutIcon /> },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: 1201 }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6">Employee Panel</Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {user.username || "User"}
            </Typography>
            {user.profile_image ? (
              <Avatar
                alt={user.username}
                src={`http://localhost:5000${user.profile_image}`} // ✅ Add server path prefix if needed
                sx={{ width: 36, height: 36 }}
              />
            ) : (
              <Avatar sx={{ width: 36, height: 36 }}>
                {user.username?.charAt(0)?.toUpperCase() || "U"}
              </Avatar>
            )}
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
            {links.map(({ label, path, icon, onClick }) => (
              <ListItem key={label} disablePadding>
                <ListItemButton
                  component={path ? Link : "button"}
                  to={path}
                  onClick={onClick}
                  selected={location.pathname === path}
                >
                  {icon}&nbsp;
                  <ListItemText primary={label} />
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
  );
};

export default EmployeeLayout;
