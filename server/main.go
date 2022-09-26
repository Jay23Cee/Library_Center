package main

import (
	"fmt"
	"log"
	"net/http"
	"os"


)

func main() {
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
