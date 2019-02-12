package security

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/go-redis/redis"
	"github.com/gorilla/context"
	"golang.org/x/crypto/bcrypt"
)

// Login is the json structure for logging in
type Login struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// User is the redis struction of an user
type User struct {
	jwt.StandardClaims
	Username    string   `json:"username"`
	Password    string   `json:"password,omitempty"`
	Permissions []string `json:"permissions"`
	JWT         string   `json:"jwt,omitempty"`
}

// Access checks if an admin has permission to access a key
func (u *User) Access(key string) bool {
	a := false
	for _, v := range u.Permissions {
		if v == key {
			a = true
		}
	}
	return a
}

// UserLogin checks the login and creates a session
func UserLogin(w http.ResponseWriter, r *http.Request) {
	var login Login
	body, _ := ioutil.ReadAll(r.Body)
	err := json.Unmarshal(body, &login)
	if err != nil || len(login.Username) < 3 || len(login.Password) < 3 {
		// Didn't meet the reqs to even be a user.
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"status": 401, "error": "StatusUnauthorized"}`))
		return
	}

	store := context.Get(r, "redis").(*redis.Client)

	redisKey := fmt.Sprintf("user.%s", login.Username)
	adminRaw, err := store.Get(redisKey).Result()
	if err != nil {
		// Not a user.
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"status": 401, "error": "StatusUnauthorized"}`))
		return
	}

	var user *User
	if err := json.Unmarshal([]byte(adminRaw), &user); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"status": 500, "error": "StatusInternalServerError"}`))
	}

	if err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(login.Password)); err != nil {
		// Invalid Login
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"status": 401, "error": "StatusUnauthorized"}`))
		log.Println(err)
		return
	}
	// We're done with the password, remove it for security
	user.Password = ""

	// Populate StandardClaims
	currentTime := time.Now().UTC()
	user.IssuedAt = currentTime.Unix()
	user.ExpiresAt = currentTime.Add((24 * time.Hour) * 7).Unix()
	user.Subject = redisKey
	user.Issuer = "timcole.me-login"
	user.Audience = "user"

	// Generate JWT
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, user)

	// Sign and get the complete encoded token as a string using the secret
	tokenString, err := token.SignedString([]byte(os.Getenv("SIGNING_KEY")))
	if err != nil {
		// Failed to sign token
		log.Printf("Failed to sign JWT for %s.\n", user.Username)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"status": 500, "error": "StatusInternalServerError"}`))
		return
	}

	user.JWT = tokenString
	resp, err := json.Marshal(user)
	if err != nil {
		// Failed to encode return
		log.Printf("Failed to send JWT back to %s.\n", user.Username)
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"status": 500, "error": "StatusInternalServerError"}`))
		return
	}

	log.Printf("%s logged in.\n", user.Username)
	w.Write(resp)
}
