package main

import (
	"bookapi/config"
	"fmt"
	"log"
	"net/http"
	"os"
)

// Declare a global variable for the Firebase client

func main() {
	config.InitializeFirebase()
	setconnection()
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
