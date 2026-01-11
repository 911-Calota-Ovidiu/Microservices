FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Expose the Order App's port
EXPOSE 5174

# Vite must run on 0.0.0.0 so the Shell can load it in the iframe
CMD ["npm", "run", "dev", "--", "--port", "5174", "--host", "0.0.0.0"]