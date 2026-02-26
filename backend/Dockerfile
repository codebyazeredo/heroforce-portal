FROM node:20-alpine

WORKDIR /app

RUN npm install -g @nestjs/cli

COPY package*.json ./
RUN npm install

COPY . .

RUN rm -rf dist && npm run build

EXPOSE 3000

CMD ["npm", "run", "start:dev"]