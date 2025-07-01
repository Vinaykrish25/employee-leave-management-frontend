import React, { useState, useMemo, useCallback, useEffect } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  CircularProgress,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import Header from "../components/Header";
import { useLocation } from "react-router-dom";

const MainLayout = ({ children }) => {
  const [mode, setMode] = useState(
    localStorage.getItem("theme") === "dark" ? "dark" : "light"
  );
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const location = useLocation();

  const toggleTheme = useCallback(() => {
    const newMode = mode === "light" ? "dark" : "light";
    localStorage.setItem("theme", newMode);
    setMode(newMode);
  }, [mode]);

  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 500); // simulate loading delay
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  // Listen for snackbar messages from sessionStorage
  useEffect(() => {
    if (location.state?.loginMessage) {
      setSnackbar({
        open: true,
        message: location.state.loginMessage,
        severity: location.state.loginStatus || "info",
      });
      // Clear state manually if needed
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header toggleTheme={toggleTheme} themeMode={mode} />

      {loading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(255,255,255,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <CircularProgress color="primary" />
        </Box>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {children}
          <ToastContainer position="top-right" autoClose={3000} />
        </motion.main>
      </AnimatePresence>
    </ThemeProvider>
  );
};

export default MainLayout;
