package utils

import (
	"bookapi/components"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt"
)

func getKey() []byte {
	key := os.Getenv("REACT_APP_GO_SECRET")
	return []byte(key)
}
func Makecookie(w http.ResponseWriter, r *http.Request, result components.Users) {
	claims := jwt.StandardClaims{
		Issuer:    result.ID,
		ExpiresAt: time.Now().Add(time.Minute * 5).Unix(), //1 day
	}

	// Declare the token with the algorithm used for signing, and the claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	// Create the JWT string
	jwtKey := getKey()
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		// If there is an error in creating the JWT return an internal server error
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	cookie := http.Cookie{
		Name:     "Token",
		Value:    tokenString,
		Expires:  time.Now().Add(time.Minute * 5),
		Path:     "/",
		HttpOnly: true,
		Secure:   false,
	}

	// Finally, we set the client cookie for "token" as the JWT we just generated
	// we also set an expiry time which is the same as the token itself
	http.SetCookie(w, &cookie)
	r.AddCookie(&cookie)
}

func validateJWT(next func(w http.ResponseWriter, r *http.Request)) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Header["Token"] != nil {
			token, err := jwt.Parse(r.Header["Token"][0], func(t *jwt.Token) (interface{}, error) {
				_, ok := t.Method.(*jwt.SigningMethodHMAC)
				if !ok {
					w.WriteHeader(http.StatusUnauthorized)
					w.Write([]byte("not authorized"))
				}
				SECRET := getKey()
				return SECRET, nil
			})

			if err != nil {
				w.WriteHeader(http.StatusUnauthorized)
				w.Write([]byte("not authorized: " + err.Error()))
			}

			if token.Valid {
				next(w, r)
			}

		} else {
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte("not authorized"))
		}
	})

}
