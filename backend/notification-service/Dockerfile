# Use a slim Node image to keep the container lightweight
FROM node:20-slim

# Create the internal folder where the app lives
WORKDIR /app

# Copy dependency files first (optimizes build speed)
COPY package*.json ./
RUN npm install

# Copy the actual source code
COPY . .

# Start the service
CMD ["node", "index.js"]