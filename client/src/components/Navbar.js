import React from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Container,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import Logo from './Logo';

function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Habits', path: '/habits' },
    { label: 'Add Habit', path: '/add' },
    { label: 'Statistics', path: '/stats' },
    { label: 'Calendar', path: '/calendar' },
  ];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'primary.light',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            minHeight: 64,
          }}
        >
          <Box
            component={RouterLink}
            to="/"
            sx={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Logo size={isMobile ? 'small' : 'medium'} />
          </Box>

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={RouterLink}
                to={item.path}
                sx={{
                  color: 'text.primary',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: location.pathname === item.path ? '100%' : '0%',
                    height: '2px',
                    backgroundColor: 'primary.main',
                    transition: 'width 0.3s ease',
                  },
                  '&:hover::after': {
                    width: '100%',
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(74, 103, 65, 0.08)',
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar; 