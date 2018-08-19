package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"cloud.google.com/go/datastore"
	jwt "github.com/dgrijalva/jwt-go"
	gctx "github.com/gorilla/context"
	"golang.org/x/crypto/bcrypt"
)

// Login is the json structure for logging in
type Login struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// Admin is the struction of an admin
type Admin struct {
	Name               string          `datastore:"name" json:"username"`
	PasswordHash       string          `datastore:"password" json:"-"`
	Permissions        map[string]bool `json:"permissions"`
	PermissionsString  string          `datastore:"permissions" json:"-"`
	JWT                string          `json:"jwt,omitempty"`
	jwt.StandardClaims `json:"-"`
}

// AdminMiddleWare makes sure they have a valid jwt before continueing
func AdminMiddleWare(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authorization := r.Header.Get("Authorization")
		token, _ := jwt.ParseWithClaims(authorization, &Admin{}, func(token *jwt.Token) (interface{}, error) {
			return []byte(settings.Get("SIGNING_KEY")), nil
		})

		if claims, ok := token.Claims.(*Admin); ok && token.Valid {
			gctx.Set(r, "Admin", claims)
			next.ServeHTTP(w, r)
			return
		}

		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"status": 401, "error": "StatusUnauthorized"}`))
	})
}

// AdminAuth checks the login and creates a session
func AdminAuth(w http.ResponseWriter, r *http.Request) {
	var login Login
	body, _ := ioutil.ReadAll(r.Body)
	err := json.Unmarshal(body, &login)
	if err != nil || len(login.Username) < 3 || len(login.Password) < 3 {
		// Didn't meet the reqs to even be an admin.
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"status": 401, "error": "StatusUnauthorized"}`))
		return
	}

	var ctx = context.Background()
	client, err := datastore.NewClient(ctx, "timcole-me")
	if err != nil {
		panic(err)
	}

	key := datastore.NameKey("Admins", login.Username, nil)
	admin := Admin{Permissions: make(map[string]bool)}
	err = client.Get(ctx, key, &admin)
	if err != nil {
		// Not an admin.
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"status": 401, "error": "StatusUnauthorized"}`))
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(admin.PasswordHash), []byte(login.Password))
	if err != nil {
		// Invalid Login
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"status": 401, "error": "StatusUnauthorized"}`))
		return
	}

	admin.Name = login.Username

	type perms []string
	var permission = perms{}
	fmt.Println(admin.PermissionsString)
	err = json.Unmarshal([]byte(admin.PermissionsString), &permission)
	if err != nil {
		// Can't get perms
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"status": 500, "error": "StatusInternalServerError"}`))
		return
	}
	for _, v := range permission {
		admin.Permissions[v] = true
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, admin)

	// Sign and get the complete encoded token as a string using the secret
	tokenString, err := token.SignedString([]byte(settings.Get("SIGNING_KEY")))
	if err != nil {
		// Failed to sign token
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"status": 500, "error": "StatusInternalServerError"}`))
		return
	}

	admin.JWT = tokenString
	resp, err := json.Marshal(admin)
	if err != nil {
		// Failed to encode return
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"status": 500, "error": "StatusInternalServerError"}`))
		return
	}

	w.Write(resp)
}
