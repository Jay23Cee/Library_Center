package api

import (
	"bookapi/authenticator"
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
	//database.Devops()
	var user models.User
	link := Getlink()
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
	claims := token.Claims.(*utils.SignedDetails)

	url := GetURL()
	clientOptions := options.Client().ApplyURI(url)
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {

		http.Error(w, err.Error(), http.StatusBadGateway)
		return
	}
	collection := client.Database("BookAPI").Collection("users")

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	user_id := claims.Uid
	doc := bson.D{{Key: "User_id", Value: user_id}}

	err = collection.FindOne(context.Background(), doc).Decode(&user)

	if err != nil {

		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	e, err := json.Marshal(user)

	err = authenticator.MatchUserTypeToUid(user, user_id, "ADMIN")

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Write([]byte(e))
}

func Private_Login(w http.ResponseWriter, r *http.Request) {
	link := Getlink()
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
	url := GetURL()

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
	email := strings.ToLower(*JSONusers.Email)

	user := &models.Users{

		Email:    &email,
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

	///Data that will be sent back
	var userback models.User
	err = collection.FindOne(context.Background(), doc).Decode(&userback)

	if err != nil {

		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	e, err := json.Marshal(userback)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	//creating Token
	token, refreshToken, err := utils.MakeToken(*userback.Email, *userback.First_name, *userback.Last_name, *userback.User_type, userback.User_id)

	utils.ExpireAlltokens(w, r)
	//utils.UpdateAllTokens(token, refreshToken, userback.User_id)
	utils.Makecookie(w, r, token, refreshToken, false)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		http.Error(w, "Token Failed", http.StatusBadRequest)
		return
	}

	utils.UpdateAllTokens(token, refreshToken, result.User_id)

	w.Write([]byte(e))
	return
}

func Private_Login_Demo(w http.ResponseWriter, r *http.Request) {
	em := "admin@test.com"
	p := "pass123"
	link := Getlink()
	user_type := "ADMIN"
	w.Header().Set("Access-Control-Allow-Origin", link)
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// get
	url := GetURL()

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

	doc := bson.D{{"Email", em}, {"User_type", user_type}}

	var result models.Users
	err = collection.FindOne(context.TODO(), doc).Decode(&result)

	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		http.Error(w, "Invalid User Login", http.StatusBadRequest)
		return
	}
	err = utils.CheckAuth(user_type, *result.User_type)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		http.Error(w, "Unauthorized Login", http.StatusBadRequest)
		return
	}

	err = utils.CheckPassword(p, *result.Password)

	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		http.Error(w, "Invalid User Login", http.StatusBadRequest)
		return
	}

	///Data that will be sent back
	var userback models.User
	err = collection.FindOne(context.Background(), doc).Decode(&userback)

	if err != nil {

		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	e, err := json.Marshal(userback)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	//creating Token
	token, refreshToken, err := utils.MakeToken(*userback.Email, *userback.First_name, *userback.Last_name, *userback.User_type, userback.User_id)

	utils.ExpireAlltokens(w, r)
	//utils.UpdateAllTokens(token, refreshToken, userback.User_id)
	utils.Makecookie(w, r, token, refreshToken, false)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		http.Error(w, "Token Failed", http.StatusBadRequest)
		return
	}

	utils.UpdateAllTokens(token, refreshToken, result.User_id)

	w.Write([]byte(e))
	return
}

func PrivateLogout(w http.ResponseWriter, r *http.Request) {
	//database.Devops()
	link := Getlink()
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
	//database.Devops()

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
	fn := strings.ToLower(*users.First_name)
	ln := strings.ToLower(*users.Last_name)
	email := strings.ToLower(*users.Email)

	if len(fn) == 0 || len(ln) == 0 || len(email) == 0 {
		w.WriteHeader(http.StatusBadRequest)
		http.Error(w, "Invalid Data", http.StatusBadRequest)
		return
	}

	token, refreshToken, err := utils.MakeToken(email, fn, ln, U_T, UID_string)

	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		http.Error(w, "Token Failed", http.StatusBadRequest)
		return
	}

	time, err := time.Parse(time.RFC3339, time.Now().Format(time.RFC3339))
	// usertype

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
