FROM golang:buster
WORKDIR "/library_center/server"
COPY /server/go.mod .
COPY /server/go.sum .
COPY ./server .
RUN go get -d -v
RUN go build -v
ENV REACT_APP_GO_URL=mongodb+srv://mongo:LOsLH6a40mcR0QzB@cluster0.esomu.mongodb.net/?retryWrites=true&w=majority
EXPOSE "8080"
CMD ["go", "run", "."]