package api

import (
	"bookapi/models"
	"bookapi/utils"
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/go-playground/validator"
	"github.com/golang-jwt/jwt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var validate = validator.New()

func getPrivateKey() []byte {
	key := os.Getenv("REACT_APP_GO_A_SECRET")
	return []byte(key)
}

func GetPrivate(w http.ResponseWriter, r *http.Request) {
	devops()
	var user models.Userlogin
	link := getLink()
	// Here get the login URL.

	w.Header().Set("Access-Control-Allow-Origin", link)
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	token, err := utils.Getcookie(w, r)

	if err != nil {
		return
	}
	if token == nil {
		return
	}
	claims := token.Claims.(*jwt.StandardClaims)

	url := getURL()
	clientOptions := options.Client().ApplyURI(url)
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {

		http.Error(w, err.Error(), http.StatusBadGateway)
		return
	}
	collection := client.Database("BookAPI").Collection("users")

	objectId, err := primitive.ObjectIDFromHex(claims.Issuer)
	doc := bson.D{{Key: "_id", Value: objectId}}

	err = collection.FindOne(context.Background(), doc).Decode(&user)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	e, err := json.Marshal(user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	w.Write([]byte(e))
}

func Private_Login(w http.ResponseWriter, r *http.Request) {
	link := getLink()
	w.Header().Set("Access-Control-Allow-Origin", link)
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// get
	url := getURL()

	jsonMap := make(map[string]models.Users)

	err = json.Unmarshal([]byte(body), &jsonMap)

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	JSONusers := jsonMap["users"]

	clientOptions := options.Client().ApplyURI(url)
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {

		w.WriteHeader(http.StatusUnauthorized)
		http.Error(w, "Connection Failed", http.StatusBadRequest)
		return
	}
	collection := client.Database("BookAPI").Collection("users")
	user := &models.Users{

		Email:    JSONusers.Email,
		Password: JSONusers.Password,
	}
	doc := bson.D{{"Email", user.Email}}

	var result models.Users
	err = collection.FindOne(context.TODO(), doc).Decode(&result)

	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		http.Error(w, "Invalid User Login", http.StatusBadRequest)
		return
	}

	err = utils.CheckPassword(*user.Password, *result.Password)

	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		http.Error(w, "Invalid User Login", http.StatusBadRequest)
		return
	}

	err = utils.CheckAuth("ADMIN", *result.User_type)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		http.Error(w, "Unauthorized Login", http.StatusBadRequest)
		return
	}

	token, refreshToken, err := utils.MakeToken(*result.Email, *result.First_name, *result.Last_name, *result.User_type, result.User_id)
	utils.UpdateAllTokens(token, refreshToken, result.User_id)

	fmt.Fprintf(w, "\nsucess")
	return
}

func PrivateLogout(w http.ResponseWriter, r *http.Request) {
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

func Private_Signup(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Expose-Headers", "Authorization")
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusConflict)
		return
	}
	devops()

	// get
	url := os.Getenv("REACT_APP_GO_URL")
	if url == "" {
		fmt.Fprintf(w, "error")
	}
	jsonMap := make(map[string]models.Users)

	err = json.Unmarshal([]byte(body), &jsonMap)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)

		return
	}

	users := jsonMap["users"]

	clientOptions := options.Client().
		ApplyURI(url)
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadGateway)
		return
	}
	collection := client.Database("BookAPI").Collection("users")

	newEmail := FindUser(collection, *users.Email)

	if newEmail != nil {
		http.Error(w, newEmail.Error(), http.StatusBadRequest)
		return
	}

	hash, err := utils.HashPassword(*users.Password)

	if err != nil {
		http.Error(w, newEmail.Error(), http.StatusBadRequest)
		return
	}
	UID := primitive.NewObjectID()
	U_T := "ADMIN"
	UID_string := UID.Hex()

	token, refreshToken, err := utils.MakeToken(*users.Email, *users.First_name, *users.Last_name, U_T, UID_string)

	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		http.Error(w, "Token Failed", http.StatusBadRequest)
		return
	}

	time, err := time.Parse(time.RFC3339, time.Now().Format(time.RFC3339))
	// usertype

	fn := strings.ToLower(*users.First_name)
	ln := strings.ToLower(*users.Last_name)
	email := strings.ToLower(*users.Email)

	user := &models.Users{
		ID:            UID,
		User_id:       UID_string,
		First_name:    &fn,
		Last_name:     &ln,
		Phone:         users.Phone,
		Token:         &token,
		Refresh_token: &refreshToken,
		Email:         &email,
		Password:      &hash,
		Created_at:    time,
		Updated_at:    time,
		User_type:     &U_T,
	}

	_, err = collection.InsertOne(ctx, user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	fmt.Fprintf(w, "\nSucess ==> ")
}