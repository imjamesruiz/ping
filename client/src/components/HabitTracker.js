import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Button,
  useColorModeValue,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaQuoteLeft } from 'react-icons/fa';

const MotionBox = motion(Box);


function Home() {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('yellow.200', 'yellow.700');

  return (
    <Container maxW="container.xl" py={16}>
      <VStack spacing={12} align="center">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Heading
            size="2xl"
            bgGradient="linear(to-r, yellow.400, yellow.600)"
            bgClip="text"
            textAlign="center"
            mb={4}
          >
            Welcome to HabitTracker
          </Heading>
          <Text fontSize="xl" textAlign="center" color="gray.600">
            Your journey to better habits starts here
          </Text>
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          bg={bgColor}
          p={8}
          borderRadius="lg"
          boxShadow="lg"
          borderWidth="2px"
          borderColor={borderColor}
          maxW="800px"
        >
          <Flex direction="column" align="center" textAlign="center">
            <Icon as={FaQuoteLeft} w={8} h={8} color="yellow.500" mb={4} />
            <Text fontSize="xl" fontStyle="italic" mb={4}>
              "You do not rise to the level of your goals. You fall to the level of your systems."
            </Text>
            <Text fontSize="md" color="gray.600">
              - James Clear, Atomic Habits
            </Text>
          </Flex>
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button
            size="lg"
            colorScheme="yellow"
            onClick={() => navigate('/add')}
            _hover={{ transform: 'scale(1.05)', boxShadow: 'lg' }}
            transition="all 0.2s"
          >
            Start Your Journey
          </Button>
        </MotionBox>
      </VStack>
    </Container>
  );
}

export default Home; 