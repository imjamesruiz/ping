import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
  useToast,
  Heading,
  useColorModeValue,
  Card,
  CardBody,
  Container,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MotionBox = motion(Box);

function AddHabit() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    frequency: 'daily',
  });
  const toast = useToast();
  const navigate = useNavigate();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('yellow.200', 'yellow.700');
  const hoverBg = useColorModeValue('yellow.50', 'yellow.900');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/habits', formData);
      toast({
        title: 'Habit created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/');
    } catch (error) {
      toast({
        title: 'Error creating habit',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.md" py={8}>
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
            <Heading 
              mb={6} 
              bgGradient="linear(to-r, yellow.400, yellow.600)" 
              bgClip="text"
              textShadow="2px 2px 4px rgba(0,0,0,0.1)"
            >
              Add New Habit
            </Heading>
            <form onSubmit={handleSubmit}>
              <VStack spacing={6}>
                <FormControl isRequired>
                  <FormLabel color="gray.700">Habit Name</FormLabel>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter habit name"
                    borderColor={borderColor}
                    _hover={{ borderColor: 'yellow.400' }}
                    _focus={{ borderColor: 'yellow.500', boxShadow: '0 0 0 1px yellow.500' }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel color="gray.700">Description</FormLabel>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter habit description"
                    borderColor={borderColor}
                    _hover={{ borderColor: 'yellow.400' }}
                    _focus={{ borderColor: 'yellow.500', boxShadow: '0 0 0 1px yellow.500' }}
                    rows={4}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="gray.700">Frequency</FormLabel>
                  <Select 
                    name="frequency" 
                    value={formData.frequency} 
                    onChange={handleChange}
                    borderColor={borderColor}
                    _hover={{ borderColor: 'yellow.400' }}
                    _focus={{ borderColor: 'yellow.500', boxShadow: '0 0 0 1px yellow.500' }}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </Select>
                </FormControl>

                <Button 
                  type="submit" 
                  colorScheme="yellow" 
                  width="full"
                  size="lg"
                  _hover={{ transform: 'scale(1.02)', boxShadow: 'lg' }}
                  transition="all 0.2s"
                >
                  Add Habit
                </Button>
              </VStack>
            </form>
          </CardBody>
        </Card>
      </MotionBox>
    </Container>
  );
}

export default AddHabit; 