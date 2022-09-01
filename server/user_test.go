package main

import (
	"bookapi/api"
	"bytes"
	"fmt"
	"io/ioutil"
	"strings"
	"time"

	"net/http"
	"net/http/cookiejar"
	"net/http/httptest"
	"net/url"
	"testing"
)

func TestUserLogin(t *testing.T) {

	tt := []struct {
		name string
		data []byte
	}{
		{name: "This one should Fail Empty", data: []byte(`{"users":{"Email": "","Password": ""}}`)},
		{name: "This one should fail by email", data: []byte(`{"users":{"Email": "1test@test.com","Password": "pass123"}}`)},
		{name: "This one should fail by password", data: []byte(`{"users":{"Email": "test@test.com","Password": "pass12"}}`)},
		{name: "This one should pass", data: []byte(`{"users":{"Email": "User@test.com","Password": "pass123"}}`)},
	}

	for _, tc := range tt {

		req := httptest.NewRequest("POST", "https://localhost:8080/login", bytes.NewBuffer(tc.data))
		w := httptest.NewRecorder()
		api.Login(w, req)

		resp := w.Result()
		body, _ := ioutil.ReadAll(resp.Body)
		fmt.Println(string(body))
		if 200 != resp.StatusCode {
			t.Errorf("Status code not OK %v", tc.name)
		}

	}

}

func TestUserSignup(t *testing.T) {
	tt := []struct {
		name string
		data []byte
	}{
		{name: "This one should Fail Empty", data: []byte(`{"users":{"First_name": "","Last_name": "","Phone":"","Email": "","Password": ""}}`)},
		{name: "This one should Fail ALREADY exist", data: []byte(`{"users":{"First_name": "Stewie","Last_name": "Griffith","Phone":"","Email": "test@test.com","Password": "pass123"}}`)},
		{name: "This one should Pass", data: []byte(`{"users":{"First_name": "Stewie","Last_name": "Grimes","Phone":"21398457854","Email": "stewie@test.com","Password": "pass123"}}`)},
	}

	for _, tc := range tt {

		req := httptest.NewRequest("POST", "https://localhost:8080/signup", bytes.NewBuffer(tc.data))
		w := httptest.NewRecorder()
		api.Signup(w, req)

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

func TestCookie(t *testing.T) {

	app := NewApp()
	server := httptest.NewServer(app)
	defer server.Close()

	jar, err := cookiejar.New(nil)
	if err != nil {
		t.Error(err)
	}
	client := &http.Client{Jar: jar}

	resp, err := client.Get(server.URL + "/")
	if err != nil {
		t.Error(err)
	}

	buf := &bytes.Buffer{}
	buf.ReadFrom(resp.Body)
	if strings.Index(buf.String(), "Welcome") == -1 {
		t.Errorf("Root should say Welcome!:\n%s", buf.String())
	}

	resp, err = client.PostForm(
		server.URL+"/name",
		url.Values{"name": {"Nick"}},
	)
	if err != nil {
		t.Error(err)
	}

	buf.Reset()
	buf.ReadFrom(resp.Body)
	if !strings.Contains(buf.String(), "Hi Nick!") {
		t.Errorf("Root should say Hi Nick!:\n%s", buf.String())
	}
}

type App struct {
	*http.ServeMux
}

// Root is the root page of our application
func (a *App) Root(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "Hello!")
}

// NewApp constructs a new App and initializes our routing
func NewApp() *App {
	mux := http.NewServeMux()
	app := &App{mux}
	mux.HandleFunc("/", app.Root)
	mux.HandleFunc("/name", app.SetName) // <- NEW
	return app
}

func (a *App) SetName(w http.ResponseWriter, r *http.Request) {
	http.SetCookie(w, &http.Cookie{
		Name:     "name",
		Value:    r.FormValue("name"),
		HttpOnly: true,
		Expires:  time.Now().Add(24 * 14 * time.Hour),
	})
	http.Redirect(w, r, "/", http.StatusFound)
}
