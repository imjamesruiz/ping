import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Select,
  Button,
  useToast,
  VStack,
  HStack,
  Text,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  List,
  ListItem,
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import Calendar from 'react-calendar';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';
import './HabitCalendar.css';

function HabitCalendar() {
  const [habits, setHabits] = useState([]);
  const [selectedHabit, setSelectedHabit] = useState('');
  const [completionDates, setCompletionDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('yellow.200', 'yellow.700');

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
      toast({
        title: 'Error fetching habits',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
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
      toast({
        title: 'History cleared successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Error clearing history',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
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
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading 
          size="xl" 
          bgGradient="linear(to-r, yellow.400, yellow.600)" 
          bgClip="text"
          textAlign="center"
        >
          Habit Calendar
        </Heading>

        <HStack spacing={4} justify="center">
          <Select
            placeholder="Select a habit"
            value={selectedHabit}
            onChange={(e) => setSelectedHabit(e.target.value)}
            maxW="300px"
          >
            <option value="">All Habits</option>
            {habits.map(habit => (
              <option key={habit._id} value={habit._id}>
                {habit.name}
              </option>
            ))}
          </Select>
          <Button
            colorScheme="red"
            onClick={onOpen}
            isDisabled={!selectedHabit}
          >
            Clear History
          </Button>
        </HStack>

        <Box 
          bg={bgColor}
          p={6} 
          borderRadius="lg" 
          boxShadow="lg"
          borderWidth="2px"
          borderColor={borderColor}
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
                  <Text fontSize="xs" color="green.500">
                    ✓
                  </Text>
                );
              }
              return null;
            }}
          />
        </Box>
      </VStack>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Completed Habits for {selectedDate?.toLocaleDateString()}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <List spacing={3}>
              {selectedDate && getCompletedHabitsForDate(selectedDate).map(habit => (
                <ListItem key={habit._id} display="flex" alignItems="center" justifyContent="space-between">
                  <Text>{habit.name}</Text>
                  <Badge colorScheme="green">Completed</Badge>
                </ListItem>
              ))}
              {selectedDate && getCompletedHabitsForDate(selectedDate).length === 0 && (
                <Text color="gray.500">No habits completed on this date</Text>
              )}
            </List>
          </ModalBody>
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Clear Habit History
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to clear the completion history for{' '}
              {selectedHabit === 'all' ? 'all habits' : habits.find(h => h._id === selectedHabit)?.name}?
              This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleClearHistory} ml={3}>
                Clear History
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
}

export default HabitCalendar; 