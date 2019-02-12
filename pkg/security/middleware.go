package security

import (
	"net/http"
	"os"
	"strings"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/gorilla/context"
)

// UserMiddleWare makes sure they have a valid jwt before continuing
func UserMiddleWare(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authorization := r.Header.Get("Authorization")
		if len(strings.Split(authorization, ".")) != 3 {
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte(`{"status": 401, "error": "StatusUnauthorized"}`))
			return
		}

		token, _ := jwt.ParseWithClaims(authorization, &User{}, func(token *jwt.Token) (interface{}, error) {
			return []byte(os.Getenv("SIGNING_KEY")), nil
		})

		if claims, ok := token.Claims.(*User); ok && token.Valid {
			context.Set(r, "User", claims)
			next.ServeHTTP(w, r)
			return
		}

		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"status": 401, "error": "StatusUnauthorized"}`))
	})
}

// WSMiddleWare checks for a JWT header to make sure thehy have access too the given topic
func WSMiddleWare(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authorization := r.Header.Get("Authorization")
		if len(strings.Split(authorization, ".")) != 3 {
			context.Set(r, "User", &User{})
			next.ServeHTTP(w, r)
			return
		}

		token, _ := jwt.ParseWithClaims(authorization, &User{}, func(token *jwt.Token) (interface{}, error) {
			return []byte(os.Getenv("SIGNING_KEY")), nil
		})

		if claims, ok := token.Claims.(*User); ok && token.Valid {
			context.Set(r, "User", claims)
			next.ServeHTTP(w, r)
			return
		}

		context.Set(r, "User", &User{})
		next.ServeHTTP(w, r)
	})
}
