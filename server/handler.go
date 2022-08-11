package main

import (
	"bookapi/users"
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"

	"time"

	"github.com/dgrijalva/jwt-go"
	// "github.com/joho/godotenv"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Create a struct that will be encoded to a JWT.
// We add jwt.StandardClaims as an embedded type, to provide fields like expiry time
type Claims struct {
	Email string `bson:"Email"`
	jwt.StandardClaims
}

var jwtKey = []byte("my_secret_key")

type SignupRequest struct {
	Name     string `bson:"Name,omitempty"`
	Email    string `bson:"Email,omitempty"`
	Password string `bson:"Password,omitempty"`
}

func context_withouttime() context.Context {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	return ctx
}

func makeconnection(w http.ResponseWriter, r *http.Request) *mongo.Client {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Expose-Headers", "Authorization")
	
	// err := godotenv.Load()
	// if err != nil {
	// 	panic(err)
	// }

	url := os.Getenv("REACT_APP_GO_URL")
	clientOptions := options.Client().ApplyURI(url)
	ctx := context_withouttime()
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		panic(err)
	}
	return client
}

func getBooks(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Expose-Headers", "Authorization")

	mymap := make(map[int]Book)

	client := makeconnection(w, r)

	col := client.Database("BookAPI").Collection("book")
	var results []Book

	// Get a MongoDB document using the FindOne() method
	cursor, err := col.Find(context.TODO(), bson.D{})
	if err != nil {
		panic(err)
	}

	if err = cursor.All(context.TODO(), &results); err != nil {
		panic(err)
	}

	count := 0

	for _, result := range results {
		fmt.Println(result.ID)
		mymap[count] = result
		count = count + 1
	}

	e, err := json.Marshal(mymap)
	if err != nil {
		panic(err)
	}
	w.Write([]byte(e))

}

func deletebook(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Expose-Headers", "Authorization")
	// err := godotenv.Load()
	// if err != nil {
	// 	panic(err)
	// }

	url := os.Getenv("REACT_APP_GO_URL")
	jsonMap := make(map[string]Book)
	body, err := ioutil.ReadAll(r.Body)
	err = json.Unmarshal([]byte(body), &jsonMap)
	var temp Book
	temp = jsonMap["book"]

	clientOptions := options.Client().ApplyURI(url)
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		panic(err)
	}
	collection := client.Database("BookAPI").Collection("book")

	objid, err := primitive.ObjectIDFromHex(temp.ID)
	if err != nil {
		panic(err)
	}

	result, err := collection.DeleteOne(ctx, bson.M{"_id": objid})
	if err != nil {
		panic(err)
	}
	fmt.Fprintf(w, "\nDelete has Completed %v", result.DeletedCount)

}

func addbooks(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Expose-Headers", "Authorization")
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err)
	}
	// err = godotenv.Load()
	// if err != nil {
	// 	panic(err)
	// }

	url := os.Getenv("REACT_APP_GO_URL")
	jsonMap := make(map[string]Book)

	err = json.Unmarshal([]byte(body), &jsonMap)
	book := jsonMap["book"]

	fmt.Println(book)
	if err != nil {
		panic(err)
	}

	// err = godotenv.Load(".env")
	// if err != nil {
	// 	panic(err)
	// }

	clientOptions := options.Client().
		ApplyURI(url)
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {

		panic(err)
	}
	collection := client.Database("BookAPI").Collection("book")

	doc := bson.D{{"Title", book.Title}, {"Author", book.Author}, {"Publisher", book.Publisher}, {"Year", book.Year}, {"_id", primitive.NewObjectID()}}
	result, err := collection.InsertOne(ctx, doc)
	if err != nil {
		panic(err)
	}
	fmt.Fprintf(w, "\nBook has been added %v", result.InsertedID)
}

func CheckError(e error) {
	panic("unimplemented")
}

