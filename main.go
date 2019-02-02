package main

import (
	"crypto/tls"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/TimothyCole/timcole.me/pkg"
	config "github.com/TimothyCole/timcole.me/pkg/settings"
	spotifypkg "github.com/TimothyCole/timcole.me/pkg/spotify"
	"github.com/gorilla/mux"
	"golang.org/x/crypto/acme/autocert"
)

var (
	router     = mux.NewRouter()
	tcoleme    = router.Host("tcole.me").Subrouter()
	modestland = router.Host("modest.land").Subrouter()
	settings   = config.InitSettings()
	err        error
)

func main() {
	pkg.SetSettings(settings)

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
			Version    string
		}{Screenshot: ss, Version: Version})
	})

	// API Router
	var api = router.PathPrefix("/api").Subrouter()
	api.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "application/json")
			w.Header().Set("Access-Control-Allow-Origin", "*")
			next.ServeHTTP(w, r)
		})
	})
	api.HandleFunc("/login", pkg.AdminAuth).Methods("POST")
	api.HandleFunc("/stats", SBStats).Methods("GET")

	// Spotify API Router
	var spotifyAPI = api.PathPrefix("/spotify").Subrouter()
	var spotify = spotifypkg.NewSpotify(settings)
	spotifyAPI.HandleFunc("/playing", spotify.GetPlaying).Methods("GET")

	// Admin API Router
	var admin = api.PathPrefix("/admin").Subrouter()
	admin.Use(pkg.AdminMiddleWare)
	admin.HandleFunc("/ping", func(w http.ResponseWriter, _ *http.Request) { w.Write([]byte("ok")) }).Methods("GET")

	// tcole.me Handlers
	tcoleme.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "application/json")
			w.Header().Set("Access-Control-Allow-Origin", "*")
			next.ServeHTTP(w, r)
		})
	})
	tcoleme.HandleFunc("/ref/xsplit-vcam", func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, "https://www.xsplit.com/vcam?utm_medium=referral&utm_source=modesttim", 301)
	}).Methods("GET")

	// modest.land Handlers
	modestland.HandleFunc("/discord", DiscordInvite).Methods("GET")

	// API 404 Handler
	api.NotFoundHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte(`{"status": 404, "error": "StatusNotFound"}`))
	})

	var httpServer = &http.Server{
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 5 * time.Second,
		IdleTimeout:  120 * time.Second,
		Handler:      router,
		Addr:         ":8080",
	}

	// If mode is dev listen on 8080
	if os.Getenv("MODE") == "DEV" {
		httpServer.Addr = ":8080"
		fmt.Println("Starting server on " + httpServer.Addr)
		panic(httpServer.ListenAndServe())
	}

	// Run HTTP server secondly just in case
	go func() {
		httpServer.Addr = ":80"
		fmt.Println("Starting server on " + httpServer.Addr)
		if err := httpServer.ListenAndServe(); err != nil {
			log.Fatal(err)
		}
	}()

	// Run Autocert for HTTPS Certificate
	var acManager = autocert.Manager{
		Cache:      autocert.DirCache("./cache"),
		Prompt:     autocert.AcceptTOS,
		HostPolicy: autocert.HostWhitelist("timcole.me", "tcole.me", "modest.land"),
	}

	// Start HTTPS Server
	fmt.Println("Starting server on :443")
	httpServer.Addr = ":443"
	httpServer.TLSConfig = &tls.Config{GetCertificate: acManager.GetCertificate}
	panic(httpServer.ListenAndServeTLS("", ""))
}
