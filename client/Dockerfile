
FROM node:alpine AS builder
WORKDIR /client/app
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
ENV REACT_APP_URL="https://librarycenter-production.up.railway.app"
RUN npm install --force
RUN npm run build
EXPOSE $PORT
CMD ["npm","run", "start:prod "]


# # nginx state for serving content
# FROM nginx:alpine
# # Set working directory to nginx asset directory
# WORKDIR /usr/share/nginx/html
# # Remove default nginx static assets
# RUN rm -rf ./*
# # Copy static assets from builder stage
# COPY --from=builder /app/build .
# # Containers run nginx with global directives and daemon off
# ENTRYPOINT ["nginx", "-g", "daemon off;"]