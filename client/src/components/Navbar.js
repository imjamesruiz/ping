import React from 'react';
import { Box, Flex, Link, useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

function Navbar() {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'white');

  return (
    <Box 
      bg={bgColor} 
      px={4} 
      borderBottom="1px" 
      borderColor={borderColor}
      position="sticky"
      top={0}
      zIndex={1000}
    >
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Link
          as={RouterLink}
          to="/"
          fontSize="xl"
          fontWeight="bold"
          color="yellow.500"
          _hover={{ textDecoration: 'none', color: 'yellow.600' }}
        >
          HabitTracker
        </Link>
        <Flex gap={4}>
          <Link
            as={RouterLink}
            to="/"
            color={textColor}
            _hover={{ textDecoration: 'none', color: 'yellow.500' }}
          >
            Habits
          </Link>
          <Link
            as={RouterLink}
            to="/add"
            color={textColor}
            _hover={{ textDecoration: 'none', color: 'yellow.500' }}
          >
            Add Habit
          </Link>
          <Link
            as={RouterLink}
            to="/stats"
            color={textColor}
            _hover={{ textDecoration: 'none', color: 'yellow.500' }}
          >
            Statistics
          </Link>
          <Link
            as={RouterLink}
            to="/calendar"
            color={textColor}
            _hover={{ textDecoration: 'none', color: 'yellow.500' }}
          >
            Calendar
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
}

export default Navbar; 