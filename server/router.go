package main

import (
	"bookapi/api"
	"net/http"
	"os"
	"time"

	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/chi/v5"
)

func Connect_router() *chi.Mux {
	r := chi.NewRouter()

	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	r.Use(middleware.Timeout(60 * time.Second))

	// fileServer := http.FileServer(http.Dir("./build/"))
	// r.Handle("/*", http.StripPrefix("/*", fileServer))
	// fileServer := http.FileServer(http.Dir("./ui/static/"))
	// r.Handle("/static/*", http.StripPrefix("/static", fileServer))
	FileServer(r)
	r.Post("/api/add", api.Addbooks)
	r.Post("/api/edit", api.Editbook)
	r.Get("/api/read", api.GetBooks)
	r.Post("/api/delete", api.Deletebook)
	r.Post("/api/login", api.Login)
	r.Post("/api/signup", api.Signup)
	r.Get("/api/user", api.GetUser)
	r.Get("/api/logout", api.Logout)

	return r
}

// FileServer is serving static files.
func FileServer(router *chi.Mux) {

	root := "./build/"
	fs := http.FileServer(http.Dir(root))

	router.Get("/*", func(w http.ResponseWriter, r *http.Request) {
		if _, err := os.Stat(root + r.RequestURI); os.IsNotExist(err) {
			http.StripPrefix(r.RequestURI, fs).ServeHTTP(w, r)
		} else {
			fs.ServeHTTP(w, r)
		}
	})
}
