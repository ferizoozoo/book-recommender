# Stage 1: Build the React application
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build # This creates the production build in a 'build' or 'dist' folder

# Stage 2: Serve the static files with Nginx
FROM nginx:alpine
# Copy the built React app from the 'build' stage to Nginx's html directory
COPY --from=build /app/build /usr/share/nginx/html
# Copy a custom Nginx configuration if needed (e.g., for routing or API proxying)
# COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]