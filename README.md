# Task Management System

This project is a comprehensive task management system consisting of multiple microservices and a frontend client. It leverages modern technologies to provide a robust, scalable solution for task management with real-time notifications.

## Services

### 1. Task Service
- **Functionality**: Handles CRUD operations for tasks and publishes events to NATS streaming server.
- **Tech Stack**: Node.js, Express.js, MongoDB
- **Key Features**:
  - RESTful API for task management
  - Integration with NATS for event publishing

### 2. Notification Service
- **Functionality**: Subscribes to NATS events and emits notifications via WebSocket.
- **Tech Stack**: Node.js, Socket.io
- **Key Features**:
  - Real-time notification system
  - NATS subscription for event-driven architecture

### 3. Client (Frontend)
- **Functionality**: Provides a user interface for task management.
- **Tech Stack**: Next.js, React
- **Key Features**:
  - Kanban board using react-beautiful-dnd
  - Real-time updates via WebSocket connection

## Architecture

The system follows a microservices architecture, with each service running in its own container. Communication between services is facilitated by NATS streaming server, ensuring loose coupling and scalability.

## Prerequisites

- Docker and Docker Compose
- Minikube (for Kubernetes deployment)
- Skaffold
- kubectl

## Running the Project

### Using Docker Compose

1. Clone the repository:
   ```
   git clone [your-repo-url]
   cd [your-repo-name]
   ```

2. Start the services:
   ```
   docker-compose up
   ```

This will start all the services defined in the `docker-compose.yml` file.

### Using Kubernetes (Minikube) and Skaffold

1. Start Minikube:
   ```
   minikube start
   ```

2. Use Skaffold for development:
   ```
   skaffold dev
   ```

This will build and deploy your services to the Minikube cluster, and watch for changes.

## Service Details

### Task Service (Port 3000)
- Manages tasks in the MongoDB database
- Exposes RESTful API for task CRUD operations
- Publishes task-related events to NATS

### Notification Service (Port 4000)
- Subscribes to task events from NATS
- Emits real-time notifications to connected clients via WebSocket

### NATS Streaming Server
- Facilitates event-driven communication between services

### MongoDB (Port 27017)
- Stores task data

### Client (Next.js Frontend)
- Provides a user-friendly interface for task management
- Implements a Kanban board using react-beautiful-dnd
- Connects to the backend services for data and real-time updates

## Configuration

Environment variables and service configurations are defined in the `docker-compose.yml` file and Kubernetes manifests. Ensure to update these configurations as needed for your environment.

## Development

For local development:
1. Navigate to each service directory (`task`, `notifications`, `client`)
2. Install dependencies: `npm install`
3. Start the service: `npm run start:dev` (or the appropriate npm script)

## Deployment

The project is configured for easy deployment using either Docker Compose or Kubernetes (with Skaffold). Choose the method that best suits your infrastructure needs.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[Specify your license here]