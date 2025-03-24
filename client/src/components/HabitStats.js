import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';

function HabitStats() {
  const [habits, setHabits] = useState([]);
  const toast = useToast();

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/habits');
      setHabits(response.data);
    } catch (error) {
      toast({
        title: 'Error fetching habits',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
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

  return (
    <Box>
      <Heading mb={6}>Habit Statistics</Heading>
      <VStack spacing={6} align="stretch">
        {habits.map((habit) => (
          <Box
            key={habit._id}
            p={4}
            bg="white"
            borderRadius="lg"
            boxShadow="sm"
          >
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              {habit.name}
            </Text>
            <HStack spacing={8}>
              <Stat>
                <StatLabel>Completion Rate</StatLabel>
                <StatNumber>{calculateCompletionRate(habit)}%</StatNumber>
                <StatHelpText>Based on {habit.frequency} frequency</StatHelpText>
              </Stat>
              <Stat>
                <StatLabel>Total Completions</StatLabel>
                <StatNumber>{habit.completedDates.length}</StatNumber>
                <StatHelpText>Since {new Date(habit.createdAt).toLocaleDateString()}</StatHelpText>
              </Stat>
            </HStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}

export default HabitStats; 