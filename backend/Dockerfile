FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client and build
RUN npx prisma generate
RUN npm run build

# Expose port
EXPOSE 3000

# Start server
CMD ["npm", "start"]
