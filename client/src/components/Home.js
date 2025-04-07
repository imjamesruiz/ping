import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Stack,
  Grid,
  Card,
  CardContent,
  CardActionArea,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from './Logo';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import BarChartIcon from '@mui/icons-material/BarChart';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

function Home() {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Track Daily Progress',
      description: 'Record your habits daily and watch your consistency grow',
      icon: <CalendarMonthIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      path: '/calendar',
    },
    {
      title: 'Add New Habits',
      description: 'Start cultivating new positive habits in your life',
      icon: <AddCircleOutlineIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      path: '/add',
    },
    {
      title: 'View Statistics',
      description: 'Analyze your progress with detailed insights',
      icon: <BarChartIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      path: '/stats',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Stack spacing={6} alignItems="center">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Logo size="large" />
          <Typography
            variant="h5"
            sx={{
              mt: 2,
              textAlign: 'center',
              color: 'text.secondary',
              fontFamily: 'Quicksand',
            }}
          >
            Nurture your habits, grow your life
          </Typography>
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 4,
              maxWidth: 800,
              background: 'rgba(74, 103, 65, 0.05)',
              border: '1px solid',
              borderColor: 'primary.light',
            }}
          >
            <Stack spacing={2} alignItems="center" textAlign="center">
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'Comfortaa',
                  color: 'primary.main',
                  fontStyle: 'italic',
                }}
              >
                "You do not rise to the level of your goals. You fall to the level of your systems."
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: 'text.secondary', fontFamily: 'Quicksand' }}
              >
                - James Clear, Atomic Habits
              </Typography>
            </Stack>
          </Paper>
        </MotionBox>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={feature.title}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                sx={{
                  height: '100%',
                  background: 'rgba(74, 103, 65, 0.03)',
                  border: '1px solid',
                  borderColor: 'primary.light',
                  '&:hover': {
                    background: 'rgba(74, 103, 65, 0.08)',
                  },
                }}
              >
                <CardActionArea onClick={() => navigate(feature.path)} sx={{ height: '100%' }}>
                  <CardContent>
                    <Stack spacing={2} alignItems="center" textAlign="center">
                      {feature.icon}
                      <Typography variant="h6" sx={{ fontFamily: 'Comfortaa' }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Quicksand' }}>
                        {feature.description}
                      </Typography>
                    </Stack>
                  </CardContent>
                </CardActionArea>
              </MotionCard>
            </Grid>
          ))}
        </Grid>

        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/add')}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              background: 'linear-gradient(45deg, #4A6741 30%, #6B8C5F 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #2C3E28 30%, #4A6741 90%)',
              },
            }}
          >
            Plant Your First Habit
          </Button>
        </MotionBox>
      </Stack>
    </Container>
  );
}

export default Home; 