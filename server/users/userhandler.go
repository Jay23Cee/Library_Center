package users

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func devops() {
	err := godotenv.Load()
	if err != nil {
		panic(err)
	}
}

func getLink() string {
	devops()
	link := os.Getenv("REACT_APP_CLIENT_URL")
	// Here get the login URL.

	return link
}

func getKey() []byte {
	key := os.Getenv("REACT_APP_GO_SECRET")
	return []byte(key)
}

func getURL() string {
	url := os.Getenv("REACT_APP_GO_URL")
	return url
}

func GetUser(w http.ResponseWriter, r *http.Request) {
	devops()
	var user Userlogin
	link := getLink()
	// Here get the login URL.

	w.Header().Set("Access-Control-Allow-Origin", link)
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	cookieName := "Token"
	cookie, err := r.Cookie(cookieName)
	if err != nil {

		e, err := json.Marshal(user)
		if err != nil {
			panic(err)
		}
		w.Write([]byte(e))
		return
	} else {
		fmt.Printf("Get cookie %s=%s\n", cookieName, cookie.Value)
	}

	token, err := jwt.ParseWithClaims(cookie.Value, &jwt.StandardClaims{}, func(token *jwt.Token) (interface{}, error) {
		jwtKey := getKey()
		return jwtKey, nil
	})

	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		fmt.Fprintf(w, "Unauthenticated")

	}

	claims := token.Claims.(*jwt.StandardClaims)

	url := getURL()
	clientOptions := options.Client().ApplyURI(url)
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {

		panic(err)
	}
	collection := client.Database("BookAPI").Collection("users")

	objectId, err := primitive.ObjectIDFromHex(claims.Issuer)
	doc := bson.D{{Key: "_id", Value: objectId}}

	err = collection.FindOne(context.Background(), doc).Decode(&user)

	if err != nil {
		panic(err)
	}

	e, err := json.Marshal(user)
	if err != nil {
		panic(err)
	}
	w.Write([]byte(e))
}

func Login(w http.ResponseWriter, r *http.Request) {
	link := getLink()
	w.Header().Set("Access-Control-Allow-Origin", link)
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err)
	}

	// get
	url := getURL()

	jsonMap := make(map[string]Users)

	err = json.Unmarshal([]byte(body), &jsonMap)
	if err != nil {
		panic(err)
	}

	JSONusers := jsonMap["users"]

	if err != nil {
		panic(err)
	}

	clientOptions := options.Client().ApplyURI(url)
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {

		panic(err)
	}
	collection := client.Database("BookAPI").Collection("users")
	user := &Users{

		Email:    JSONusers.Email,
		Password: JSONusers.Password,
		ID:       JSONusers.ID,
	}
	doc := bson.D{{"Email", user.Email}}

	var result Users
	err = collection.FindOne(context.TODO(), doc).Decode(&result)

	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		fmt.Fprintf(w, "Email not found")
		return
	}

	err = CheckPassword(user.Password, result.Password)

	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		fmt.Fprintf(w, "Incorrect Password")

		return
	}

	makecookie(w, r, result)

	fmt.Fprintf(w, "\nsucess")
	return
}

func Logout(w http.ResponseWriter, r *http.Request) {
	devops()
	link := getLink()
	w.Header().Set("Access-Control-Allow-Origin", link)
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	// For JWT, log out is easy. Just destroy the cookie

	// see https://golang.org/pkg/net/http/#Cookie
	// Setting MaxAge<0 means delete cookie now.

	c := http.Cookie{
		Name: "Token",

		MaxAge: -1}
	http.SetCookie(w, &c)
	r.AddCookie(&c)

	w.Write([]byte("Old cookie deleted. Logged out!\n"))
}

func Signup(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Expose-Headers", "Authorization")
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err)
	}
	devops()

	// get
	url := os.Getenv("REACT_APP_GO_URL")
	if url == "" {
		fmt.Fprintf(w, "error")
	}

	jsonMap := make(map[string]SignupRequest)

	err = json.Unmarshal([]byte(body), &jsonMap)
	if err != nil {
		panic(err)
	}

	users := jsonMap["users"]

	if err != nil {
		panic(err)
	}

	clientOptions := options.Client().
		ApplyURI(url)
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {

		panic(err)
	}
	collection := client.Database("BookAPI").Collection("users")

	hash, err := HashPassword(users.Password)
	user := &SignupRequest{
		Name:     users.Name,
		Email:    users.Email,
		Password: string(hash),
	}
	doc := bson.D{{"Name", user.Name}, {"Email", user.Email}, {"Password", user.Password}, {"_id", primitive.NewObjectID()}}
	result, err := collection.InsertOne(ctx, doc)
	if err != nil {
		panic(err)
	}
	fmt.Fprintf(w, "\nBook has been added %v", result)

}
