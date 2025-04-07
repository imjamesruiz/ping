import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Container,
  Typography,
  Paper,
  Stack,
  InputAdornment,
  Alert,
  Snackbar,
} from '@mui/material';
import { motion } from 'framer-motion';
import { LocalFlorist as FlowerIcon, Grass as GrassIcon, CalendarMonth as CalendarIcon } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MotionBox = motion(Box);

function AddHabit() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    frequency: 'daily',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:5000/api/habits', formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/habits');
      }, 1500);
    } catch (error) {
      console.error('Error creating habit:', error);
      setError(error.response?.data?.message || 'Failed to create habit. Please try again.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 4,
            background: 'rgba(74, 103, 65, 0.05)',
            border: '1px solid',
            borderColor: 'primary.light',
          }}
        >
          <Stack spacing={4}>
            <Typography
              variant="h4"
              sx={{
                fontFamily: 'Comfortaa',
                color: 'primary.main',
                fontWeight: 600,
                textAlign: 'center',
              }}
            >
              Plant a New Habit
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  required
                  fullWidth
                  label="Habit Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="What habit would you like to grow?"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FlowerIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />

                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe how this habit will help you grow..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <GrassIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />

                <TextField
                  required
                  fullWidth
                  select
                  label="Growth Frequency"
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                >
                  <MenuItem value="daily">Daily Growth</MenuItem>
                  <MenuItem value="weekly">Weekly Growth</MenuItem>
                  <MenuItem value="monthly">Monthly Growth</MenuItem>
                </TextField>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{
                    mt: 2,
                    py: 1.5,
                    background: 'linear-gradient(45deg, #4A6741 30%, #6B8C5F 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #2C3E28 30%, #4A6741 90%)',
                    },
                  }}
                >
                  Plant This Habit
                </Button>
              </Stack>
            </form>
          </Stack>
        </Paper>
      </MotionBox>

      <Snackbar
        open={success}
        autoHideDuration={1500}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Habit planted successfully! Redirecting to your garden...
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default AddHabit; 