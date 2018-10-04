package main

import (
	"html/template"
	"net/http"
	"os"
	"strings"

	"github.com/TimothyCole/timcole.me/pkg"
	"github.com/TimothyCole/timcole.me/pkg/commands"
	config "github.com/TimothyCole/timcole.me/pkg/settings"
	spotifypkg "github.com/TimothyCole/timcole.me/pkg/spotify"
	streampkg "github.com/TimothyCole/timcole.me/pkg/stream"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/machinebox/graphql"
	"google.golang.org/appengine"
)

var (
	router     = mux.NewRouter()
	tcoleme    = router.Host("tcole.me").Subrouter()
	modestland = router.Host("modest.land").Subrouter()
	settings   = config.InitSettings()
	weetbot    = commands.InitCommands()
	gql        = graphql.NewClient("https://gql.twitch.tv/gql")
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
		}{Screenshot: ss})
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
	tcoleme.HandleFunc("/twitch-stats", TwitchStats).Methods("GET")

	// modest.land Handlers
	modestland.HandleFunc("/discord", DiscordInvite).Methods("GET")

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
