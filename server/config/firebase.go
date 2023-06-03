package config

import (
	"context"
	"fmt"
	"log"

	firebase "firebase.google.com/go/v4"
	"google.golang.org/api/option"
)

// Declare a global variable for the Firebase client
var FirebaseClient *firebase.App

// Initialize the Firebase client
func InitializeFirebase() error {
	ctx := context.Background()
	opt := option.WithCredentialsFile("./config/library-xpress-firebase.json") // Update with the actual path to your service account key file
	app, err := firebase.NewApp(ctx, nil, opt)
	if err != nil {
		return fmt.Errorf("failed to initialize Firebase: %v", err)
	}
	FirebaseClient = app
	return nil
}

// UploadFileToStorage uploads the file to Firebase Storage
func UploadFileToStorage(file []byte, filename string) (string, error) {
	ctx := context.Background()
	client, err := FirebaseClient.Storage(ctx)
	if err != nil {
		return "", fmt.Errorf("failed to get Firebase Storage client: %v", err)
	}

	bucketName := "library-xpress.appspot.com" // Replace with your Firebase Storage bucket name

	bucket, err := client.DefaultBucket()
	if err != nil {
		return "", fmt.Errorf("failed to get default Firebase Storage bucket: %v", err)
	}

	obj := bucket.Object(filename)
	writer := obj.NewWriter(ctx)
	defer func() {
		if err := writer.Close(); err != nil {
			log.Printf("failed to close Firebase Storage writer: %v", err)
		}
	}()

	if _, err := writer.Write(file); err != nil {
		return "", fmt.Errorf("failed to write file to Firebase Storage: %v", err)
	}

	url := fmt.Sprintf("https://storage.googleapis.com/%s/%s", bucketName, filename)
	return url, nil
}
