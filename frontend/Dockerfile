# Build static assets with Vite
FROM node:22-alpine AS build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/. .
# Make calls relative to /api in prod (host Nginx will proxy /api to backend)
ENV VITE_API_BASE=/api
RUN npm run build
# The /app/dist folder now contains your production assets
