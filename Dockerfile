# Stage 1: Build frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build   # Vite build output -> /dist

# Stage 2: Backend / Production
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY --from=frontend-build /app/dist ./public
COPY server.js .
EXPOSE 5173
CMD ["node", "server.js"]
