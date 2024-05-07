FROM node:alpine
WORKDIR /app
COPY ganache-config.json /app/ganache-config.json
RUN npm install -g ganache-cli
RUN apk add --no-cache bash
CMD ["ganache-cli", "-h", "0.0.0.0", "--port", "8545"]