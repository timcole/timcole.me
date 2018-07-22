package main

import (
	"net/http"
	"os"

	config "github.com/TimothyCole/timcole.me/settings"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"google.golang.org/appengine"
)

func main() {
	router := mux.NewRouter()

	settings := config.InitSettings()

	var static = http.StripPrefix("/assets", http.FileServer(http.Dir("./build")))
	router.PathPrefix("/assets").Handler(static)

	router.NotFoundHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./build/index.html")
	})

	router.HandleFunc("/123", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte(settings.Get("GAMER_BOY")))
	}).Methods("GET")

	// Respond to App Engine and Compute Engine health checks.
	// Indicate the server is healthy.
	router.HandleFunc("/_ah/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("ok"))
	}).Methods("GET")

	// Delegate all of the HTTP routing and serving to the gorilla/mux router.
	http.Handle("/", handlers.CombinedLoggingHandler(os.Stderr, router))

	appengine.Main()
}
