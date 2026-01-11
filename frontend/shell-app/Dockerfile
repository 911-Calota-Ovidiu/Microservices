FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Expose the Shell's port
EXPOSE 5173

# Vite needs --host 0.0.0.0 to be visible outside the container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]