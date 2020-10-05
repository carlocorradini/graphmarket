FROM node:14

# Environment
ENV TIME_ZONE=Europe/Rome
ENV NODE_ENV=production

# Set the timezone in docker
RUN apk --update add tzdata \\
   && cp /usr/share/zoneinfo/Europe/Rome /etc/localtime \\
   && echo "Europe/Rome" > /etc/timezone \\
   && apk del tzdata

# Container app directory
WORKDIR /home/node/app

# Copy package.json file to work directory
COPY package.json .
# Copy package-lock.json file to work directory
COPY package-lock.json .

# Install all production packages
RUN npm ci --only=prod

# Copy all other source code to work directory
ADD . /home/node/app

# Compile TypeScript
RUN npm run build

# Set user
USER node

# Expose port
EXPOSE 8080

# Start
CMD [ "node", "build/app.js" ]
