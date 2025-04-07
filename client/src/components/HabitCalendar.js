import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Select,
  MenuItem,
  Button,
  Stack,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Chip,
  FormControl,
  InputLabel,
} from '@mui/material';
import Calendar from 'react-calendar';
import { LocalFlorist as FlowerIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';
import './HabitCalendar.css';

function HabitCalendar() {
  const [habits, setHabits] = useState([]);
  const [selectedHabit, setSelectedHabit] = useState('');
  const [completionDates, setCompletionDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);

  useEffect(() => {
    fetchHabits();
  }, []);

  useEffect(() => {
    if (selectedHabit) {
      const habit = habits.find(h => h._id === selectedHabit);
      if (habit) {
        setCompletionDates(habit.completedDates);
      }
    } else {
      // If no habit is selected, show all completion dates
      const allDates = habits.reduce((dates, habit) => {
        return [...dates, ...habit.completedDates];
      }, []);
      setCompletionDates([...new Set(allDates)]); // Remove duplicates
    }
  }, [selectedHabit, habits]);

  const fetchHabits = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/habits');
      setHabits(response.data);
    } catch (error) {
      console.error('Error fetching habits:', error);
    }
  };

  const handleClearHistory = async () => {
    try {
      if (selectedHabit === 'all') {
        await Promise.all(habits.map(habit => 
          axios.put(`http://localhost:5000/api/habits/${habit._id}/clear`)
        ));
        setHabits(habits.map(habit => ({ ...habit, completedDates: [] })));
      } else {
        await axios.put(`http://localhost:5000/api/habits/${selectedHabit}/clear`);
        setHabits(habits.map(habit => 
          habit._id === selectedHabit 
            ? { ...habit, completedDates: [] }
            : habit
        ));
      }
      setCompletionDates([]);
      setIsClearDialogOpen(false);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const getCompletedHabitsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return habits.filter(habit => habit.completedDates.includes(dateStr));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
          Growth Calendar
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Select a Habit</InputLabel>
            <Select
              value={selectedHabit}
              label="Select a Habit"
              onChange={(e) => setSelectedHabit(e.target.value)}
            >
              <MenuItem value="">All Habits</MenuItem>
              {habits.map(habit => (
                <MenuItem key={habit._id} value={habit._id}>
                  {habit.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setIsClearDialogOpen(true)}
            disabled={!selectedHabit}
          >
            Clear History
          </Button>
        </Stack>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            background: 'rgba(74, 103, 65, 0.05)',
            border: '1px solid',
            borderColor: 'primary.light',
          }}
        >
          <Calendar
            value={completionDates.map(date => new Date(date))}
            tileClassName={({ date }) => {
              const dateStr = date.toISOString().split('T')[0];
              return completionDates.includes(dateStr) ? 'completed' : '';
            }}
            className="habit-calendar"
            fullWidth
            onClickDay={handleDateClick}
            tileContent={({ date }) => {
              const dateStr = date.toISOString().split('T')[0];
              if (completionDates.includes(dateStr)) {
                return (
                  <FlowerIcon
                    sx={{
                      fontSize: '1rem',
                      color: 'success.main',
                      position: 'absolute',
                      bottom: '2px',
                      right: '2px',
                    }}
                  />
                );
              }
              return null;
            }}
          />
        </Paper>
      </Stack>

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontFamily: 'Comfortaa' }}>
            Growth on {selectedDate?.toLocaleDateString()}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <List>
            {selectedDate && getCompletedHabitsForDate(selectedDate).map(habit => (
              <ListItem key={habit._id}>
                <ListItemText primary={habit.name} />
                <Chip
                  icon={<FlowerIcon />}
                  label="Completed"
                  color="success"
                  size="small"
                />
              </ListItem>
            ))}
            {selectedDate && getCompletedHabitsForDate(selectedDate).length === 0 && (
              <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                No habits completed on this date
              </Typography>
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isClearDialogOpen}
        onClose={() => setIsClearDialogOpen(false)}
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontFamily: 'Comfortaa' }}>
            Clear Growth History
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to clear the completion history for{' '}
            {selectedHabit === 'all' ? 'all habits' : habits.find(h => h._id === selectedHabit)?.name}?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsClearDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleClearHistory} color="error">
            Clear History
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default HabitCalendar; 