#build stage
FROM node:alpine AS build
WORKDIR /home/ubuntu/projects/microservice-plazoleta
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

#prod stage
FROM node:alpine
WORKDIR /home/ubuntu/projects/microservice-plazoleta
ENV ENVIRONMENT=production
COPY --from=build /home/ubuntu/projects/microservice-plazoleta/dist/ ./dist
COPY package*.json ./
RUN npm install --only=production
RUN rm package*.json
EXPOSE 4000

CMD ["node", "dist/src/main.js"]
