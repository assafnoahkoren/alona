# Use the Node.js 20 image as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the rest of the application code to the working directory
COPY . .


# enter the server directory
WORKDIR /usr/src/app/server

# Install dependencies
RUN yarn install



# Expose the port the app runs on
ENV SERVER_PORT=8888
EXPOSE 8888

CMD ["/bin/sh", "-c", "cd /usr/src/app/server && yarn start"]