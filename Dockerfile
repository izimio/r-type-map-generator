FROM node:18.2.0-alpine

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build
RUN npm install -g serve
EXPOSE 8081

CMD ["serve", "-s", "/app/dist", "-l", "3005" ]