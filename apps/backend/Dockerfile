FROM node:25-alpine
WORKDIR /app

COPY package*.json ./
RUN npm i --omit=dev

COPY src/prisma ./src/prisma
RUN npx prisma generate --schema=src/prisma/schema.prisma

COPY . .

EXPOSE 3000
CMD ["node","src/server.js"]
