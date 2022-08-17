package main

import (
	"bookapi/api"
	"net/http"
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

	fileServer := http.FileServer(http.Dir("./build/"))
	r.Handle("/*", http.StripPrefix("/", fileServer))

	r.Post("/add", api.Addbooks)
	r.Post("/edit", api.Editbook)
	r.Get("/read", api.GetBooks)
	r.Post("/delete", api.Deletebook)
	r.Post("/login", api.Login)
	r.Post("/signup", api.Signup)
	r.Get("/user", api.GetUser)
	r.Get("/logout", api.Logout)

	return r
}
