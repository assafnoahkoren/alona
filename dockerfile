# Use the Node.js 20 image as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the rest of the application code to the working directory
COPY . .


# Enter the client directory
WORKDIR /usr/src/app/client

# Install client dependencies and build the client
RUN yarn install && yarn build

# Copy the build output to the server's static directory
RUN cp -r /usr/src/app/client/dist/* /usr/src/app/server/static/
WORKDIR /usr/src/app/server

# Install dependencies
RUN yarn install



# Expose the port the app runs on
ENV SERVER_PORT=8888
EXPOSE 8888

CMD ["/bin/sh", "-c", "cd /usr/src/app/server && yarn start"]
