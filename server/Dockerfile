FROM golang:buster
WORKDIR "/my-app/server"
COPY go.mod .
COPY go.sum .
COPY . .
RUN go get -d -v
RUN go build -v
ENV REACT_APP_GO_URL=mongodb+srv://mongo:LOsLH6a40mcR0QzB@cluster0.esomu.mongodb.net/?retryWrites=true&w=majority

CMD ["bookapi.exe"]