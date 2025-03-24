import React from 'react';
import { ChakraProvider, CSSReset } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HabitList from './components/HabitList';
import AddHabit from './components/AddHabit';
import Statistics from './components/Statistics';
import HabitCalendar from './components/HabitCalendar';

function App() {
  return (
    <ChakraProvider>
      <CSSReset />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HabitList />} />
          <Route path="/add" element={<AddHabit />} />
          <Route path="/stats" element={<Statistics />} />
          <Route path="/calendar" element={<HabitCalendar />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App; 