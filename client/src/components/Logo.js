import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const LeafIcon = styled('div')(({ theme }) => ({
  width: '32px',
  height: '32px',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
    borderRadius: '50% 0 50% 50%',
    transform: 'rotate(-45deg)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '8px',
    height: '16px',
    background: theme.palette.primary.dark,
    borderRadius: '4px',
    bottom: '-4px',
    left: '50%',
    transform: 'translateX(-50%)',
  },
}));

const Logo = ({ size = 'medium' }) => {
  const sizes = {
    small: { icon: 24, typography: 'h3' },
    medium: { icon: 32, typography: 'h2' },
    large: { icon: 48, typography: 'h1' },
  };

  return (
    <LogoContainer>
      <LeafIcon style={{ width: `${sizes[size].icon}px`, height: `${sizes[size].icon}px` }} />
      <Typography
        variant={sizes[size].typography}
        sx={{
          fontFamily: '"Comfortaa", cursive',
          color: 'primary.main',
          fontWeight: 600,
        }}
      >
        Plan(t)
      </Typography>
    </LogoContainer>
  );
};

export default Logo; 