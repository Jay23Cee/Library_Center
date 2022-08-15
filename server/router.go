package main

import (
	"bookapi/users"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func connect_router() *chi.Mux {
	r := chi.NewRouter()

	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	r.Use(middleware.Timeout(60 * time.Second))

	fileServer := http.FileServer(http.Dir("./build/"))
	r.Handle("/*", http.StripPrefix("/", fileServer))

	r.Post("/add", Addbooks)
	r.Post("/edit", Editbook)
	r.Get("/read", GetBooks)
	r.Post("/delete", Deletebook)
	r.Post("/login", users.Login)
	r.Post("/signup", users.Signup)
	r.Post("/user", users.GetUser)
	r.Get("/logout", users.Logout)

	return r
}
