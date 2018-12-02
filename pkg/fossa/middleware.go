package fossa

import (
	"net/http"
	"strings"

	gctx "github.com/gorilla/context"
)

const (
	botUA         = "Fossabot"
	channelHeader = "X-Fossabot-Channelname"
	// User-Agent: Fossabot 1.0
	// X-Fossabot-Channelname: modesttim
)

// Middleware is the middleware to ensure every thing is from fossabot with a channelname header
func Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/plain")

		channel := r.Header.Get(channelHeader)
		if strings.Contains(r.UserAgent(), botUA) && channel != "" {
			gctx.Set(r, "Channel", strings.ToLower(channel))

			next.ServeHTTP(w, r)
			return
		}

		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte("Unauthorized"))
	})
}
