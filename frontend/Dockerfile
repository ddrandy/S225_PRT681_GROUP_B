# Build static assets
FROM node:23-alpine AS build
WORKDIR /app
COPY frontend/package*.json ./
# If you don't have package-lock.json, use: RUN npm install
RUN npm ci
COPY frontend/. .
# Make API calls relative to /api when built
ENV VITE_API_BASE=/api
RUN npm run build

# Serve with nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /app/dist ./
# Single-page app fallback
RUN printf 'server { listen 80; root /usr/share/nginx/html; index index.html; location / { try_files $uri /index.html; } }' > /etc/nginx/conf.d/default.conf
EXPOSE 80
