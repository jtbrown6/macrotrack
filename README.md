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

- For development:
  - Node.js 16+ and npm
- For Docker deployment:
  - Docker and Docker Compose (no Node.js or npm required on the host)

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

1. Build the Docker image and start the container:
   ```
   docker-compose build
   docker-compose up -d
   ```
   This will build the image and start the container on port 3003.

2. Check container status:
   ```
   docker-compose ps
   ```

3. View container logs:
   ```
   docker-compose logs -f
   ```

4. Stop the container:
   ```
   docker-compose down
   ```

Note: These commands can be run on a Docker host without npm installed.

## Custom Docker Configuration

To deploy on your Docker host (e.g., at 192.168.1.214):

1. Clone this repository on your Docker host:
   ```
   git clone <repository-url>
   cd macrotrack
   ```

2. No need to install npm or Node.js on the Docker host - Docker will handle all dependencies.

3. Start the application using Docker Compose:
   ```
   docker-compose up -d
   ```

4. Access the application at http://192.168.1.214:3003 (replace with your Docker host's IP address).

The `docker-compose.yml` file already contains the necessary configuration:

```yaml
version: '3.8'

services:
  calorie-calc:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: calorie-calc
    restart: unless-stopped
    ports:
      - "3003:3003"
    volumes:
      - ./data:/app/data
    environment:
      - NODE_ENV=production
      - PORT=3003
      - DEBUG=app:*
    networks:
      - calorie-network

networks:
  calorie-network:
    driver: bridge
```

## Data Persistence

The application stores all data in JSON files within the `data/` directory. When running in Docker, this directory is mounted as a volume to ensure data persistence between container restarts.

## Technical Details

- **Frontend**: React, TypeScript, React Router, Recharts
- **Backend**: Node.js, Express, TypeScript
- **Data Storage**: JSON files
- **Containerization**: Docker
- **Styling**: CSS with responsive design
