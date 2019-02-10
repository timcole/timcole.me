package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/TimothyCole/timcole.me/pkg"
	"github.com/TimothyCole/timcole.me/pkg/spotify"
	"github.com/go-redis/redis"
	"github.com/gorilla/context"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

var (
	router     = mux.NewRouter()
	tcoleme    = router.Host("tcole.me").Subrouter()
	modestland = router.Host("modest.land").Subrouter()
	err        error
	store      *redis.Client
)

func init() {
	store = redis.NewClient(&redis.Options{
		Addr:     os.Getenv("REDIS_ADDR"),
		Password: os.Getenv("REDIS_AUTH"),
	})

	if _, err := store.Ping().Result(); err != nil {
		panic(err)
	}

	log.Printf("Connected to Redis [%s]\n", store.Options().Addr)
}

func main() {
	var api = router.PathPrefix("/api").Subrouter()
	api.Use(func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			context.Set(r, "redis", store)
			w.Header().Set("Content-Type", "application/json")
			w.Header().Set("Access-Control-Allow-Origin", "*")
			next.ServeHTTP(w, r)
		})
	})
	api.HandleFunc("/login", pkg.AdminAuth).Methods("POST")
	api.HandleFunc("/stats", SBStats).Methods("GET")

	// Spotify API Router
	var spotifyRouter = api.PathPrefix("/spotify").Subrouter()
	spotifyRouter.HandleFunc("/playing", spotify.GetPlaying).Methods("GET")

	// Admin API Router
	var admin = api.PathPrefix("/admin").Subrouter()
	admin.Use(pkg.UserMiddleWare)
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

	r := handlers.CombinedLoggingHandler(os.Stdout, router)
	r = handlers.ProxyHeaders(r)
	var httpServer = &http.Server{
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 5 * time.Second,
		IdleTimeout:  120 * time.Second,
		Handler:      r,
		Addr:         ":6969",
	}

	log.Printf("HTTP Server Started [%s]\n", httpServer.Addr)
	panic(httpServer.ListenAndServe())
}
