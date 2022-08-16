package router

import (
	"bookapi/book"
	"bookapi/users"
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

	r.Post("/add", book.Addbooks)
	r.Post("/edit", book.Editbook)
	r.Get("/read", book.GetBooks)
	r.Post("/delete", book.Deletebook)
	r.Post("/login", users.Login)
	r.Post("/signup", users.Signup)
	r.Get("/user", users.GetUser)
	r.Get("/logout", users.Logout)

	return r
}
