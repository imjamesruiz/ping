import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { theme } from './styles/theme';
import Navbar from './components/Navbar';
import HabitList from './components/HabitList';
import AddHabit from './components/AddHabit';
import Statistics from './components/Statistics';
import HabitCalendar from './components/HabitCalendar';
import Home from './components/Home';

// Add Google Fonts
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;500;600;700&family=Quicksand:wght@400;500;600;700&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/habits" element={<HabitList />} />
          <Route path="/add" element={<AddHabit />} />
          <Route path="/stats" element={<Statistics />} />
          <Route path="/calendar" element={<HabitCalendar />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 