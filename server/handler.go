package main

import (
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

func context_withouttime() context.Context {
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	return ctx
}

func makeconnection(w http.ResponseWriter, r *http.Request) *mongo.Client {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Expose-Headers", "Authorization")
	url := os.Getenv("REACT_APP_GO_URL")
	url = "mongodb+srv://mongo:LOsLH6a40mcR0QzB@cluster0.esomu.mongodb.net/?retryWrites=true&w=majority"
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
	// url := os.Getenv("REACT_APP_GO_URL")
	// clientOptions := options.Client().
	// 	ApplyURI(url)
	// ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	// defer cancel()

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

	url := os.Getenv("REACT_APP_GO_URL")
	jsonMap := make(map[string]Book)
	body, err := ioutil.ReadAll(r.Body)
	err = json.Unmarshal([]byte(body), &jsonMap)
	var temp Book
	temp = jsonMap["book"]

	clientOptions := options.Client().
		ApplyURI(url)
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

	doc := bson.D{{"Title", book.Title}, {"Author", book.Author}, {"_id", primitive.NewObjectID()}}
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
			{"$set", bson.D{{"Title", book.Title}, {"Author", book.Author}}},
		},
	)
	if err != nil {
		panic(err)
	}

	fmt.Printf("Updated %v Documents!\n", result.ModifiedCount)

}
