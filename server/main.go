package main

import (

    "context"
    "fmt"
    "log"
    "net/http"
    "os"

    firebase "firebase.google.com/go/v4"
    "google.golang.org/api/option"
)

// Declare a global variable for the Firebase client


func main() {
    setFirebase()
    setconnection()
}

func setFirebase() {
    // Initialize the Firebase client
    var err error
    FirebaseClient, err = firebase.NewApp(context.Background(), nil, option.WithCredentialsFile("config/library-xpress-firebase.json"))
    if err != nil {
        log.Fatalf("error initializing app: %v\n", err)
    }
}

func setconnection() {

    r := Connect_router()

    port := os.Getenv("PORT")

    if port == "" {
        port = "8080" // Default port if not specified
    }
    fmt.Print("ACTIVE", port)
    log.Fatal(http.ListenAndServe(":"+port, r))
}
