FROM node:22-alpine

WORKDIR /app

COPY package.json bun.lock ./
RUN npm install -g bun && bun install

COPY . .

EXPOSE 3000

CMD ["bun", "run", "dev"]
