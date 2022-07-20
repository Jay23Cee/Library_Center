package main

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func main() {

	r := chi.NewRouter()

	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	r.Use(middleware.Timeout(60 * time.Second))

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("hello"))
	})

	r.Post("/add", addbooks)
	r.Post("/edit", editbook)
	r.Get("/read", getBooks)
	r.Post("/delete", deletebook)

	// Mount the admin sub-router
	fmt.Print("ACTIVE")
	port := os.Getenv("PORT")
	if port == "" {
		port = ":8080" // Default port if not specified
	}
	http.ListenAndServe(port, r)

}
