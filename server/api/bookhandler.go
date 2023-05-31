package api

import (
	"bookapi/config"
	"bookapi/database"
	"bookapi/models"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
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

func Makeconnection(w http.ResponseWriter, r *http.Request) *mongo.Client {
	database.Devops()
	link := Getlink()
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

	access := IsAuth(w, r, []string{"ADMIN", "USER"})
	if !access {
		http.Error(w, "Unauthorize access", http.StatusBadGateway)
		return
	}

	mymap := make(map[int]models.Book)

	client := Makeconnection(w, r)

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
	//	fmt.Println("delete function hit")
	defer func() {
		if r := recover(); r != nil {
			log.Println("Recovered from panic:", r)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
		}
	}()

	database.Devops()
	link := Getlink()
	// Here get the login URL.

	w.Header().Set("Access-Control-Allow-Origin", link)
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	access := IsAuth(w, r, []string{"ADMIN"})
	if !access {
		http.Error(w, "Unauthorized access", http.StatusUnauthorized)
		return
	}

	url := os.Getenv("REACT_APP_GO_URL")
	jsonMap := make(map[string]models.Book)
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Println(err)
		http.Error(w, "Error reading request body", http.StatusBadRequest)
		return
	}
	err = json.Unmarshal([]byte(body), &jsonMap)
	if err != nil {
		log.Println(err)
		http.Error(w, "Error parsing request body", http.StatusBadRequest)
		return
	}
	var temp models.Book
	temp = jsonMap["book"]

	clientOptions := options.Client().ApplyURI(url)
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Println(err)
		http.Error(w, "Error connecting to MongoDB server", http.StatusBadGateway)
		return
	}
	collection := client.Database("BookAPI").Collection("book")

	objid, err := primitive.ObjectIDFromHex(temp.ID)
	if err != nil {
		log.Println(err)
		http.Error(w, "Error parsing ObjectID", http.StatusBadRequest)
		return
	}

	result, err := collection.DeleteOne(ctx, bson.M{"_id": objid})
	if err != nil {
		log.Println(err)
		http.Error(w, "Error deleting document", http.StatusBadRequest)
		return
	}
	fmt.Fprintf(w, "\nDelete has Completed %v", result.DeletedCount)
}

func Addbooks(w http.ResponseWriter, r *http.Request) {
	// Start your MongoDB connection and configuration setup
	database.Devops()
	link := Getlink()
	w.Header().Set("Access-Control-Allow-Origin", link)
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	url := os.Getenv("REACT_APP_GO_URL")
	clientOptions := options.Client().ApplyURI(url)
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadGateway)
		return
	}

	collection := client.Database("BookAPI").Collection("book")

	// Parse multipart form, 10 << 20 specifies a maximum upload of 10 MB files
	err = r.ParseMultipartForm(10 << 20)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Get the 'books' form data
	booksData := r.FormValue("books")
	var book models.Book
	err = json.Unmarshal([]byte(booksData), &book)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Get the file from the form
	file, handler, err := r.FormFile("bookImage")
	if err != nil {
		http.Error(w, "Error Retrieving the File", http.StatusInternalServerError)
		return
	}
	defer file.Close()

	// Firebase Storage
	ctx := context.Background()
	bucket, err := FirebaseClient.Storage(ctx)
	if err != nil {
		http.Error(w, "Failed to get default GCS Bucket", http.StatusInternalServerError)
		return
	}

	// Upload the file to Firebase Storage
	wc := bucket.Bucket("YOUR_BUCKET_NAME").Object(handler.Filename).NewWriter(ctx)
	if _, err = io.Copy(wc, file); err != nil {
		http.Error(w, "Unable to write data to bucket", http.StatusInternalServerError)
		return
	}
	if err := wc.Close(); err != nil {
		http.Error(w, "Unable to close bucket writer", http.StatusInternalServerError)
		return
	}

	// At this point, the image file is uploaded to Firebase, and the file's name is 'handler.Filename'.
	// Store the file's name and URL in MongoDB document

	// Construct the file URL based on Firebase Storage configuration
	fileURL := "https://storage.googleapis.com/YOUR_BUCKET_NAME/" + handler.Filename
	book.Img_url = fileURL

	// Use the book object to create the doc variable
	doc := bson.D{
		{"Title", book.Title},
		{"Author", book.Author},
		{"Publisher", book.Publisher},
		{"Year", book.Year},
		{"Img", handler.Filename},
		{"Img_url", book.Img_url},
		{"_id", primitive.NewObjectID()},
		{"Summary", book.Summary},
	}
	result, err := collection.InsertOne(ctx, doc)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	fmt.Fprintf(w, "\nBook has been added %v", result.InsertedID)
}


func AddBooksBulk(w http.ResponseWriter, r *http.Request) {
	database.Devops()
	link := Getlink()
	w.Header().Set("Access-Control-Allow-Origin", link)
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	access := IsAuth(w, r, []string{"ADMIN"})
	if !access {
		http.Error(w, "Unauthorized access", http.StatusBadGateway)
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

	var books []models.Book
	err = json.Unmarshal([]byte(body), &books)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	collection := client.Database("BookAPI").Collection("book")
	for _, book := range books {
		doc := bson.D{{"Title", book.Title}, {"Author", book.Author}, {"Publisher", book.Publisher}, {"Year", book.Year}, {"Img", book.Img}, {"Img_url", book.Img_url}, {"_id", primitive.NewObjectID()}, {"Summary", book.Summary}}
		_, err := collection.InsertOne(ctx, doc)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
	}
	fmt.Fprintf(w, "\nBooks have been added")
}

func BookImg(w http.ResponseWriter, r *http.Request) {

	database.Devops()
	link := Getlink()
	w.Header().Set("Access-Control-Allow-Origin", link)
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	access := IsAuth(w, r, []string{"ADMIN"})
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
	database.Devops()
	link := Getlink()
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
	//	fmt.Println(book)
	collection := client.Database("BookAPI").Collection("book")

	id, _ := primitive.ObjectIDFromHex(book.ID)
	result, err := collection.UpdateOne(
		ctx,
		bson.M{"_id": id},
		bson.D{
			{"$set", bson.D{{"Title", book.Title}, {"Author", book.Author}, {"Publisher", book.Publisher}, {"Year", book.Year}, {"Img", book.Img}, {"Img_url", book.Img_url}, {"Summary", book.Summary}}},
		},
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	fmt.Fprintf(w, "Updated %v Documents!\n", result.ModifiedCount)

}
