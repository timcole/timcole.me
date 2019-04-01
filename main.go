package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/TimothyCole/timcole.me/pkg"
	"github.com/TimothyCole/timcole.me/pkg/chat"
	"github.com/TimothyCole/timcole.me/pkg/security"
	"github.com/TimothyCole/timcole.me/pkg/sockets"
	"github.com/TimothyCole/timcole.me/pkg/spotify"
	"github.com/TimothyCole/timcole.me/pkg/stream"
	"github.com/go-redis/redis"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

var (
	router = mux.NewRouter()
	err    error
	store  *redis.Client
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
	router.Use(middleware)

	router.HandleFunc("/login", security.UserLogin).Methods("POST")
	router.HandleFunc("/stats", pkg.SBStats).Methods("GET")
	router.HandleFunc("/nda/OnPublish", stream.OnPublish).Methods("GET")

	router.HandleFunc("/spotify/playing", spotify.GetPlaying).Methods("GET")

	// WebSockets
	pubsub := sockets.New()
	go pubsub.Start()
	pubsub.AddHandler((chat.New(pubsub)).Handler, "chat")
	router.Handle("/ws", security.WSMiddleWare(
		http.HandlerFunc(pubsub.Handler),
	)).Methods("GET")

	// NDA API Router
	var NDA = router.PathPrefix("/nda").Subrouter()
	NDA.Use(security.NDAMiddleWare)
	NDA.HandleFunc("/ping", func(w http.ResponseWriter, _ *http.Request) { w.Write([]byte("ok")) }).Methods("GET")

	// API 404 Handler
	router.NotFoundHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
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
		Handler: handlers.CORS(
			handlers.AllowedOrigins([]string{"*"}),
			handlers.AllowedHeaders([]string{"Authorization", "Content-Type"}),
			handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE"}),
		)(r),
		Addr: ":6969",
	}

	log.Printf("HTTP Server Started [%s]\n", httpServer.Addr)
	panic(httpServer.ListenAndServe())
}
