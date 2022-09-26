package utils

import (
	"bookapi/database"
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var userCollection *mongo.Collection = database.OpenCollection(database.Client, "users")

func ExpireAlltokens(w http.ResponseWriter, r *http.Request) {
	c := http.Cookie{
		Name: "Token",

		MaxAge: -1}
	http.SetCookie(w, &c)
	r.AddCookie(&c)

	refresh := http.Cookie{
		Name:   "r",
		MaxAge: -1}
	http.SetCookie(w, &refresh)
	r.AddCookie(&refresh)
}

type SignedDetails struct {
	Email      string
	First_name string
	Last_name  string
	Uid        string
	User_Type  string
	jwt.StandardClaims
}

func UpdateAllTokens(signedToken string, signedRefreshToken string, userId string) {

	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)

	var updateObj primitive.D

	updateObj = append(updateObj, bson.E{"Token", signedToken})
	updateObj = append(updateObj, bson.E{"r", signedRefreshToken})

	Updated_at, _ := time.Parse(time.RFC3339, time.Now().Format(time.RFC3339))
	updateObj = append(updateObj, bson.E{"updated_at", Updated_at})

	upsert := true
	filter := bson.M{"User_id": userId}
	opt := options.UpdateOptions{
		Upsert: &upsert,
	}

	_, err := userCollection.UpdateOne(
		ctx,
		filter,
		bson.D{
			{"$set", updateObj},
		},
		&opt,
	)

	defer cancel()

	if err != nil {
		log.Panic(err.Error())
		return
	}

	return
}

func getKey() []byte {
	key := os.Getenv("REACT_APP_GO_SECRET")
	return []byte(key)
}

func MakeToken(email string, firstName string, lastName string, userType string, uid string) (signedToken string, signedRefreshToken string, err error) {

	claims := &SignedDetails{
		Email:      email,
		First_name: firstName,
		Last_name:  lastName,
		Uid:        uid,
		User_Type:  userType,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Minute * 5).Unix(), //1 day
		},
	}
	refreshclaims := &SignedDetails{

		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Local().Add(time.Hour * time.Duration(168)).Unix(), //1 day
		},
	}
	// refreshClaims := jwt.StandardClaims{
	// 	ExpiresAt: time.Now().Local().Add(time.Hour * time.Duration(168)).Unix(),
	// }

	// Declare the token with the algorithm used for signing, and the claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	// Create the JWT string
	jwtKey := getKey()
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		// If there is an error in creating the JWT return an internal server error
		// w.WriteHeader(http.StatusInternalServerError)

		return "", "", errors.New("Error creating token")

	}
	//Refresh Token
	r_t := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshclaims)
	// Create the JWT string
	jwtKey1 := getKey()
	refresh_t, err := r_t.SignedString(jwtKey1)
	if err != nil {
		return "", "", errors.New("Error creating token")

	}
	return tokenString, refresh_t, err

}

func Makecookie(w http.ResponseWriter, r *http.Request, token string, rtoken string) {

	// Finally, we set the client cookie for "token" as the JWT we just generated
	// we also set an expiry time which is the same as the token itself

	cookie := http.Cookie{
		Name:     "Token",
		Value:    token,
		Expires:  time.Now().Add(time.Minute * 5),
		Path:     "/",
		HttpOnly: true,
		Secure:   false,
	}

	cookie2 := http.Cookie{
		Name:     "r",
		Value:    rtoken,
		Expires:  time.Now().Local().Add(time.Hour * time.Duration(24)),
		Path:     "/refresh",
		HttpOnly: true,
		Secure:   false,
	}

	http.SetCookie(w, &cookie)
	r.AddCookie(&cookie)

	http.SetCookie(w, &cookie2)
	r.AddCookie(&cookie2)
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

func Getcookie(w http.ResponseWriter, r *http.Request) (*jwt.Token, error) {
	// var user models.Userlogin
	cookieName := "Token"
	cookie, err := r.Cookie(cookieName)

	if err != nil {
	

		return nil, errors.New("Error retrieving token")
	}

	token, err := jwt.ParseWithClaims(cookie.Value, &SignedDetails{}, func(token *jwt.Token) (interface{}, error) {
		jwtKey := getKey()
		return jwtKey, nil
	})

	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		fmt.Fprintf(w, "Unauthenticated")

	}

	return token, nil

}

func ValidateToken(signedToken string) (claims *SignedDetails, msg string) {
	token, err := jwt.ParseWithClaims(
		signedToken,
		&SignedDetails{},
		func(token *jwt.Token) (interface{}, error) {
			jwtKey := getKey()
			return jwtKey, nil
		},
	)

	if err != nil {
		msg = err.Error()
		return
	}

	claims, ok := token.Claims.(*SignedDetails)
	if !ok {
		msg = fmt.Sprintf("the token is invalid")
		msg = err.Error()
		return
	}

	if claims.ExpiresAt < time.Now().Local().Unix() {
		msg = fmt.Sprintf("token is expired")
		msg = err.Error()
		return
	}
	return claims, msg
}
