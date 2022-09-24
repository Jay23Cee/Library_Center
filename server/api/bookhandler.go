package api

import (
	"bookapi/models"
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Create a struct that will be encoded to a JWT.
// We add jwt.StandardClaims as an embedded type, to provide fields like expiry time

func makeconnection(w http.ResponseWriter, r *http.Request) *mongo.Client {
	devops()
	link := getLink()
	// Here get the login URL.

	w.Header().Set("Access-Control-Allow-Origin", link)
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	url := os.Getenv("REACT_APP_GO_URL")
	clientOptions := options.Client().ApplyURI(url)
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {

		http.Error(w, err.Error(), http.StatusBadGateway)
		return nil

	}
	return client
}

func GetBooks(w http.ResponseWriter, r *http.Request) {

	mymap := make(map[int]models.Book)

	client := makeconnection(w, r)

	// users.GetUser(w, r)

	col := client.Database("BookAPI").Collection("book")
	var results []models.Book

	// Get a MongoDB document using the FindOne() method
	cursor, err := col.Find(context.TODO(), bson.D{})
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err = cursor.All(context.TODO(), &results); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	count := 0

	for _, result := range results {
		mymap[count] = result
		count = count + 1
	}

	e, err := json.Marshal(mymap)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	w.Write([]byte(e))

}

func Deletebook(w http.ResponseWriter, r *http.Request) {
	devops()
	link := getLink()
	// Here get the login URL.

	w.Header().Set("Access-Control-Allow-Origin", link)
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	access := isAuth(w, r, "ADMIN")
	if !access {
		http.Error(w, "Unauthorize access", http.StatusBadGateway)
		return
	}

	url := os.Getenv("REACT_APP_GO_URL")
	jsonMap := make(map[string]models.Book)
	body, err := ioutil.ReadAll(r.Body)
	err = json.Unmarshal([]byte(body), &jsonMap)
	var temp models.Book
	temp = jsonMap["book"]

	clientOptions := options.Client().ApplyURI(url)
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadGateway)
		return
	}
	collection := client.Database("BookAPI").Collection("book")

	objid, err := primitive.ObjectIDFromHex(temp.ID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	result, err := collection.DeleteOne(ctx, bson.M{"_id": objid})
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	fmt.Fprintf(w, "\nDelete has Completed %v", result.DeletedCount)
	
}

func Addbooks(w http.ResponseWriter, r *http.Request) {
	
	fmt.Println("\n\n\n HERE AT addbooks")
	devops()
	link := getLink()
	w.Header().Set("Access-Control-Allow-Origin", link)
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// access := isAuth(w, r, "ADMIN")
	// if !access {
	// 	http.Error(w, "Unauthorize access", http.StatusBadGateway)
	// 	return
	// }
	url := os.Getenv("REACT_APP_GO_URL")
	clientOptions := options.Client().ApplyURI(url)
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadGateway)
		return
	}

	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	jsonMap := make(map[string]models.Book)

	err = json.Unmarshal([]byte(body), &jsonMap)
	
	
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	book := jsonMap["book"]

	defer cancel()
	if err != nil {

		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	collection := client.Database("BookAPI").Collection("book")

	doc := bson.D{{"Title", book.Title}, {"Author", book.Author}, {"Publisher", book.Publisher}, {"Year", book.Year},{"Img", book.Img}, {"Img_url", book.Img_url}, {"_id", primitive.NewObjectID()}}
	result, err := collection.InsertOne(ctx, doc)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	fmt.Fprintf(w, "\nBook has been added %v", result.InsertedID)
}

func BookImg(w http.ResponseWriter, r *http.Request) {

	devops()
	link := getLink()
	w.Header().Set("Access-Control-Allow-Origin", link)
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	access := isAuth(w, r, "ADMIN")
	if !access {
		http.Error(w, "Unauthorize access", http.StatusBadGateway)
		return
	}

	url := os.Getenv("REACT_APP_GO_URL")
	clientOptions := options.Client().ApplyURI(url)
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadGateway)
		return
	}

	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	jsonMap := make(map[string]models.Book)

	err = json.Unmarshal([]byte(body), &jsonMap)
	book := jsonMap["book"]

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	defer cancel()
	if err != nil {

		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	collection := client.Database("BookAPI").Collection("book")

	doc := bson.D{{"Title", book.Title}, {"Author", book.Author}, {"Publisher", book.Publisher}, {"Year", book.Year}, {"_id", primitive.NewObjectID()}}
	result, err := collection.InsertOne(ctx, doc)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	fmt.Fprintf(w, "\nBook has been added %v", result.InsertedID)
}
func Editbook(w http.ResponseWriter, r *http.Request) {
	devops()
	link := getLink()
	w.Header().Set("Access-Control-Allow-Origin", link)

	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	jsonMap := make(map[string]models.Book)
	body, err := ioutil.ReadAll(r.Body)
	err = json.Unmarshal([]byte(body), &jsonMap)
	var book models.Book
	book = jsonMap["book"]

	url := os.Getenv("REACT_APP_GO_URL")

	clientOptions := options.Client().
		ApplyURI(url)
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {

		http.Error(w, err.Error(), http.StatusBadGateway)
		return
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
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	fmt.Fprintf(w, "Updated %v Documents!\n", result.ModifiedCount)

}
