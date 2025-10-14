# --- FASE 1: CONSTRUCCIÓN (El Taller) ---
FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- FASE 2: SERVICIO (El Expositor) ---
FROM nginx:stable-alpine
COPY --from=frontend-build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]