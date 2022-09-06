package main

import (
	"bookapi/api"

	"net/http"

	"github.com/go-chi/chi/v5"
)

func Connect_router() *chi.Mux {
	r := chi.NewRouter()

	r.NotFound(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		w.WriteHeader(http.StatusNotFound)
	}))

	r.Post("/signup", api.Signup)
	r.Get("/user", api.GetUser)
	r.Get("/logout", api.Logout)
	r.Post("/login", api.Login)

	r.Route("/api", func(r chi.Router) {
		r.Post("/add", api.Addbooks)
		r.Post("/edit", api.Editbook)
		r.Get("/read", api.GetBooks)
		r.Post("/delete", api.Deletebook)
	})
	return r
}
