# Use node:18-alpine as the base image
FROM node:18-alpine

# Set WORKDIR to /app
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package.json package-lock.json ./

# Run npm ci to install dependencies
RUN npm ci

# Copy the remaining application source code
COPY . .

# Expose port 5000
EXPOSE 5000

# Set CMD to start your server
CMD ["npm", "start"]
