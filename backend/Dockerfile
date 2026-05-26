FROM node:20-alpine

WORKDIR /app

# Copy lock files and packages
COPY package*.json ./

# Install packages
RUN npm install

# Copy source code files
COPY . .

# Expose port
EXPOSE 5000

# Start development dev server or production server
CMD ["npm", "start"]
