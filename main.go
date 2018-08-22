package main

import (
	"html/template"
	"net/http"
	"os"
	"strings"

	config "github.com/TimothyCole/timcole.me/settings"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/machinebox/graphql"
	"google.golang.org/appengine"
)

var (
	router   = mux.NewRouter()
	settings = config.InitSettings()
	gql      = graphql.NewClient("https://gql.twitch.tv/gql")
)

func main() {
	var static = http.StripPrefix("/assets", http.FileServer(http.Dir("./build")))
	router.PathPrefix("/assets").Handler(static)

	router.NotFoundHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		uri := strings.Split(r.RequestURI, "/")

		var ss string
		if len(uri) == 3 && uri[1] == "ss" {
			ss = uri[2]
		}

		temp, _ := template.ParseFiles("./build/index.html")
		temp.Execute(w, struct {
			Screenshot string
		}{Screenshot: ss})
	})

	// API Router
	var api = router.PathPrefix("/api").Subrouter()
	api.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "application/json")
			next.ServeHTTP(w, r)
		})
	})
	api.HandleFunc("/login", AdminAuth).Methods("POST")

	// Public Stream API Router
	var stream = api.PathPrefix("/stream").Subrouter()
	stream.HandleFunc("/message", GetStreamMessage).Methods("GET")
	stream.HandleFunc("/emotes", GetEmotes).Methods("GET")

	// Admin API Router
	var admin = api.PathPrefix("/admin").Subrouter()
	admin.Use(AdminMiddleWare)
	admin.HandleFunc("/ping", func(w http.ResponseWriter, r *http.Request) { w.Write([]byte("ok")) }).Methods("GET")
	// Admin Stream API Router
	var streamAdmin = admin.PathPrefix("/stream").Subrouter()
	streamAdmin.HandleFunc("/message", SetStreamMessage).Methods("POST")

	// API 404 Handler
	api.NotFoundHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte(`{"status": 404, "error": "StatusNotFound"}`))
	})

	// Respond to App Engine and Compute Engine health checks.
	// Indicate the server is healthy.
	router.HandleFunc("/_ah/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("ok"))
	}).Methods("GET")

	// Delegate all of the HTTP routing and serving to the gorilla/mux router.
	http.Handle("/", handlers.CombinedLoggingHandler(os.Stderr, router))

	appengine.Main()
}
