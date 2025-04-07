import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  LinearProgress,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import { LocalFlorist, Delete, TrendingUp, WaterDrop } from '@mui/icons-material';
import axios from 'axios';

const MotionBox = motion(Box);

function Statistics() {
  const [habits, setHabits] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/habits');
      setHabits(response.data);
    } catch (error) {
      console.error('Error fetching habits:', error);
    }
  };

  const handleClearAllHabits = async () => {
    try {
      await Promise.all(
        habits.map(habit => axios.delete(`http://localhost:5000/api/habits/${habit._id}`))
      );
      setHabits([]);
      setOpenDialog(false);
    } catch (error) {
      console.error('Error clearing habits:', error);
    }
  };

  const calculateCompletionRate = (habit) => {
    const today = new Date();
    const startDate = new Date(habit.createdAt);
    const daysDiff = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 0) return 0;
    
    const expectedCompletions = habit.frequency === 'daily' 
      ? daysDiff 
      : habit.frequency === 'weekly' 
        ? Math.floor(daysDiff / 7)
        : Math.floor(daysDiff / 30);
    
    return Math.round((habit.completedDates.length / expectedCompletions) * 100);
  };

  const calculateOverallCompletionRate = () => {
    if (habits.length === 0) return 0;
    const totalRate = habits.reduce((sum, habit) => sum + calculateCompletionRate(habit), 0);
    return Math.round(totalRate / habits.length);
  };

  const getGrowthStage = (rate) => {
    if (rate >= 90) return { icon: <LocalFlorist sx={{ color: '#4A6741' }} />, label: 'Blooming' };
    if (rate >= 70) return { icon: <LocalFlorist sx={{ color: '#6B8C5F' }} />, label: 'Growing' };
    if (rate >= 40) return { icon: <WaterDrop sx={{ color: '#A9BFA6' }} />, label: 'Sprouting' };
    return { icon: <WaterDrop sx={{ color: '#A9BFA6' }} />, label: 'Seedling' };
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography
          variant="h3"
          sx={{
            background: 'linear-gradient(45deg, #4A6741 30%, #6B8C5F 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold',
          }}
        >
          Statistics
        </Typography>
        <Button
          variant="outlined"
          color="error"
          startIcon={<Delete />}
          onClick={() => setOpenDialog(true)}
          sx={{
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: 3,
            },
            transition: 'all 0.2s',
          }}
        >
          Clear All Habits
        </Button>
      </Stack>

      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          sx={{
            mb: 4,
            border: '2px solid',
            borderColor: '#4A6741',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 6,
            },
            transition: 'all 0.2s',
          }}
        >
          <CardHeader
            title="Overall Progress"
            sx={{
              bgcolor: 'rgba(74, 103, 65, 0.1)',
              borderBottom: '2px solid',
              borderColor: '#4A6741',
            }}
          />
          <CardContent>
            <Stack spacing={3}>
              <Box>
                <Typography variant="h4" color="primary" gutterBottom>
                  {calculateOverallCompletionRate()}%
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Average completion rate across all habits
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={calculateOverallCompletionRate()}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  bgcolor: 'rgba(74, 103, 65, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: '#4A6741',
                  },
                }}
              />
            </Stack>
          </CardContent>
        </Card>
      </MotionBox>

      <Grid container spacing={3}>
        {habits.map((habit) => {
          const completionRate = calculateCompletionRate(habit);
          const growthStage = getGrowthStage(completionRate);
          
          return (
            <Grid item xs={12} md={6} lg={4} key={habit._id}>
              <MotionBox
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    border: '2px solid',
                    borderColor: '#4A6741',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                    },
                    transition: 'all 0.2s',
                  }}
                >
                  <CardContent>
                    <Stack spacing={2}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">{habit.name}</Typography>
                        <Chip
                          icon={growthStage.icon}
                          label={growthStage.label}
                          sx={{
                            bgcolor: 'rgba(74, 103, 65, 0.1)',
                            color: '#4A6741',
                            '& .MuiChip-icon': {
                              color: 'inherit',
                            },
                          }}
                        />
                      </Stack>
                      {habit.description && (
                        <Typography variant="body2" color="text.secondary">
                          {habit.description}
                        </Typography>
                      )}
                      <Box>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                          <Typography variant="body2" color="text.secondary">
                            Completion Rate
                          </Typography>
                          <Typography variant="body2" color="primary">
                            {completionRate}%
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={completionRate}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: 'rgba(74, 103, 65, 0.1)',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: '#4A6741',
                            },
                          }}
                        />
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </MotionBox>
            </Grid>
          );
        })}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Clear All Habits</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete all your habits? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleClearAllHabits} color="error" variant="contained">
            Delete All
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Statistics; 