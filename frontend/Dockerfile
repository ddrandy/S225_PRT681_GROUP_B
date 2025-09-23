# Build static assets with Vite
FROM node:23-alpine AS build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/. .
# Make calls relative to /api in prod (host Nginx will proxy /api to backend)
ENV NODE_ENV=production
EXPOSE 3000
RUN npm run dev
# The /app/dist folder now contains your production assets
