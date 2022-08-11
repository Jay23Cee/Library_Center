package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/jwtauth/v5"
)

var tokenAuth *jwtauth.JWTAuth

func init() {
	tokenAuth = jwtauth.New("HS256", []byte("secret"), nil)

	// For debugging/example purposes, we generate and print
	// a sample jwt token with claims `user_id:123` here:
	_, tokenString, _ := tokenAuth.Encode(map[string]interface{}{"user_id": 123})
	fmt.Printf("DEBUG: a sample jwt is %s\n\n", tokenString)
}

func main() {

	r := chi.NewRouter()

	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	r.Use(middleware.Timeout(60 * time.Second))

	// Protected routes
	r.Group(func(r chi.Router) {
		// Seek, verify and validate JWT tokens
		r.Use(jwtauth.Verifier(tokenAuth))

		// Handle valid / invalid tokens. In this example, we use
		// the provided authenticator middleware, but you can write your
		// own very easily, look at the Authenticator method in jwtauth.go
		// and tweak it, its not scary.
		r.Use(jwtauth.Authenticator)

		r.Get("/admin", func(w http.ResponseWriter, r *http.Request) {
			_, claims, _ := jwtauth.FromContext(r.Context())
			w.Write([]byte(fmt.Sprintf("protected area. hi %v", claims["user_id"])))
		})
	})

	// // Public routes
	// r.Group(func(r chi.Router) {
	// 	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
	// 		w.Write([]byte("welcome anonymous"))
	// 	})
	// })

	r.Group(func(r chi.Router) {
		r.Post("/add", addbooks)
	})

	r.Group(func(r chi.Router) {
		r.Get("/read", getBooks)
	})

	r.Group(func(r chi.Router) {
		r.Get("/read", getBooks)
	})

	r.Group(func(r chi.Router) {
		r.Post("/edit", editbook)
	})

	r.Group(func(r chi.Router) {
		r.Post("/delete", deletebook)
	})

	// r.Group(func(r chi.Router) {
	// 	r.Get("/public", public)
	// })

	r.Group(func(r chi.Router) {
		r.Post("/login", login)
	})

	r.Group(func(r chi.Router) {
		r.Post("/signup", signup)
	})

	// Mount the admin sub-router
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Default port if not specified
	}
	fmt.Print("ACTIVE", port)
	log.Fatal(http.ListenAndServe(":"+port, r))

}
