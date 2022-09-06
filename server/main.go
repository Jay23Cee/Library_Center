package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	setconnection()
}

func setconnection() {

	r := Connect_router()
	// Mount the admin sub-router
	err := godotenv.Load()
    if err != nil {
        log.Fatalf("err loading: %v", err)
    }
	port := os.Getenv("PORT")

	fmt.Print("THIS IS PORT", port)
	if port == "" {
		port = "8080" // Default port if not specified
	}
	fmt.Print("ACTIVE", port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}
