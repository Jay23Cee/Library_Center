package config

import (
	"context"

	firebase "firebase.google.com/go/v4"
	"google.golang.org/api/option"
)

// Declare a global variable for the Firebase client
var FirebaseClient *firebase.App

// Initialize the Firebase client
func InitializeFirebase() {
	ctx := context.Background()
	opt := option.WithCredentialsFile("path/to/serviceAccountKey.json") // Update with the actual path to your service account key file
	app, err := firebase.NewApp(ctx, nil, opt)
	if err != nil {
		panic(err)
	}
	FirebaseClient = app
}

// UploadFileToStorage uploads the file to Firebase Storage
// UploadFileToStorage uploads the file to Firebase Storage
func UploadFileToStorage(file []byte, filename string) (string, error) {
	ctx := context.Background()
	client, err := FirebaseClient.Storage(ctx)
	if err != nil {
		return "", err
	}

	bucketName := "gs://library-xpress.appspot.com" // Replace with your Firebase Storage bucket name

	bucket, err := client.DefaultBucket()
	if err != nil {
		return "", err
	}

	obj := bucket.Object(filename)
	writer := obj.NewWriter(ctx)
	defer writer.Close()

	if _, err := writer.Write(file); err != nil {
		return "", err
	}

	if err := writer.Close(); err != nil {
		return "", err
	}

	url := "https://storage.googleapis.com/" + bucketName + "/" + filename
	return url, nil
}

