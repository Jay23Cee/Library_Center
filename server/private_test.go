package main

import (
	"bookapi/api"
	"bookapi/utils"
	"bytes"
	"fmt"
	"io/ioutil"

	"net/http/httptest"
	"testing"
)

func TestPrivateLogin(t *testing.T) {

	tt := []struct {
		name string
		data []byte
	}{
		{name: "This one should Fail Empty", data: []byte(`{"users":{"Email": "","Password": ""}}`)},
		{name: "This one should fail by email", data: []byte(`{"users":{"Email": "1test@test.com","Password": "pass123"}}`)},
		{name: "This one should fail by password", data: []byte(`{"users":{"Email": "test@test.com","Password": "pass12"}}`)},
		{name: "This one should Fail by USER", data: []byte(`{"users":{"Email": "User@test.com","Password": "pass123"}}`)},
		{name: "This one should pass", data: []byte(`{"users":{"Email": "Admin@test.com","Password": "pass123"}}`)},
	}

	for _, tc := range tt {

		req := httptest.NewRequest("POST", "https://localhost:8080/private/login", bytes.NewBuffer(tc.data))
		w := httptest.NewRecorder()
		api.Private_Login(w, req)

		resp := w.Result()
		body, _ := ioutil.ReadAll(resp.Body)
		fmt.Println(string(body))
		if 200 != resp.StatusCode {
			t.Errorf("Status code not OK %v", tc.name)
		}

	}

}

func TestPrivateSignup(t *testing.T) {
	tt := []struct {
		name string
		data []byte
	}{
		{name: "This one should Fail Empty", data: []byte(`{"users":{"First_name": "","Last_name": "","Phone":"","Email": "","Password": ""}}`)},
		{name: "This one should Fail ALREADY exist", data: []byte(`{"users":{"First_name": "Stewie","Last_name": "Griffith","Phone":"","Email": "test@test.com","Password": "pass123"}}`)},
		{name: "This one should Pass", data: []byte(`{"users":{"First_name": "Stewie","Last_name": "Grimes","Phone":"21398457854","Email": "Brotewie@test.com","Password": "pass123"}}`)},
	}

	for _, tc := range tt {

		req := httptest.NewRequest("POST", "https://localhost:8080/private/signup", bytes.NewBuffer(tc.data))
		w := httptest.NewRecorder()
		api.Private_Signup(w, req)

		resp := w.Result()

		body, _ := ioutil.ReadAll(resp.Body)

		fmt.Println(string(body), "\n BODY TEST SIGNUP")
		if 200 != resp.StatusCode {
			t.Errorf("Status code not OK %v", tc.name)
		}

	}

}

// func TestGetUser(t *testing.T) {
// 	jar, err := cookiejar.New(nil)
// 	if err != nil {
// 		t.Error(err)
// 	}
// 	client := &http.Client{Jar: jar}

// 	resp, err := client.Get("https://localhost:8080/user")
// 	if err != nil {
// 		t.Error(err)
// 	}
// 	buf := &bytes.Buffer{}
// 	buf.ReadFrom(resp.Body)
// 	fmt.Println(resp)

// 	tt := []struct {
// 		name string
// 		data []byte
// 	}{
// 		{name: "This one should Fail Empty", data: []byte(`{"users":{"First_name": "","Last_name": "","Phone":"","Email": "","Password": ""}}`)},
// 		{name: "This one should Fail ALREADY exist", data: []byte(`{"users":{"First_name": "Stewie","Last_name": "Griffith","Phone":"","Email": "test@test.com","Password": "pass123"}}`)},
// 		{name: "This one should Pass", data: []byte(`{"users":{"First_name": "Stewie","Last_name": "Grimes","Phone":"21398457854","Email": "stewie@test.com","Password": "pass123"}}`)},
// 	}

// 	for _, tc := range tt {

// 		req := httptest.NewRequest("GET", "https://localhost:8080/user", bytes.NewBuffer(tc.data))
// 		req.Header.Add("Set-Cookie", )
// 		w := httptest.NewRecorder()
// 		api.Signup(w, req)

// 		resp := w.Result()

// 		body, _ := ioutil.ReadAll(resp.Body)

// 		fmt.Println(string(body), "\n BODY TEST SIGNUP")
// 		if 200 != resp.StatusCode {
// 			t.Errorf("Status code not OK %v", tc.name)
// 		}

// 	}
// }

func TestGetPrivate(t *testing.T) {

	tt := []struct {
		name      string
		email     string
		firstName string
		lastName  string
		userType  string
		uid       string
		data      []byte
	}{
		{name: "This one should Fail Empty", data: []byte(`{"users":{"Email": "","Password": ""}}`), email: "", firstName: "", lastName: "", userType: "", uid: ""},
		{name: "This one should fail by email", data: []byte(`{"users":{"Email": "1test@test.com","Password": "pass123"}}`), email: "", firstName: "", lastName: "", userType: "", uid: ""},
		{name: "This one should fail by password", data: []byte(`{"users":{"Email": "test@test.com","Password": "pass12"}}`), email: "", firstName: "", lastName: "", userType: "", uid: ""},
		{name: "This one should fail by ADMIN", data: []byte(`{"users":{"Email": "Admin@test.com","Password": "pass123"}}`), email: "", firstName: "", lastName: "", userType: "", uid: ""},
	
	}

	for _, tc := range tt {

		req := httptest.NewRequest("GET", "https://localhost:8080/user", bytes.NewBuffer(tc.data))
		req.Header.Set("Access-Control-Allow-Credentials", "true")
		w := httptest.NewRecorder()
		token, rtoken, err := utils.MakeToken(tc.email, tc.firstName, tc.lastName, tc.userType, tc.uid)

		if err != nil {
			t.Errorf("ERROR making token %v", err)
		}
		utils.Makecookie(w, req, token, rtoken)
		api.GetPrivate(w, req)

		resp := w.Result()
		body, _ := ioutil.ReadAll(resp.Body)
		fmt.Println(string(body))
		if 200 != resp.StatusCode {
			t.Errorf("Status code not OK %v", tc.name)
			continue
		}

	}
	fmt.Printf("SUCESS Getuser ")

}
