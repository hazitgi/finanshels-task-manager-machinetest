# Use an official Node.js runtime as a parent image
FROM node:20.10.0-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json files to the container
COPY package*.json ./

# Install npm globally and install project dependencies
RUN npm install -g npm@10.2.5
RUN npm install --omit=dev

# Install Nest CLI globally
RUN npm install -g @nestjs/cli

# Copy the rest of the application files to the container
COPY . .

# Install Node.js types
RUN npm install --save-dev @types/node

# Build the NestJS project
RUN npm run build

# Expose the port that your NestJS app runs on
EXPOSE 3000

# Command to run the NestJS application
CMD ["npm", "run", "start:dev"]
