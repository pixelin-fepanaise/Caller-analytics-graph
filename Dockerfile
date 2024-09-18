# Use an official Node.js alpine image as the base image
FROM node:alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files first (for dependency installation)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY . .

# Expose the Vite development server port (usually 5173)
EXPOSE 5173

# Run Vite's dev server
CMD ["npm", "run", "dev"]
