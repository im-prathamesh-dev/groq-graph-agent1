FROM node:20-alpine

WORKDIR /app

# Copy package configurations
COPY package*.json ./

# Install packages
RUN npm install

# Copy codebase
COPY . .

# Expose port
EXPOSE 5173

# Start Vite dev host mapping
CMD ["npm", "run", "dev", "--", "--host"]
