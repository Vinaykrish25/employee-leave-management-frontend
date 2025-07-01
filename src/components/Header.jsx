import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, useMediaQuery } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import '../styles/Header.css';

const Header = ({ toggleTheme, themeMode }) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [animateLogo, setAnimateLogo] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && savedTheme !== themeMode) {
      toggleTheme();
    }
  }, [themeMode, toggleTheme]);

  const handleLogoHover = () => {
    setAnimateLogo(true);
    setTimeout(() => setAnimateLogo(false), 1000);
  };

  return (
    <AppBar position="static" color="default" elevation={2}>
      <Toolbar className="header-toolbar">
        <Box className="header-left" onMouseEnter={handleLogoHover}>
          <img
            src="/ELMS.png"
            alt="ELMS Logo"
            className={`header-logo ${animateLogo ? 'rotate-scale' : ''}`}
          />
          {!isMobile && (
            <Typography variant="h6" sx={{ ml: 2 }}>
              Employee Leave Management System
            </Typography>
          )}
        </Box>

        <IconButton color="inherit" onClick={toggleTheme}>
          {themeMode === 'dark' ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
