# Build
FROM node:22-alpine AS build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/. .
ENV VITE_API_BASE=/api
RUN npm run build

# Serve
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /app/dist ./
RUN printf 'server { listen 80; root /usr/share/nginx/html; index index.html; location / { try_files $uri /index.html; } }' > /etc/nginx/conf.d/default.conf
EXPOSE 80
