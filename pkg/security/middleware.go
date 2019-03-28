package security

import (
	"net/http"
	"os"
	"strings"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/gorilla/context"
)

// NDAMiddleWare makes sure they have a valid jwt and has NDA permissions
func NDAMiddleWare(next http.Handler) http.Handler {
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
			if claims.Access("NDA") {
				context.Set(r, "User", claims)
				next.ServeHTTP(w, r)
				return
			}
		}

		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"status": 401, "error": "StatusUnauthorized"}`))
	})
}

// WSMiddleWare checks for a JWT header to make sure thehy have access too the given topic
func WSMiddleWare(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var authorization string
		if r.Header.Get("Authorization") != "" {
			authorization = r.Header.Get("Authorization")
		} else if r.URL.Query().Get("authorization") != "" {
			authorization = r.URL.Query().Get("authorization")
		}
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