func editbook(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Expose-Headers", "Authorization")
	jsonMap := make(map[string]Book)
	body, err := ioutil.ReadAll(r.Body)
	err = json.Unmarshal([]byte(body), &jsonMap)
	var book Book
	book = jsonMap["book"]

	// err = godotenv.Load(".env")
	// if err != nil {
	// 	panic(err)
	// }
	url := os.Getenv("REACT_APP_GO_URL")

	clientOptions := options.Client().
		ApplyURI(url)
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {

		panic(err)
	}
	collection := client.Database("BookAPI").Collection("book")

	id, _ := primitive.ObjectIDFromHex(book.ID)
	result, err := collection.UpdateOne(
		ctx,
		bson.M{"_id": id},
		bson.D{
			{"$set", bson.D{{"Title", book.Title}, {"Author", book.Author}, {"Publisher", book.Publisher}, {"Year", book.Year}}},
		},
	)
	if err != nil {
		panic(err)
	}

	fmt.Printf("Updated %v Documents!\n", result.ModifiedCount)

}

func signup(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Expose-Headers", "Authorization")
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err)
	}
	// load
	// err = godotenv.Load()
	// if err != nil {
	// 	panic(err)
	// }

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
	fmt.Fprintf(w, "\nThis is body  %v", &jsonMap)
	users := jsonMap["users"]

	fmt.Println(url, "THIS IS THE URL")
	fmt.Println(users, "this is the users")
	if err != nil {
		panic(err)
	}

	// err = godotenv.Load(".env")
	// if err != nil {
	// 	panic(err)
	// }

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
	doc := bson.D{{"Name", user.Name}, {"Email", user.Email}, {"Password", user.Password}}
	result, err := collection.InsertOne(ctx, doc)
	if err != nil {
		panic(err)
	}
	fmt.Fprintf(w, "\nBook has been added %v", result)

}

func login(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Expose-Headers", "Authorization")

	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err)
	}

	fmt.Println(body)
	// load
	// err = godotenv.Load()
	// if err != nil {w
	// 	panic(err)
	// }

	// get
	url := os.Getenv("REACT_APP_GO_URL")
	if url == "" {
		fmt.Fprintf(w, "error")
	}

	jsonMap := make(map[string]users.User)

	err = json.Unmarshal([]byte(body), &jsonMap)
	if err != nil {
		panic(err)
	}

	JSONusers := jsonMap["users"]

	fmt.Println(url, "THIS IS THE URL")
	fmt.Println(JSONusers, "this is the users")
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
	user := &users.User{

		Email:    JSONusers.Email,
		Password: JSONusers.Password,
	}
	doc := bson.D{{"Email", user.Email}}
	var result users.User
	err = collection.FindOne(context.TODO(), doc).Decode(&result)
	if err != nil {
		panic(err)
	}

	err = CheckPassword(user.Password, result.Password)

	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)

		return
	}

	// Declare the expiration time of the token
	// here, we have kept it as 5 minutes
	expirationTime := time.Now().Add(5 * time.Minute)
	// Create the JWT claims, which includes the username and expiry time
	claims := &Claims{
		Email: result.Email,
		StandardClaims: jwt.StandardClaims{
			// In JWT, the expiry time is expressed as unix milliseconds
			ExpiresAt: expirationTime.Unix(),
		},
	}

	// Declare the token with the algorithm used for signing, and the claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	// Create the JWT string
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		// If there is an error in creating the JWT return an internal server error
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	cookie := &http.Cookie{
		Name:     "token",
		Value:    tokenString,
		Expires:  expirationTime,
		HttpOnly: true,
		Path:     "/",
	}

	// Finally, we set the client cookie for "token" as the JWT we just generated
	// we also set an expiry time which is the same as the token itself
	http.SetCookie(w, cookie)
	r.AddCookie(cookie)
	fmt.Fprintf(w, "\nCookie %v", cookie)

	fmt.Fprintf(w, "\nYou are login %v", result)

}

func public(w http.ResponseWriter, r *http.Request) {
	return
}

var SECRET = []byte("super-secret-auth-key")
var api_key = "1234"

func createJWTToken() (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)

	claims["exp"] = time.Now().Add(time.Hour).Unix()

	tokenStr, err := token.SignedString(SECRET)
	if err != nil {
		return "", err
	}

	return tokenStr, nil

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

func GetJwt(w http.ResponseWriter, r *http.Request) {
	if r.Header["api"] != nil {
		if r.Header["api"][0] == api_key {
			token, err := createJWTToken()
			if err != nil {
				return
			}
			fmt.Fprint(w, token)
		}
	}
}
