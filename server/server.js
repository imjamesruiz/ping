const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const app = express();
const DATA_FILE = path.join(__dirname, 'data', 'habits.json');

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.join(__dirname, 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir);
    // Create empty habits.json file
    await writeHabits([]);
  }
}

// Read habits from file
async function readHabits() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // If file doesn't exist, create it with empty array
      await writeHabits([]);
      return [];
    }
    throw error;
  }
}

// Write habits to file
async function writeHabits(habits) {
  try {
    // Write to a temporary file first
    const tempFile = `${DATA_FILE}.tmp`;
    await fs.writeFile(tempFile, JSON.stringify(habits, null, 2));
    
    // Rename the temporary file to the actual file
    await fs.rename(tempFile, DATA_FILE);
  } catch (error) {
    console.error('Error writing habits to file:', error);
    throw new Error('Failed to save habits');
  }
}

// Initialize data directory
ensureDataDirectory().catch(console.error);

// Routes
// Get all habits
app.get('/api/habits', async (req, res) => {
  try {
    const habits = await readHabits();
    res.json(habits);
  } catch (error) {
    console.error('Error reading habits:', error);
    res.status(500).json({ message: 'Failed to fetch habits' });
  }
});

// Create new habit
app.post('/api/habits', async (req, res) => {
  try {
    const { name, description, frequency } = req.body;
    
    // Validate required fields
    if (!name || !frequency) {
      return res.status(400).json({ message: 'Name and frequency are required' });
    }

    const habits = await readHabits();
    const newHabit = {
      _id: Date.now().toString(),
      name,
      description: description || '',
      frequency,
      completedDates: [],
      createdAt: new Date().toISOString()
    };
    
    habits.push(newHabit);
    await writeHabits(habits);
    res.status(201).json(newHabit);
  } catch (error) {
    console.error('Error creating habit:', error);
    res.status(500).json({ message: 'Failed to create habit' });
  }
});

// Update habit
app.put('/api/habits/:id', async (req, res) => {
  try {
    const habits = await readHabits();
    const index = habits.findIndex(h => h._id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    habits[index] = { ...habits[index], ...req.body };
    await writeHabits(habits);
    res.json(habits[index]);
  } catch (error) {
    console.error('Error updating habit:', error);
    res.status(500).json({ message: 'Failed to update habit' });
  }
});

// Delete habit
app.delete('/api/habits/:id', async (req, res) => {
  try {
    const habits = await readHabits();
    const filteredHabits = habits.filter(h => h._id !== req.params.id);
    if (filteredHabits.length === habits.length) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    await writeHabits(filteredHabits);
    res.json({ message: 'Habit deleted successfully' });
  } catch (error) {
    console.error('Error deleting habit:', error);
    res.status(500).json({ message: 'Failed to delete habit' });
  }
});

// Mark habit as completed
app.post('/api/habits/:id/complete', async (req, res) => {
  try {
    const habits = await readHabits();
    const habit = habits.find(h => h._id === req.params.id);
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    
    // Add today's date to completedDates if not already present
    const today = new Date().toISOString().split('T')[0];
    if (!habit.completedDates.includes(today)) {
      habit.completedDates.push(today);
      await writeHabits(habits);
    }
    
    res.json(habit);
  } catch (error) {
    console.error('Error marking habit as complete:', error);
    res.status(500).json({ message: 'Failed to mark habit as complete' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 