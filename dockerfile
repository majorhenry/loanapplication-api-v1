# Use the latest LTS Node image
FROM node:20-alpine3.16

# Create app directory
WORKDIR /app

# Expose the port your app runs on (customize as needed)
EXPOSE 3000

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install 

# Copy the rest of the application
COPY . ./

# Start the application
CMD ["yarn", "start"]
