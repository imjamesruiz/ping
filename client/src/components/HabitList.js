import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  LinearProgress,
  IconButton,
  Chip,
  Grid,
  Paper,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Delete as DeleteIcon, Add as AddIcon, LocalFlorist as FlowerIcon } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MotionBox = motion(Box);

function HabitList() {
  const [habits, setHabits] = useState([]);
  const theme = useTheme();
  const navigate = useNavigate();

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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/habits/${id}`);
      setHabits(prevHabits => prevHabits.filter(habit => habit._id !== id));
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  const handleComplete = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/habits/${id}/complete`);
      setHabits(prevHabits => 
        prevHabits.map(habit => {
          if (habit._id === id) {
            const today = new Date().toISOString().split('T')[0];
            if (!habit.completedDates.includes(today)) {
              return {
                ...habit,
                completedDates: [...habit.completedDates, today]
              };
            }
          }
          return habit;
        })
      );
    } catch (error) {
      console.error('Error completing habit:', error);
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

  const isHabitCompletedToday = (habit) => {
    const today = new Date().toISOString().split('T')[0];
    return habit.completedDates.includes(today);
  };

  const getGrowthStage = (completionRate) => {
    if (completionRate < 25) return 'seed';
    if (completionRate < 50) return 'sprout';
    if (completionRate < 75) return 'sapling';
    return 'tree';
  };

  const today = new Date();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography
          variant="h4"
          sx={{
            fontFamily: 'Comfortaa',
            color: 'primary.main',
            fontWeight: 600,
          }}
        >
          Your Garden for {today.toLocaleDateString()}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/add')}
          sx={{
            background: 'linear-gradient(45deg, #4A6741 30%, #6B8C5F 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #2C3E28 30%, #4A6741 90%)',
            },
          }}
        >
          Plant New Habit
        </Button>
      </Stack>

      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {habits.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: 'center',
              background: 'rgba(74, 103, 65, 0.05)',
              border: '1px solid',
              borderColor: 'primary.light',
            }}
          >
            <Typography variant="h6" color="primary.main" gutterBottom>
              Your Garden is Empty
            </Typography>
            <Typography color="text.secondary" paragraph>
              Start by planting your first habit seed and watch it grow!
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/add')}
              sx={{
                background: 'linear-gradient(45deg, #4A6741 30%, #6B8C5F 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #2C3E28 30%, #4A6741 90%)',
                },
              }}
            >
              Plant Your First Habit
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {habits.map((habit) => {
              const completionRate = calculateCompletionRate(habit);
              const growthStage = getGrowthStage(completionRate);
              const isCompleted = isHabitCompletedToday(habit);

              return (
                <Grid item xs={12} md={6} lg={4} key={habit._id}>
                  <MotionBox
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card
                      elevation={0}
                      sx={{
                        height: '100%',
                        background: isCompleted 
                          ? 'linear-gradient(135deg, rgba(74, 103, 65, 0.1) 0%, rgba(107, 140, 95, 0.1) 100%)'
                          : 'background.paper',
                        border: '1px solid',
                        borderColor: isCompleted ? 'primary.main' : 'primary.light',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        },
                      }}
                    >
                      <CardContent>
                        <Stack spacing={2}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6" sx={{ fontFamily: 'Comfortaa' }}>
                              {habit.name}
                            </Typography>
                            <Chip
                              label={isCompleted ? "Watered" : habit.frequency}
                              color={isCompleted ? "success" : "primary"}
                              size="small"
                            />
                          </Stack>
                          
                          {habit.description && (
                            <Typography variant="body2" color="text.secondary">
                              {habit.description}
                            </Typography>
                          )}

                          <Box sx={{ position: 'relative', height: 8 }}>
                            <LinearProgress
                              variant="determinate"
                              value={completionRate}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: 'rgba(74, 103, 65, 0.1)',
                                '& .MuiLinearProgress-bar': {
                                  background: 'linear-gradient(90deg, #4A6741 0%, #6B8C5F 100%)',
                                },
                              }}
                            />
                            <Typography
                              variant="caption"
                              sx={{
                                position: 'absolute',
                                right: 0,
                                top: -20,
                                color: 'text.secondary',
                              }}
                            >
                              {completionRate}% Growth
                            </Typography>
                          </Box>

                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Stack direction="row" spacing={1} alignItems="center">
                              <FlowerIcon 
                                sx={{ 
                                  color: isCompleted ? 'success.main' : 'primary.main',
                                  transform: `scale(${0.5 + (completionRate / 200)})`,
                                }} 
                              />
                              <Typography variant="body2" color="text.secondary">
                                {growthStage.charAt(0).toUpperCase() + growthStage.slice(1)}
                              </Typography>
                            </Stack>
                            <Stack direction="row" spacing={1}>
                              <Button
                                variant={isCompleted ? "contained" : "outlined"}
                                color={isCompleted ? "success" : "primary"}
                                onClick={() => handleComplete(habit._id)}
                                disabled={isCompleted}
                                size="small"
                              >
                                {isCompleted ? "Watered" : "Water"}
                              </Button>
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(habit._id)}
                                sx={{ color: 'error.main' }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Stack>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  </MotionBox>
                </Grid>
              );
            })}
          </Grid>
        )}
      </MotionBox>
    </Container>
  );
}

export default HabitList; 