package spotify

import (
	"encoding/json"
	"net/http"

	"github.com/go-redis/redis"
	"github.com/gorilla/context"
)

// GetPlaying returns the currently playing some over http
func GetPlaying(w http.ResponseWriter, r *http.Request) {
	store := context.Get(r, "redis").(*redis.Client)

	resp, _ := request(V1, "GET", "/me/player", nil, nil, struct {
		Authorization string `url:"authorization"`
	}{Authorization: getAuth(store)})

	var player interface{}
	json.Unmarshal(resp, &player)

	j, _ := json.Marshal(struct {
		Status int         `json:"status"`
		Player interface{} `json:"player"`
	}{Status: 200, Player: player})

	w.Write(j)
}
