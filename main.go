package main

import (
	"crypto/tls"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/TimothyCole/timcole.me/pkg"
	"github.com/TimothyCole/timcole.me/pkg/commands"
	config "github.com/TimothyCole/timcole.me/pkg/settings"
	spotifypkg "github.com/TimothyCole/timcole.me/pkg/spotify"
	streampkg "github.com/TimothyCole/timcole.me/pkg/stream"
	"github.com/gorilla/mux"
	"github.com/kelseyhightower/gcscache"
	"github.com/machinebox/graphql"
	"golang.org/x/crypto/acme/autocert"
)

var (
	router     = mux.NewRouter()
	tcoleme    = router.Host("tcole.me").Subrouter()
	modestland = router.Host("modest.land").Subrouter()
	settings   = config.InitSettings()
	weetbot    = commands.InitCommands()
	gql        = graphql.NewClient("https://gql.twitch.tv/gql")
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

	// Stream API Router
	var streamAPI = api.PathPrefix("/stream").Subrouter()
	stream := streampkg.NewStream(settings, gql, weetbot)
	streamAPI.HandleFunc("/message", stream.GetStreamMessage).Methods("GET")
	streamAPI.HandleFunc("/emotes", stream.GetEmotes).Methods("GET")
	streamAPI.HandleFunc("/{channel:[0-9]+}/commands", stream.GetCommands).Methods("GET")
	streamAPI.Handle("/{channel:[0-9]+}/commands", pkg.AdminMiddleWare(http.HandlerFunc(stream.SetChannelCommand))).Methods("POST")
	streamAPI.Handle("/{channel:[0-9]+}/commands/{command}", pkg.AdminMiddleWare(http.HandlerFunc(stream.DeleteChannelCommand))).Methods("DELETE")
	streamAPI.HandleFunc("/{channel:[0-9]+}/commands/{command}", stream.GetChannelCommand).Methods("GET")

	// Spotify API Router
	var spotifyAPI = api.PathPrefix("/spotify").Subrouter()
	var spotify = spotifypkg.NewSpotify(settings)
	spotifyAPI.HandleFunc("/playing", spotify.GetPlaying).Methods("GET")

	// Admin API Router
	var admin = api.PathPrefix("/admin").Subrouter()
	admin.Use(pkg.AdminMiddleWare)
	admin.HandleFunc("/ping", func(w http.ResponseWriter, _ *http.Request) { w.Write([]byte("ok")) }).Methods("GET")
	// Admin Stream API Router
	var streamAdmin = admin.PathPrefix("/stream").Subrouter()
	streamAdmin.HandleFunc("/message", stream.SetStreamMessage).Methods("POST")

	// tcole.me Handlers
	tcoleme.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Content-Type", "application/json")
			w.Header().Set("Access-Control-Allow-Origin", "*")
			next.ServeHTTP(w, r)
		})
	})
	tcoleme.HandleFunc("/twitch-stats", TwitchStats).Methods("GET")
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

	// If mode is dev listen on 8080
	if os.Getenv("MODE") == "DEV" {
		fmt.Println("Starting server on :8080")
		panic(http.ListenAndServe(":8080", router))
	}

	// Run HTTP server secondly just in case
	go func() {
		fmt.Println("Starting server on :80")
		if err := http.ListenAndServe(":80", router); err != nil {
			log.Fatal(err)
		}
	}()

	// Create new Google Cloud Storage Cache
	var acCache *gcscache.Cache
	if acCache, err = gcscache.New("timcole-me-autocert"); err != nil {
		log.Fatal(err)
	}
	// Run Autocert for HTTPS Certificate
	var acManager = autocert.Manager{
		Cache:      acCache,
		Prompt:     autocert.AcceptTOS,
		HostPolicy: autocert.HostWhitelist("timcole.me", "tcole.me", "modest.land"),
	}

	// Start HTTPS Server
	fmt.Println("Starting server on :443")
	panic((&http.Server{
		Addr:      ":443",
		Handler:   router,
		TLSConfig: &tls.Config{GetCertificate: acManager.GetCertificate},
	}).ListenAndServeTLS("", ""))
}
