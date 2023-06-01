package api

import (
	"bookapi/authenticator"
	"bookapi/database"

	// "bookapi/database"
	"bookapi/models"
	"bookapi/utils"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/golang-jwt/jwt"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func FindUser(collection *mongo.Collection, email string) (err error) {
	filter := bson.M{"Email": email}

	count, err := collection.CountDocuments(context.Background(), filter)
	if err != nil {
		err = errors.New("error occurred while checking for the Email")
		return err
	}
	if count > 0 {
		err = errors.New("error: This email already exist")
		return err
	}

	return err
}

func Getlink() string {
	database.Devops()
	link := os.Getenv("REACT_APP_CLIENT_URL")
	// Here get the login URL.

	return link
}

func getKey() []byte {
	key := os.Getenv("REACT_APP_GO_SECRET")
	return []byte(key)
}

func GetURL() string {

	url := os.Getenv("REACT_APP_GO_URL")
	return url
}

func GetUser(w http.ResponseWriter, r *http.Request) {
	database.Devops()

	link := Getlink()
	// Here get the login URL.
	w.Header().Set("Access-Control-Allow-Origin", link)
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	var user models.User
	url := GetURL()

	token, err := utils.Getcookie(w, r)

	if err != nil {

		return
	}
	if token == nil {

		return
	}
	claims := token.Claims.(*utils.SignedDetails)

	clientOptions := options.Client().ApplyURI(url)
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, clientOptions)
	collection := client.Database("BookAPI").Collection("users")

	if err != nil {

		return
	}
	user_id := claims.Uid
	doc := bson.D{{Key: "User_id", Value: user_id}}

	err = collection.FindOne(context.Background(), doc).Decode(&user)

	if err != nil {

		return
	}

	e, err := json.Marshal(user)

	err = authenticator.MatchUserTypeToUid(user, user_id, "USER")

	if err != nil {

		return
	}

	w.Write([]byte(e))
}

func Login(w http.ResponseWriter, r *http.Request) {
	database.Devops()
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
	email := strings.ToLower(*JSONusers.Email)
	user_type := "USER"
	collection := client.Database("BookAPI").Collection("users")
	user := &models.Users{

		Email:     &email,
		Password:  JSONusers.Password,
		User_type: &user_type,
	}
	doc := bson.D{{"Email", user.Email}, {"User_type", user.User_type}}

	var result models.Users
	err = collection.FindOne(context.TODO(), doc).Decode(&result)

	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		http.Error(w, "Invalid User Login", http.StatusBadRequest)
		return
	}
	err = utils.CheckAuth("USER", *result.User_type)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		http.Error(w, "Unauthorized Login", http.StatusBadRequest)
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

func Login_Demo(w http.ResponseWriter, r *http.Request) {
	em := "user@test.com"
	p := "pass123"
	link := Getlink()
	user_type := "USER"
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
	err = utils.CheckAuth("USER", *result.User_type)
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

func Logout(w http.ResponseWriter, r *http.Request) {
	database.Devops()
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

	refresh := http.Cookie{
		Name:   "r",
		Path:   "/refresh",
		MaxAge: -1}
	http.SetCookie(w, &refresh)
	r.AddCookie(&refresh)

	w.Write([]byte("Old cookie deleted. Logged out!\n"))
}

func Signup(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Expose-Headers", "Authorization")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusConflict)
		return
	}
	database.Devops()

	fmt.Printf("THIS IS THE BODY \n", body)
	url := os.Getenv("REACT_APP_GO_URL")
	if url == "" {
		fmt.Fprintf(w, "error")
	}
	jsonMap := make(map[string]models.Users)
	err = json.Unmarshal([]byte(body), &jsonMap)
	fmt.Println("HERE @ erorr IS THE SIGN UP SHEET", string(body))
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
	U_T := "USER"
	UID_string := UID.Hex()
	time, err := time.Parse(time.RFC3339, time.Now().Format(time.RFC3339))
	// usertype
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

func IsAuth(w http.ResponseWriter, r *http.Request, rtype []string) bool {
	database.Devops()
	var user models.Users

	token, err := utils.Getcookie(w, r)

	if err != nil {
		//check if there's a refresh token.err

		if err != nil {
			return false

		}

	} else if token == nil {
		err = errors.New("Not Auth")
		return false

	}
	claims := token.Claims.(*utils.SignedDetails)

	url := GetURL()
	clientOptions := options.Client().ApplyURI(url)
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {

		http.Error(w, err.Error(), http.StatusBadGateway)
		return false
	}
	collection := client.Database("BookAPI").Collection("users")

	user_id := claims.Uid
	doc := bson.D{{Key: "User_id", Value: user_id}}

	err = collection.FindOne(context.Background(), doc).Decode(&user)

	if err != nil {

		http.Error(w, err.Error(), http.StatusBadRequest)
		return false
	}

	valid := false
	for x := 0; x < len(rtype); x++ {
		//	fmt.Println(rtype[x], " TYPE OF ARRAY AD")
		err = utils.CheckAuth(*user.User_type, rtype[x])
		if err != nil {
			valid = false
			continue
		}
		valid = true
		return valid
	}
	//	fmt.Println(valid)

	return valid

}

func RefreshUser(w http.ResponseWriter, r *http.Request, claims string) models.User {
	database.Devops()
	var user models.User

	url := GetURL()
	clientOptions := options.Client().ApplyURI(url)
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {

		http.Error(w, err.Error(), http.StatusBadGateway)

	}
	collection := client.Database("BookAPI").Collection("users")

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)

	}
	user_id := claims
	doc := bson.D{{Key: "User_id", Value: user_id}}

	err = collection.FindOne(context.Background(), doc).Decode(&user)

	if err != nil {

		http.Error(w, err.Error(), http.StatusBadRequest)

	}

	return user
}

func Refreshcookie(w http.ResponseWriter, r *http.Request) {

	link := Getlink()
	// Here get the login URL.
	w.Header().Set("Access-Control-Allow-Origin", link)
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	// var user models.Userlogin
	cookieName := "r"
	cookie, err := r.Cookie(cookieName)

	if err != nil {

		http.Error(w, "Error retrieving r token", http.StatusBadGateway)

	}
	//rintln("getting token")
	token, err := jwt.ParseWithClaims(cookie.Value, &utils.SignedDetails{}, func(token *jwt.Token) (interface{}, error) {
		jwtKey := getKey()
		return jwtKey, nil
	})

	if err != nil {

		http.Error(w, "Unauthenticated", http.StatusBadGateway)
	}

	claims := token.Claims.(*utils.SignedDetails)

	if claims.ExpiresAt < time.Now().Local().Unix() {
		// msg := fmt.Sprintf("token is expired")
		//	fmt.Println("error")
		http.Error(w, "Error r token Expired", http.StatusBadGateway)

	}
	user_id := claims.Uid

	var user models.User

	user = RefreshUser(w, r, user_id)

	rtoken, _, _ := utils.MakeToken(*user.Email, *user.First_name, *user.Last_name, *user.User_type, user.User_id)

	utils.Makecookie(w, r, rtoken, user_id, true)

}
