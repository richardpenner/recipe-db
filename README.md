# Recipe Database

A Vue.js application for managing recipes with a SQLite backend.

## Features

- View list of recipes
- Create new recipes
- Edit existing recipes
- Delete recipes
- Local state persistence
- Clean, modern UI with Tailwind CSS

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

## Setup

1. Install frontend dependencies:
```bash
npm install
```

2. Install backend dependencies:
```bash
cd server
npm install
```

## Running the Application

1. Start the backend server:
```bash
cd server
npm run dev
```

2. In a new terminal, start the frontend development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Project Structure

- `/src` - Frontend Vue.js application
  - `/views` - Vue components for different pages
  - `/router` - Vue Router configuration
  - `/components` - Reusable Vue components
- `/server` - Backend Express.js server with SQLite database

## Technologies Used

- Vue.js 3
- Vue Router
- Tailwind CSS
- Express.js
- SQLite (better-sqlite3)
- @vueuse/core (for local storage)
