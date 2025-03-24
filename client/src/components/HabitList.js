import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  useToast,
  IconButton,
  Heading,
  Flex,
  useColorModeValue,
  Card,
  CardBody,
  CardHeader,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Container,
  SimpleGrid,
  Divider,
} from '@chakra-ui/react';
import { DeleteIcon, CheckIcon, AddIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MotionBox = motion(Box);

function HabitList() {
  const [habits, setHabits] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('yellow.200', 'yellow.700');
  const hoverBg = useColorModeValue('yellow.50', 'yellow.900');

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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/habits/${id}`);
      setHabits(prevHabits => prevHabits.filter(habit => habit._id !== id));
      toast({
        title: 'Habit deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error deleting habit',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
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
      toast({
        title: 'Habit marked as complete',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error marking habit as complete',
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

  const isHabitCompletedToday = (habit) => {
    const today = new Date().toISOString().split('T')[0];
    return habit.completedDates.includes(today);
  };

  const today = new Date();

  return (
    <Container maxW="container.xl" py={8}>
      <Flex justify="space-between" align="center" mb={8}>
        <Heading 
          size="xl" 
          bgGradient="linear(to-r, yellow.400, yellow.600)" 
          bgClip="text"
          textShadow="2px 2px 4px rgba(0,0,0,0.1)"
        >
          Your Habits for {today.toLocaleDateString()}
        </Heading>
        <Button
          leftIcon={<AddIcon />}
          colorScheme="yellow"
          onClick={() => navigate('/add')}
          size="lg"
          _hover={{ transform: 'scale(1.05)', boxShadow: 'lg' }}
          transition="all 0.2s"
        >
          Add New Habit
        </Button>
      </Flex>

      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          bg={bgColor}
          borderWidth="2px"
          borderColor={borderColor}
          _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
          transition="all 0.2s"
        >
          <CardBody>
            <VStack spacing={6} align="stretch">
              {habits.length === 0 ? (
                <Box
                  textAlign="center"
                  py={10}
                  px={6}
                  bg={bgColor}
                  borderRadius="lg"
                  borderWidth="2px"
                  borderColor={borderColor}
                  _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
                  transition="all 0.2s"
                >
                  <Heading size="md" mb={4} color="yellow.600">No Habits Yet</Heading>
                  <Text color="gray.600" mb={4}>
                    Start by adding your first habit to track your progress!
                  </Text>
                  <Button
                    leftIcon={<AddIcon />}
                    colorScheme="yellow"
                    onClick={() => navigate('/add')}
                    _hover={{ transform: 'scale(1.05)', boxShadow: 'lg' }}
                    transition="all 0.2s"
                  >
                    Add Your First Habit
                  </Button>
                </Box>
              ) : (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {habits.map((habit) => (
                    <MotionBox
                      key={habit._id}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card
                        bg={bgColor}
                        borderWidth="2px"
                        borderColor={isHabitCompletedToday(habit) ? 'green.400' : borderColor}
                        _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
                        transition="all 0.2s"
                      >
                        <CardBody>
                          <VStack align="stretch" spacing={4}>
                            <HStack justify="space-between">
                              <Heading size="md">{habit.name}</Heading>
                              <Badge 
                                colorScheme={isHabitCompletedToday(habit) ? "green" : "yellow"}
                                variant="solid"
                              >
                                {isHabitCompletedToday(habit) ? "Completed" : habit.frequency}
                              </Badge>
                            </HStack>
                            {habit.description && (
                              <Text color="gray.600">{habit.description}</Text>
                            )}
                            <Progress 
                              value={calculateCompletionRate(habit)} 
                              colorScheme={isHabitCompletedToday(habit) ? "green" : "yellow"}
                              size="sm"
                              borderRadius="full"
                            />
                            <HStack justify="space-between">
                              <Stat>
                                <StatLabel>Completion Rate</StatLabel>
                                <StatNumber>{calculateCompletionRate(habit)}%</StatNumber>
                                <StatHelpText>Based on {habit.frequency} frequency</StatHelpText>
                              </Stat>
                              <HStack>
                                <Button
                                  colorScheme={isHabitCompletedToday(habit) ? "green" : "yellow"}
                                  onClick={() => handleComplete(habit._id)}
                                  isDisabled={isHabitCompletedToday(habit)}
                                  _hover={{ transform: 'scale(1.05)', boxShadow: 'lg' }}
                                  transition="all 0.2s"
                                >
                                  {isHabitCompletedToday(habit) ? "Completed" : "Complete"}
                                </Button>
                                <Button
                                  colorScheme="red"
                                  variant="outline"
                                  onClick={() => handleDelete(habit._id)}
                                  _hover={{ transform: 'scale(1.05)', boxShadow: 'lg' }}
                                  transition="all 0.2s"
                                >
                                  Delete
                                </Button>
                              </HStack>
                            </HStack>
                          </VStack>
                        </CardBody>
                      </Card>
                    </MotionBox>
                  ))}
                </SimpleGrid>
              )}
            </VStack>
          </CardBody>
        </Card>
      </MotionBox>
    </Container>
  );
}

export default HabitList; 