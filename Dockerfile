FROM node:16-alpine3.11 as build-node
RUN apk --no-cache --virtual build-dependencies add \
        python \
        make \
        g++
FROM golang:buster
WORKDIR "/library_center/server"
COPY /server/go.mod .
COPY /server/go.sum .
COPY ./server .
RUN go get -d -v
RUN go build -v
ENV REACT_APP_GO_URL=mongodb+srv://mongo:LOsLH6a40mcR0QzB@cluster0.esomu.mongodb.net/?retryWrites=true&w=majority
EXPOSE "8080"
 EXPOSE "3000"
# This allows Heroku bind its PORT the Apps port 
# since Heroku needs to use its own PORT before the App can be made accessible to the World
EXPOSE $PORT
CMD ["go", "run", "."]



# FROM node:alpine AS builder
# WORKDIR "/library_center/client"
# COPY client/library_frontend/package.json ./
# COPY client/library_frontend/package-lock.json ./
# COPY client/library_frontend ./
# ENV REACT_APP_URL="http://localhost:8080"
# RUN npm install
# EXPOSE 3000
# CMD ["npm","run","build"]


# # nginx state for serving content
# FROM nginx:alpine
# # Set working directory to nginx asset directory
# WORKDIR /usr/share/nginx/html
# # Remove default nginx static assets
# RUN rm -rf ./*
# # Copy static assets from builder stage
# COPY --from=builder /library_center/client/build .
# # Containers run nginx with global directives and daemon off
# ENTRYPOINT ["nginx", "-g", "daemon off;"]
