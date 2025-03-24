import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  useToast,
  Heading,
  useColorModeValue,
  Card,
  CardBody,
  CardHeader,
  Container,
  SimpleGrid,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Badge,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  useDisclosure,
  Flex,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import axios from 'axios';

const MotionBox = motion(Box);

function Statistics() {
  const [habits, setHabits] = useState([]);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('yellow.200', 'yellow.700');

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

  const handleClearAllHabits = async () => {
    try {
      // Delete all habits
      await Promise.all(
        habits.map(habit => axios.delete(`http://localhost:5000/api/habits/${habit._id}`))
      );
      
      setHabits([]);
      toast({
        title: 'All habits cleared',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Error clearing habits',
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

  const calculateOverallCompletionRate = () => {
    if (habits.length === 0) return 0;
    const totalRate = habits.reduce((sum, habit) => sum + calculateCompletionRate(habit), 0);
    return Math.round(totalRate / habits.length);
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Flex justify="space-between" align="center" mb={8}>
        <Heading 
          size="xl" 
          bgGradient="linear(to-r, yellow.400, yellow.600)" 
          bgClip="text"
          textShadow="2px 2px 4px rgba(0,0,0,0.1)"
        >
          Statistics
        </Heading>
        <Button
          colorScheme="red"
          variant="outline"
          onClick={onOpen}
          _hover={{ transform: 'scale(1.05)', boxShadow: 'lg' }}
          transition="all 0.2s"
        >
          Clear All Habits
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
          <CardHeader bg="yellow.50" borderBottom="2px" borderColor={borderColor}>
            <Heading 
              size="lg" 
              bgGradient="linear(to-r, yellow.400, yellow.600)" 
              bgClip="text"
              textShadow="2px 2px 4px rgba(0,0,0,0.1)"
            >
              Overall Progress
            </Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={6} align="stretch">
              <Stat>
                <StatLabel>Overall Completion Rate</StatLabel>
                <StatNumber>{calculateOverallCompletionRate()}%</StatNumber>
                <StatHelpText>Average completion rate across all habits</StatHelpText>
              </Stat>
              <Progress 
                value={calculateOverallCompletionRate()} 
                colorScheme="yellow"
                size="lg"
                borderRadius="full"
              />
            </VStack>
          </CardBody>
        </Card>
      </MotionBox>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mt={8}>
        {habits.map((habit) => (
          <MotionBox
            key={habit._id}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Card
              bg={bgColor}
              borderWidth="2px"
              borderColor={borderColor}
              _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
              transition="all 0.2s"
            >
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  <HStack justify="space-between">
                    <Heading size="md">{habit.name}</Heading>
                    <Badge colorScheme="yellow">{habit.frequency}</Badge>
                  </HStack>
                  {habit.description && (
                    <Text color="gray.600">{habit.description}</Text>
                  )}
                  <Progress 
                    value={calculateCompletionRate(habit)} 
                    colorScheme="yellow"
                    size="sm"
                    borderRadius="full"
                  />
                  <Stat>
                    <StatLabel>Completion Rate</StatLabel>
                    <StatNumber>{calculateCompletionRate(habit)}%</StatNumber>
                    <StatHelpText>Based on {habit.frequency} frequency</StatHelpText>
                  </Stat>
                </VStack>
              </CardBody>
            </Card>
          </MotionBox>
        ))}
      </SimpleGrid>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Clear All Habits
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete all habits? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleClearAllHabits} ml={3}>
                Clear All
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
}

export default Statistics; 