# Calorie Macro Calculator

A personal calorie and macro nutrient tracking application built with React, Node.js, and TypeScript.

## Features

- Track daily food intake and macro nutrients (carbs, fats, proteins)
- Visualize daily consumption with interactive pie charts
- Custom food database for your frequently eaten foods
- Configurable daily calorie and macro nutrient goals
- Historical data storage for reviewing past days
- Fully responsive design for both mobile and web

## Project Structure

The project consists of two main parts:

- `client/`: React frontend application
- `server/`: Node.js Express backend API
- `data/`: Data storage directory (mounted as a volume in Docker)

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Docker and Docker Compose (for containerized deployment)

### Development Setup

1. Install dependencies:
   ```
   npm install
   cd client && npm install
   cd server && npm install
   ```

2. Start development servers:
   ```
   npm run dev
   ```
   This will start both the React client (on port 3000) and Express server (on port 3003).

### Building for Production

1. Build both client and server:
   ```
   npm run build
   ```

2. Start the production server:
   ```
   npm start
   ```

### Docker Deployment

1. Build the Docker image:
   ```
   npm run docker:build
   ```

2. Start the container:
   ```
   npm run docker:start
   ```
   This will start the container on port 3003.

3. Stop the container:
   ```
   npm run docker:stop
   ```

## Custom Docker Configuration

To deploy on your Docker host at 192.168.1.214, update the `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  calorie-calc:
    # ... other settings
    ports:
      - "3003:3003"
    # ... other settings
    networks:
      - calorie-network
```

You can access the application at http://192.168.1.214:3003 after starting the container.

## Data Persistence

The application stores all data in JSON files within the `data/` directory. When running in Docker, this directory is mounted as a volume to ensure data persistence between container restarts.

## Technical Details

- **Frontend**: React, TypeScript, React Router, Recharts
- **Backend**: Node.js, Express, TypeScript
- **Data Storage**: JSON files
- **Containerization**: Docker
- **Styling**: CSS with responsive design
