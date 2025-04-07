# Plan(t) - Habit Tracking App 🌱

Plan(t) is a beautiful, plant-themed habit tracking application that helps you grow positive habits in your life. Just like plants need consistent care to grow, habits need regular attention to become part of your routine.

## Features

- **Beautiful Plant-Themed UI**: Enjoy a calming, nature-inspired interface
- **Habit Management**: Create, track, and manage your habits
- **Multiple Tracking Frequencies**: Track habits daily, weekly, or monthly
- **Visual Progress Tracking**: See your habit growth with calendar and statistics views
- **Motivational Quotes**: Get inspired with wisdom from habit experts like James Clear
- **Responsive Design**: Works on desktop and mobile devices

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
   npm start
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
  - Material UI
  - Framer Motion (for animations)
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

## Project Structure

- `client/` - React frontend application
  - `src/components/` - React components
  - `src/styles/` - Theme and styling
- `server/` - Node.js backend application
  - `data/` - JSON file storage for habits

## Recent Updates

- Rebranded to "Plan(t)" with a plant-themed design
- Added a beautiful home page with feature cards
- Improved habit tracking functionality
- Enhanced error handling and user feedback
- Added success notifications for better user experience
