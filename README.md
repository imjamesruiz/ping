# HabitTracker

A simple full-stack app used for tracking daily habits and staying on that grind built with React and Node.js.

## Features

- Create and manage habits
- Track habit completion
- View habit statistics
- Daily, weekly, and monthly habit tracking
- Modern and responsive UI

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Setup

1. Clone the repository
2. Install backend dependencies:
   ```bash
   cd server
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd client
   npm install
   ```

## Running the Application

1. Start the backend server:
   ```bash
   cd server
   npm run dev
   ```

2. Start the frontend development server:
   ```bash
   cd client
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Technologies Used

- Frontend:
  - React
  - Chakra UI
  - React Router
  - Axios

- Backend:
  - Node.js
  - Express
  - File-based storage (JSON)

## API Endpoints

- GET `/api/habits` - Get all habits
- POST `/api/habits` - Create a new habit
- PUT `/api/habits/:id` - Update a habit
- DELETE `/api/habits/:id` - Delete a habit
- POST `/api/habits/:id/complete` - Mark a habit as complete 
